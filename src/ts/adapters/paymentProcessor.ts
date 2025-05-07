import { ethers } from "ethers";
import { Adapter, AdapterComponent, MetaTXAdapterComponent, AdminAdapterComponent, ServiceAdapterComponent } from "./adapter";
import { LudexContract } from "ludex-contracts";
import { Address } from "../address";
import { LudexConfig } from "../configs";
import { RelayRequest } from "../relayer/relay-request";
import { Web3Error } from "../error";


export interface IPaymentProcessorMetaTXAccess
{
   claimRequest(deadline: bigint)
   : Promise<RelayRequest<bigint>>;
}

export class MetaTXAdapterPaymentProcessor
   extends Adapter<ethers.Signer, MetaTXAdapterComponent>
   implements IPaymentProcessorMetaTXAccess
{
   public constructor (config: LudexConfig, component: MetaTXAdapterComponent) 
   {
      if (!config.paymentProcessorAddress)
      {
         throw new Web3Error(
            "Address of PaymentProcessor not configured");
      }

      super(
         Address.create(config.paymentProcessorAddress),
         LudexContract.ABI.PaymentProcessor,
         component);
   }

   public async claimRequest(deadline: bigint)
   : Promise<RelayRequest<bigint>> 
   {
      let onResponseFunction =
         (seller: string, token: string, amount: bigint) => {
            console.log(`${seller} has gotten ${amount} of ${token}`);
            return amount;
         };

      return await (
         this.component.createForwarderRequest(
            this.contractAddress,
            this.contract.interface,
            "claim", [],
            deadline,
            "ProfitClaimed",
            onResponseFunction
         ));
   } 
}