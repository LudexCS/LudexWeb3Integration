import { ethers } from "ethers";
import { Web3Error } from "../error";
import { LudexContract } from "ludex-contracts";
import { Adapter, AdapterComponent, MetaTXAdapterComponent, AdminAdapterComponent } from "./adapter";
import { Address } from "../address";
import { Purchase } from "../contract-defined-types";
import { LudexConfig } from "../configs";

export interface ILedgerReadonlyAccess
{
    getPurchaseID(buyer: Address, itemID: bigint, timestamp: Date)
    : Promise<undefined|bigint>;

    proveOwnership(buyer: Address, tokenID: bigint)
    : Promise<boolean>;

    getPurchaseInfo(tokenID: bigint)
    : Promise<Purchase>;
}

export interface ILedgerMetaTXAccess extends ILedgerReadonlyAccess
{}
    
export interface ILedgerAdminAccess extends ILedgerReadonlyAccess
{}

export interface ILedgerServiceAccess extends ILedgerAdminAccess
{}

export class ReadonlyAdapterLedger<
    T extends ethers.ContractRunner,
    U extends AdapterComponent<T>
>
    extends Adapter<T, U>
    implements 
        ILedgerReadonlyAccess, 
        ILedgerMetaTXAccess, 
        ILedgerAdminAccess,
        ILedgerServiceAccess
{
    private readonly nftContract: ethers.Contract;

    public constructor (
        config: LudexConfig,
        component: U
    ){
        if (!config.ledgerAddress)
        {
            throw new Web3Error(
                "Address of Ledger not configured");
        }

        super(
            Address.create(config.ledgerAddress),
            LudexContract.ABI.Ledger,
            component);
        this.nftContract = (
            new ethers.Contract(
                this.contractAddress.stringValue, 
                LudexContract.ABI.ERC721, 
                component.runner));
    }

    public async getPurchaseID (
        buyer: Address,
        itemID: bigint,
        timestamp: Date
    ): Promise<undefined|bigint>
    {
        let tokenID = await(
            this.contract.getPurchaseID(
                buyer.stringValue, 
                itemID, 
                timestamp.getTime() / 1000));

        if (!(await this.proveOwnership(buyer, tokenID)))
        {
            return undefined;
        }

        return tokenID;
    }

    public async proveOwnership (
        buyer: Address,
        tokenID: bigint
    ): Promise<boolean>
    {
        let ownerAddress = await this.nftContract.ownerOf(tokenID);

        return ownerAddress === buyer;
    }

    public async getPurchaseInfo(tokenID: bigint): Promise<Purchase> {
        let [_, rawItemID, rawBuyer, rawTimestamp] = 
            await this.contract.purchases(tokenID);
        
        return {
            tokenID: tokenID,
            itemID: BigInt(rawItemID),
            buyer: Address.create(rawBuyer),
            timestamp: new Date(Number(rawTimestamp))
        };
    }
}

export type BaseUserAdapterLedger = 
    ReadonlyAdapterLedger<
        ethers.JsonRpcProvider, 
        AdapterComponent<ethers.JsonRpcProvider>>;