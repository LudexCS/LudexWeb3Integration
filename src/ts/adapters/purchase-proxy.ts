import { ethers } from 'ethers';
import { Adapter, MetaTXAdapterComponent, AdminAdapterComponent, AdapterComponent } from './adapter';
import { LudexContract } from 'ludex-contracts';
import { Address } from '../address'; 
import { RelayRequest } from '../relayer/relay-request';
import { LudexConfig } from '../configs';
import { Web3Error } from '../error';
import { Purchase } from '../contract-defined-types';

export interface IPurchaseProxyReadonlyAccess
{
    getPurchaseInfo(purchaseID: bigint)
    : Promise<Purchase>
}

export interface IPurchaseProxyServiceAccess
{
    purchaseItem(token: Address, itemID: bigint, ownerID: bigint)
    : Promise<bigint>;

    claimPurchaseIDs(ownerID: bigint, claimer: Address, purchaseIDs: bigint[])
    : Promise<[Address, bigint[]]>;
}

export class ReadonlyAdapterPurchaseProxy<
    T extends ethers.ContractRunner,
    U extends AdapterComponent<T>
>
    extends Adapter<T, U>
    implements IPurchaseProxyReadonlyAccess
{
    public constructor (ludexConfig: LudexConfig, component: U)
    {
        if (!ludexConfig.purchaseProxyAddress)
        {
            throw new Web3Error(
                "Address of PurchaseProxy not configured");
        }

        super(
            Address.create(ludexConfig.purchaseProxyAddress),
            LudexContract.ABI.PurchaseProxy,
            component);
    }

    public async getPurchaseInfo(purchaseID: bigint)
    : Promise<Purchase> 
    {
        const [_, rawItemID, rawBuyer, rawTimestamp] = 
            await this.contract.getPurchaseInfo(purchaseID);
        
        return {
            tokenID: purchaseID,
            itemID: BigInt(rawItemID),
            buyer: BigInt(rawBuyer),
            timestamp: new Date(Number(rawTimestamp) * 1000)
        };
    }
}

export class ServiceAdapterPurchaseProxy
    extends ReadonlyAdapterPurchaseProxy<ethers.Signer, AdminAdapterComponent>
    implements IPurchaseProxyServiceAccess
{
    private store: ethers.Contract;

    public constructor(
        ludexConfig: LudexConfig, 
        component: AdminAdapterComponent
    ){
        super(ludexConfig, component);

        if (!ludexConfig.storeAddress)
        {
            throw new Web3Error("Address of Store not configured");
        }

        this.store = 
            new ethers.Contract(
                ludexConfig.storeAddress,
                LudexContract.ABI.Store,
                this.component.runner);
    }

    public async purchaseItem(
        token: Address, 
        itemID: bigint, 
        ownerID: bigint
    ): Promise<bigint> 
    {
        function onItemPurchased (itemID: bigint, buyer: string, tokenID: bigint)
        {
            return tokenID;
        }

        return await this.callAndParseLog(
            await this.contract.purchaseItem(token.stringValue, itemID, ownerID),
            "ItemPurchased",
            onItemPurchased,
            this.store);
    }

    public async claimPurchaseIDs(
        ownerID: bigint, 
        claimer: Address, 
        purchaseIDs: bigint[]
    ): Promise<[Address, bigint[]]> {
        function onPurchaseIDsClaimed(owner: string, purchases: bigint[])
        : [Address, bigint[]]
        {
            return [Address.create(owner), purchases];
        }

        return await this.callAndParseLog(
            await this.contract.claimPurchaseIDs(
                ownerID, 
                claimer.stringValue, 
                purchaseIDs),
            "PurchaseIDsClaimed",
            onPurchaseIDsClaimed);
    }
}