import { ethers } from 'ethers';
import { Adapter, AdapterComponent, MetaTXAdapterComponent, AdminAdapterComponent } from './adapter';
import { LudexContract } from 'ludex-contracts';
import { Address } from '../address'; 
import { RelayRequest } from '../relayer/relay-request';
import { LudexConfig } from '../configs';
import { Web3Error } from '../error';

export interface ISellerProxyServiceAccess
{
    registerItem (
        nameHash: string,
        sellerID: bigint,
        parents: Array<bigint>,
        usdPrice: bigint,
        shares: Array<[bigint, number]>
    ): Promise<[bigint, Array<bigint>]>;

    claimProfit(
        sellerID: bigint,
        items: bigint,
        token: Address,
        recipient: Address
    ): Promise<bigint>;

    claimSellerRight(
        sellerID: bigint,
        items: bigint[],
        seller: Address
    ): Promise<[Address, bigint[]]>;
}

export class ServiceAdapterSellerProxy
    extends Adapter<ethers.Signer, AdminAdapterComponent>
    implements ISellerProxyServiceAccess
{
    private itemRegistry: ethers.Contract;
    private profitEscrow: ethers.Contract;

    public constructor(
        config: LudexConfig, 
        component: AdminAdapterComponent
    ){
        if (!config.sellerProxyAddress)
        {
            throw new Web3Error(
                "Address of SellerProxy not configured");
        }

        if (!config.itemRegistryAddress)
        {
            throw new Web3Error(
                "Address of ItemRegistry not configured");
        }

        if (!config.profitEscrowAddress)
        {
            throw new Web3Error(
                "Address of ProfitEscrow not configured");
        }

        super(
            Address.create(config.sellerProxyAddress),
            LudexContract.ABI.SellerProxy,
            component);
            
        this.itemRegistry = 
            new ethers.Contract(
                config.itemRegistryAddress,
                LudexContract.ABI.ItemRegistry,
                component.runner);

        this.profitEscrow =
            new ethers.Contract(
                config.profitEscrowAddress,
                LudexContract.ABI.ProfitEscrow,
                component.runner);
    }
    
    public async registerItem(
        nameHash: string, 
        sellerID: bigint, 
        parents: Array<bigint>, 
        usdPrice: bigint, 
        shares: Array<[bigint, number]>
    ): Promise<[bigint, bigint[]]> 
    {
        function onItemRegistred(
            itemName: string,
            seller: string,
            itemID: bigint,
            price: bigint,
            shareIDs: Array<bigint>
        ): [bigint, Array<bigint>]
        {
            console.log(`New item register delegated: ${itemName} by ${sellerID}`);
            return [itemID, shareIDs];
        }

        const shareTermIDs: bigint[] = [];
        const shareRatios: number[] = [];

        for (let i = 0; i < shares.length; i ++)
        {
            const [term, ratio] = shares[i];
            shareTermIDs.push(term);
            shareRatios.push(ratio);
        }

        return await this.callAndParseLog(
            await this.contract.registerItem(
                nameHash,
                sellerID,
                parents,
                usdPrice,
                shareTermIDs,
                shareRatios),
            "ItemRegistered",
            onItemRegistred,
            this.itemRegistry);
    }

    public async claimProfit(
        sellerID: bigint, 
        itemID: bigint, 
        token: Address, 
        recipient: Address
    ): Promise<bigint> 
    {
        function onProfitClaimed(
            itemID: bigint,
            token: string,
            recipient: string,
            amount: bigint
        ){
            return amount;
        }

        return await this.callAndParseLog(
            await this.contract.claimProfit(
                sellerID,
                itemID,
                token.stringValue,
                recipient.stringValue),
            "ProfitClaimed",
            onProfitClaimed,
            this.profitEscrow);
    }

    public async claimSellerRight(
        sellerID: bigint, 
        items: bigint[], 
        seller: Address)
    : Promise<[Address, bigint[]]> 
    {
        function onSellerRightClaimed(
            sellerID: string,
            seller: string,
            items: bigint[]
        ): [Address, bigint[]]
        {
            return [Address.create(seller), items];
        }

        return await this.callAndParseLog(
            await this.contract.claimSellerRight(
                sellerID,
                items,
                seller.stringValue),
            "SellerRightClaimed",
            onSellerRightClaimed)
    }
}