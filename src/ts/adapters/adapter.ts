import { ethers, Contract, Signer } from 'ethers';
import { Address } from '../address';
import { RelayRequest } from '../relayer/relay-request';
import { decodeRelayResult, EncodedRelayResult } from '../relayer/relay-serialization';
import { ERC2771 } from '../utils/erc2771';
import { EIP712 } from '../utils/eip712';
import { PriceInfo, Purchase } from '../contract-defined-types';
import { EthereumError, Web3Error } from '../error';

export class AdapterComponent<T extends ethers.ContractRunner> 
{
   public readonly runner: T;

   public constructor(
      runner: T
   ){
      this.runner = runner;
   }
} 

export class MetaTXAdapterComponent 
   extends AdapterComponent<ethers.Signer>
{
   private readonly forwarder: ethers.Contract;

   public constructor(
      runner: ethers.Signer,
      forwarder: ethers.Contract
   ){
      super(runner);
      this.forwarder = forwarder;
   }

   public async createForwarderRequest<T>(
      contractAddress: Address,
      contractInterface: ethers.Interface,
      func: string,
      params: ReadonlyArray<any>,
      deadline: bigint,
      responseEvent: string,
      onResponseFunction: (...args: any[]) => T
   ): Promise<RelayRequest<T>>
   {
      let forwarderDomain = await EIP712.getDomainOfContract(this.forwarder);

      let userAddress = await this.runner.getAddress();

      let forwarderNonce = await this.forwarder.nonces(userAddress);

      let calldata = contractInterface.encodeFunctionData(func, params);

      let forwarderRequest: ERC2771.ForwardRequest = {
         from: userAddress,
         to: contractAddress.stringValue,
         value: BigInt(0),
         gas: BigInt(30_000_000),
         nonce: forwarderNonce,
         deadline: BigInt(Math.floor(Date.now() / 1000)) + deadline,
         data: calldata
      };

      let signature = await (
         this.runner.signTypedData(
               forwarderDomain,
               ERC2771.ForwardRequestTypeDef,
               forwarderRequest));
      
      let onResponseFunctionWithDecode = 
         (encodedResults: EncodedRelayResult[]) => {
            let args = encodedResults.map(decodeRelayResult);
            return onResponseFunction(...args);
         };

      return {
         request: forwarderRequest,
         signature: signature,
         responseEvent: responseEvent,
         onResponse: onResponseFunctionWithDecode
      };
   }
}

export abstract class Adapter<
   T extends ethers.ContractRunner, 
   U extends AdapterComponent<T>
>{
   protected readonly component: U;
   protected readonly contract: ethers.Contract;
   protected readonly contractAddress: Address;
   private txTimeOut: number;
   private eventTimeout: number;

   public constructor (
      contractAddress: Address, 
      abi: any, 
      component: U,
      txTimeout: number = 60000,
      eventTimeout: number = 30000)
   {
      this.component = component;
      this.contractAddress = contractAddress;
      this.contract = 
         new ethers.Contract(contractAddress.stringValue, abi, component.runner);
      this.txTimeOut = txTimeout;
      this.eventTimeout = eventTimeout;
   }

   protected async callAndParseLog<V>(
   tx: ethers.TransactionResponse,
   eventName: string,
   onEmit: (...args: any[]) => V
   ): Promise<V> 
   {
      const receipt = await Promise.race([
         tx.wait(),
         new Promise<never>((_, reject) =>
            setTimeout(
               () => reject(new EthereumError("Transaction confirmation timeout")),
               this.txTimeOut
            ))
      ]);

      if (!receipt) {
         throw new EthereumError("Transaction failed");
      }

      const logs = await this.contract.queryFilter(
         this.contract.filters[eventName]?.(),
         receipt.blockNumber,
         receipt.blockNumber
      );

      const log = logs.find(log => log.transactionHash === tx.hash);
      if (!log) {
         throw new EthereumError(`'${eventName}' not found in transaction logs`);
      }

      const decodedArgs = this.contract.interface.decodeEventLog(
         eventName,
         log.data,
         log.topics
      );

      return onEmit(...decodedArgs);
}
 
 

}

export type UserAdapterComponent = AdapterComponent<ethers.ContractRunner>;

export type AdminAdapterComponent = AdapterComponent<ethers.Signer>;

export type ServiceAdapterComponent = AdapterComponent<ethers.Wallet>;