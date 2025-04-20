import { ethers, Contract, Signer } from 'ethers';
import { Address } from '../address';
import { RelayRequest } from '../relay-request';
import { ERC2771 } from '../utils/erc2771';
import { EIP712 } from '../utils/eip712';
import { PriceInfo, Purchase } from '../contract-defined-types';

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
      getValueFunction: (log: ethers.Log) => T|null
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
         getValue: getValueFunction
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

   public constructor (contractAddress: Address, abi: any, component: U)
   {
      this.component = component;
      this.contractAddress = contractAddress;
      this.contract = 
         new ethers.Contract(contractAddress.stringValue, abi, component.runner);
   }
}

export type UserAdapterComponent = AdapterComponent<ethers.ContractRunner>;

export type AdminAdapterComponent = AdapterComponent<ethers.Signer>;

export type ServiceAdapterComponent = AdapterComponent<ethers.Wallet>;