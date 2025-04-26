import { ethers, Contract, Signer } from 'ethers';
import { Address } from '../address';
import { RelayRequest } from '../relayer/relay-request';
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
      responseEvent: string,
      onResponseFunctionFunction: (...args: any) => T
   ): Promise<RelayRequest<T>>
   {
      let forwarderDomain = await EIP712.getDomainOfContract(this.forwarder);

      let userAddress = await this.runner.getAddress();

      let forwarderNonce = await this.forwarder.getNonce(userAddress);

      let calldata = contractInterface.encodeFunctionData(func, params);

      let forwarderRequest: ERC2771.ForwardRequest = {
         from: userAddress,
         to: contractAddress.stringValue,
         value: BigInt(0),
         gas: BigInt(1000000),
         nonce: forwarderNonce,
         data: calldata
      };

      let signature = await (
         this.runner.signTypedData(
               forwarderDomain,
               ERC2771.ForwardRequestTypeDef,
               forwarderRequest));
      
      return {
         request: forwarderRequest,
         signature: signature,
         responseEvent: responseEvent,
         onResponse: onResponseFunctionFunction
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

   protected async callAndListen<T>(
      tx: ethers.TransactionResponse,
      eventName: string,
      onEmit: (...args: any[]) => T
   ): Promise<T>
   {
      let eventFilter = this.contract.filters[eventName]?.();
      if (!eventFilter)
         throw new Web3Error(`Event ${eventName} is not found in the contract`);
   
      let resolveFunction: (value: T) => void;
      let rejectFunction: (reason?: any) => void;

      let resultPromise = new Promise<T>((resolve, reject) => {
         resolveFunction = resolve;
         rejectFunction = reject;
      });

      let listener = (...args: any[]) => {
         let event = args[args.length - 1] as ethers.Log;
         if (event.transactionHash === tx.hash)
         {
            this.contract.removeListener(eventName, listener);
            resolveFunction(onEmit(...args));
         }
      };

      this.contract.on(eventName, listener);

      try{
         let receipt = await Promise.race([
            tx.wait(),
            new Promise((_, reject) => 
               setTimeout(() => 
                  reject(new EthereumError("Transaction confirmation timeout")),
                  this.txTimeOut))
         ]);

         if (receipt === null)
         {
            throw new EthereumError("Transaction failed");
         }

         let timeout = 
            setTimeout(
               () => {
                  rejectFunction(
                     new EthereumError(
                        `'${eventName}' not found in the transaction`));
                  },
               this.eventTimeout);

         let result = await resultPromise;

         clearTimeout(timeout);
         return result;
      }
      catch (error) 
      {
         throw error;
      }
      finally
      {
         this.contract.removeListener(eventName, listener);
      }

   }

}

export type UserAdapterComponent = AdapterComponent<ethers.ContractRunner>;

export type AdminAdapterComponent = AdapterComponent<ethers.Signer>;

export type ServiceAdapterComponent = AdapterComponent<ethers.Wallet>;