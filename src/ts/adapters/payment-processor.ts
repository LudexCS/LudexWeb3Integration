import { ethers } from "ethers";
import { Adapter, AdapterComponent, MetaTXAdapterComponent, AdminAdapterComponent, ServiceAdapterComponent } from "./adapter";
import { LudexContract } from "ludex-contracts";
import { Address } from "../address";
import { LudexConfig } from "../configs";
import { RelayRequest } from "../relayer/relay-request";
import { Web3Error } from "../error";

export interface IPaymentProcessorMetaTXAccess
{
   getEscrowBalance(token: Address)
   : Promise<bigint>;

   claimRequest(token:Address, deadline: bigint)
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

   public async getEscrowBalance(token: Address)
   : Promise<bigint> 
   {
      let provider = this.component.runner.provider;

      let seller = await this.component.runner.getAddress();
      let readonlyContract = 
         new ethers.Contract(
            this.contractAddress.stringValue,
            this.contract.interface,
            provider);
      
      return await readonlyContract.sellerTokenEscrow(seller, token.stringValue);
   }

   public async claimRequest(token:Address, deadline: bigint)
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
            "claim", [token.stringValue],
            deadline,
            "ProfitClaimed",
            onResponseFunction
         ));
   } 
}