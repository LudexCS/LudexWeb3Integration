import { ethers } from "ethers";
import { Adapter, AdapterComponent, MetaTXAdapterComponent, AdminAdapterComponent, ServiceAdapterComponent } from "./adapter";
import { LudexContract } from "ludex-contracts";
import { Address } from "../address";
import { LudexConfig } from "../configs";
import { Web3Error } from "../error";

export interface IItemRegistryReadonlyAccess
{
    sellerOf(itemID: bigint)
    : Promise<undefined|Address>;

    ancestorsOf(itemID: bigint, hierarchy: number)
    : Promise<Array<bigint>>;

    descendentsOf(itemID: bigint, hierarchy: number)
    : Promise<Array<bigint>>;

    timestampRegistered(itemID: bigint)
    : Promise<Date>;

    getNameHash(itemName: string)
    : Promise<string>;

    checkOnSale(itemID: bigint)
    : Promise<boolean>;
}

export interface IItemRegistryMetaTXAccess 
    extends IItemRegistryReadonlyAccess
{}

export interface IItemRegistryAdminAccess
    extends IItemRegistryReadonlyAccess
{
    suspendItemSale(itemID: bigint)
    : Promise<Array<bigint>>;

    resumeItemSale(itemID: bigint)
    : Promise<Array<bigint>>;
}

export interface IItemRegistryServiceAccess 
    extends IItemRegistryAdminAccess
{
    registerItem(
        itemName: string, 
        seller: Address, 
        parents: Array<bigint>,
        usdPrice: bigint,
        shares: Array<[bigint, number]>
    ): Promise<[bigint, Array<bigint>]>;
}

export class ReadonlyAdapterItemRegistry<
    T extends ethers.ContractRunner, 
    U extends AdapterComponent<T>
>
    extends Adapter<T, U>
    implements IItemRegistryReadonlyAccess, IItemRegistryMetaTXAccess
{
    public constructor (
        config: LudexConfig,
        component: U
    ){
        if (!config.itemRegistryAddress)
        {
            throw new Web3Error(
                "Address of ItemRegistry not configured");
        }

        super(
            Address.create(config.itemRegistryAddress),
            LudexContract.ABI.ItemRegistry,
            component);
    }
    
    public async sellerOf (itemID: bigint)
    : Promise<undefined|Address>
    {
        let addressString = await this.contract.seller(itemID);
        
        if (addressString === ethers.ZeroAddress)
        {
            return undefined;
        }

        return Address.create(addressString);
    }

    public async ancestorsOf(itemID: bigint, hierarchy: number = 1)
    : Promise<Array<bigint>>
    {
        if (hierarchy < 1)
        {
            return [];
        }

        let parents: Array<bigint> = await this.contract.itemParents(itemID);
        
        for (let parent of parents)
        {
            parents.concat(await this.ancestorsOf(parent, hierarchy - 1));
        }

        return parents;
    }

    public async descendentsOf(itemID: bigint, hierarchy: number = 1)
    : Promise<Array<bigint>>
    {
        if (hierarchy < 1)
        {
            return [];
        }

        let children: Array<bigint> = await this.contract.itemChilds(itemID);

        for (let child of children)
        {
            children.concat(await this.descendentsOf(child, hierarchy - 1));
        }

        return children;
    }

    public async timestampRegistered(itemID: bigint)
    : Promise<Date>
    {return await (
        this.contract.timestampRegistered(itemID)
        .then(unixTime => new Date(unixTime * 1000)));
    }

    public async getNameHash(itemName: string)
    : Promise<string> 
    {return await(
        this.contract.nameHash(itemName));
    }

    public async checkOnSale(itemID: bigint)
    : Promise<boolean> 
    {return await(
        this.contract.isOnSale(itemID));
    }
}

export class AdminAdapterItemRegistry
    extends ReadonlyAdapterItemRegistry<ethers.Signer, AdminAdapterComponent>
    implements IItemRegistryAdminAccess
{
    public constructor (config: LudexConfig, component: AdminAdapterComponent)
    {
        super(config, component);
    }

    public async suspendItemSale (itemID: bigint)
    : Promise<Array<bigint>>
    {return await this.callAndParseLog(
        await this.contract.suspendItemSale(itemID),
        "ItemSaleSuspended",
        (item: bigint, suspension: bigint[]) => {
            console.log(`Item sale suspended: ${item}`);
            return suspension;
        }
    );}

    public async resumeItemSale (itemID: bigint)
    : Promise<Array<bigint>>
    {return await this.callAndParseLog(
        await this.contract.resumeItemSale(itemID),
        "ItemSaleResumed",
        (item: bigint, resume: bigint[]) => {
            console.log(`Item sale resumed: ${item}`);
            return resume;
        }
    );}
}

export class ServiceAdapterItemRegistry
    extends AdminAdapterItemRegistry
    implements IItemRegistryServiceAccess
{
    public constructor (config: LudexConfig, component: AdminAdapterComponent)
    {
        super(config, component);
    }

    public async registerItem(
        itemName: string, 
        seller: Address, 
        parents: Array<bigint>,
        usdPrice: bigint,
        shares: Array<[bigint, number]>
    ): Promise<[bigint, Array<bigint>]>
    {
        function onItemRegistred(
            itemName: string,
            seller: string,
            itemID: bigint,
            price: bigint,
            shareIDs: Array<bigint>
        ): [bigint, Array<bigint>]
        {
            console.log(`New item registered: ${itemName} by ${seller}`);
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
                itemName, 
                seller.stringValue, 
                parents,
                usdPrice,
                shareTermIDs,
                shareRatios),
            "ItemRegistered",
            onItemRegistred);
    }
}