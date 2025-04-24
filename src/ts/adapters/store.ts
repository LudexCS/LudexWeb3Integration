import { ethers, MaxUint256, Signer } from 'ethers';
import { Adapter, MetaTXAdapterComponent, AdminAdapterComponent } from './adapter';
import { abi as StoreABI } from 'contracts/abi/Store.json';
import { abi as ERC20PermitABI } from 'contracts/abi/ERC20Permit.json';
import { Address } from '../address'; 
import { RelayRequest } from '../relay-request';
import { EIP712 } from '../utils/eip712';
import { LudexConfig } from '../configs';

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
      super(
         Address.create(config.storeAddress),
         StoreABI,
         component);
   }

   public async purchaseItemRequest(
      itemID: bigint, token: Address, deadline: bigint)
   : Promise<RelayRequest<bigint>>
   {
      let tokenAddress = token.stringValue;
      let tokenContract = new ethers.Contract(tokenAddress, ERC20PermitABI);
      let domain:EIP712.Domain = await EIP712.getDomainOfContract(tokenContract);
      
      let userAddress = await this.component.runner.getAddress();

      let erc20PermitNonce = await tokenContract.nonces(userAddress);

      let types = {
         Permit: [
            {name: "owner", type: "address"},
            {name: "spender", type: "address"},
            {name: "value", type: "uint256"},
            {name: "nonce", type: "uint256"},
            {name: "deadline", type: "deadline"}
         ]
      };

      let value = {
            owner: userAddress,
            spender: this.contractAddress.stringValue,
            value: MaxUint256,
            nonce: erc20PermitNonce,
            deadline: deadline
         };

      let signature = 
         await this.component.runner.signTypedData(domain, types, value);

      let { v, r, s } = ethers.Signature.from(signature);

      let getValueFunction = (log: ethers.Log): bigint|null => {
         return this.contract.interface.parseLog(log)?.args.tokenID as bigint;
      };

      return await (
         this.component.createForwarderRequest(
            this.contractAddress,
            this.contract.interface,
            "purchaseItem", [itemID, token.stringValue, v, r, s],
            "PurchasedItem",
            getValueFunction));
   }
   
}