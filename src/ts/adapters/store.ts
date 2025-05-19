import { ethers, MaxUint256, Signer } from 'ethers';
import { Adapter, MetaTXAdapterComponent, AdminAdapterComponent } from './adapter';
import { LudexContract } from 'ludex-contracts';
import { Address } from '../address'; 
import { RelayRequest } from '../relayer/relay-request';
import { EIP712 } from '../utils/eip712';
import { LudexConfig } from '../configs';
import { Web3Error } from '../error';

export interface IStoreMetaTXAccess
{
   purchaseItemRequest(itemID: bigint, token: Address, deadline: bigint)
   : Promise<RelayRequest<bigint>>;
}

export class MetaTXAdapterStore 
   extends Adapter<ethers.Signer, MetaTXAdapterComponent>
   implements IStoreMetaTXAccess
{

   public constructor (
      config: LudexConfig,
      component: MetaTXAdapterComponent
   ){
      if (!config.storeAddress)
      {
         throw new Web3Error(
            "Address of Store not configured");
      }

      super(
         Address.create(config.storeAddress),
         LudexContract.ABI.Store,
         component);
   }

   private async permissionSignature(token: Address, deadline: bigint)
   : Promise<[bigint, ethers.Signature]>
   {
      let tokenAddress = token.stringValue;
      let tokenContract = 
         new ethers.Contract(
            tokenAddress, 
            LudexContract.ABI.ERC20Permit,
            this.component.runner);
      let domain:EIP712.Domain = await EIP712.getDomainOfContract(tokenContract);
      
      let userAddress = await this.component.runner.getAddress();

      let payment = await this.contract.payment();

      let erc20PermitNonce = await tokenContract.nonces(userAddress);

      let types = {
         Permit: [
            {name: "owner", type: "address"},
            {name: "spender", type: "address"},
            {name: "value", type: "uint256"},
            {name: "nonce", type: "uint256"},
            {name: "deadline", type: "uint256"}
         ]
      };

      let value = {
            owner: userAddress,
            spender: payment,
            value: MaxUint256,
            nonce: erc20PermitNonce,
            deadline: BigInt(Math.floor(Date.now() / 1000)) + deadline
         };

      let signature = 
         await this.component.runner.signTypedData(domain, types, value);

      return [value.deadline, ethers.Signature.from(signature)];
   }

   public async purchaseItemRequest(
      itemID: bigint, token: Address, deadline: bigint)
   : Promise<RelayRequest<bigint>>
   {
      let onResponseFunction = 
         (itemID: bigint, buyer: string, tokenID: bigint) => tokenID;

      if (await this.contract.isTokenPermitted(token.stringValue))
      {
         return await (
            this.component.createForwarderRequest(
               this.contractAddress,
               this.contract.interface,
               "purchaseItem", [itemID, token.stringValue],
               deadline,
               "ItemPurchased",
               onResponseFunction));
      }

      let [purchaseDeadline, signature] = 
         await this.permissionSignature(token, deadline);
      let { v, r, s } = signature;

      return await (
         this.component.createForwarderRequest(
            this.contractAddress,
            this.contract.interface,
            "purchaseItem", [itemID, token.stringValue, purchaseDeadline, v, r, s],
            deadline,
            "ItemPurchased",
            onResponseFunction));
   }
   
}