import { ethers } from "ethers";
import { LudexContract } from "ludex-contracts";
import { Adapter, AdapterComponent, AdminAdapterComponent, MetaTXAdapterComponent } from "./adapter";
import { Address } from "../address";
import { RelayRequest } from "../relayer/relay-request";
import { PriceInfo } from "../contract-defined-types";
import { LudexConfig } from "../configs";
import { Web3Error } from "../error";

export interface IPriceTableReadOnlyAccess
{
    getPriceUsd(itemID: bigint)
    : Promise<bigint>;

    getPriceInfoList(itemID: bigint)
    : Promise<PriceInfo[]>;

    getExchangeRateOf(token: Address)
    : Promise<bigint>;

    getRevShare(sharerID: bigint, itemID: bigint)
    : Promise<number>;
}

export interface IPriceTableMetaTXAccess extends IPriceTableReadOnlyAccess
{
    changeItemPriceRequest(
        itemID: bigint, 
        priceUsd: bigint, 
        deadline: bigint
    ): Promise<RelayRequest<bigint>>;
    
    startDiscountRequest(itemID: bigint, usdPrice: bigint, endTime: Date, deadline: bigint)
    : Promise<RelayRequest<void>>;

    changeRevShareRequest(itemID: bigint, newShare: number, deadline: bigint)
    : Promise<RelayRequest<number>>;

    startRevShareReductionEventRequest(
        itemID: bigint, 
        reducedShare: number, 
        endTime: Date,
        deadline: bigint
    ): Promise<RelayRequest<void>>;
}

export interface IPriceTableAdminAccess extends IPriceTableReadOnlyAccess
{
    changeExchangeRate(token: Address, usdToToken: bigint)
    : Promise<bigint>;

    addPaymentChannel(token: Address, usdToToken: bigint)
    : Promise<void>;

    removePaymentChannel(token: Address)
    : Promise<boolean>;
}

export interface IPriceTableServiceAccess 
    extends IPriceTableAdminAccess
{}

export class ReadonlyAdapterPriceTable<
    T extends ethers.ContractRunner, 
    U extends AdapterComponent<T>
>
    extends Adapter<T, U>
    implements IPriceTableReadOnlyAccess
{
    public constructor (config: LudexConfig, component: U)
    {
        if (!config.priceTableAddress)
        {
            throw new Web3Error(
                "Address of PriceTable not configured");
        }

        super(
            Address.create(config.priceTableAddress),
            LudexContract.ABI.PriceTable, 
            component);
    }

    public async getPriceUsd(itemID: bigint): Promise<bigint> {
        return await this.contract.getPriceUsd(itemID);
    }

    public async getPriceInfoList(itemID: bigint): Promise<PriceInfo[]> {
        const infoListRaw: Array<{token: string; tokenAmount: bigint}> = await 
            this.contract.getPriceInfoList(itemID);

        const result: PriceInfo[] = [];
        for (let i = 0; i < infoListRaw.length; i++)
        {
            const token = 
            result.push({
                token: Address.create(infoListRaw[i].token),
                tokenAmount: infoListRaw[i].tokenAmount});
        }

        return result;
    }   

    public async getExchangeRateOf(token: Address): Promise<bigint> {
        return await this.contract.usdToToken(token.stringValue);
    }

    public async getRevShare(sharerID: bigint, itemID: bigint): Promise<number> 
    {
        return await this.contract.getRevShare(sharerID, itemID);
    }
}

export type BaseAdapterPriceTable = 
    ReadonlyAdapterPriceTable<
        ethers.JsonRpcProvider, 
        AdapterComponent<ethers.JsonRpcProvider>
    >

export class MetaTXAdapterPriceTable 
    extends ReadonlyAdapterPriceTable<ethers.Signer, MetaTXAdapterComponent>
    implements IPriceTableMetaTXAccess
{   
    public constructor (
        config: LudexConfig,
        component: MetaTXAdapterComponent
    ){
        super(config, component);
    }

    public async changeItemPriceRequest(
        itemID: bigint, 
        priceUsd: bigint, 
        deadline: bigint
    ): Promise<RelayRequest<bigint>>
    {
        let onResponseFunction = 
            (itemID: bigint, priceUsd: bigint, prevPriceUsd: bigint) => 
                prevPriceUsd;
        
        return await (
            this.component.createForwarderRequest(
                this.contractAddress,
                this.contract.interface,
                "changeItemPrice", [itemID, priceUsd],
                deadline,
                "ItemPriceChanged",
                onResponseFunction
            ));
    }

    public async startDiscountRequest(
        itemID: bigint,
        usdPrice: bigint,
        endTime: Date,
        deadline: bigint
    ): Promise<RelayRequest<void>>
    {
        return await (
            this.component.createForwarderRequest(
                this.contractAddress,
                this.contract.interface,
                "startDiscount", [itemID, usdPrice, BigInt(endTime.getTime() / 1000)],
                deadline,
                "DiscountStarted",
                (_) => {}));
    }

    public async changeRevShareRequest(
        itemID: bigint, 
        newShare: number,
        deadline: bigint
    ): Promise<RelayRequest<number>> 
    {
        return await (
            this.component.createForwarderRequest(
                this.contractAddress,
                this.contract.interface,
                "changeRevShare", [itemID, newShare],
                deadline,
                "RevShareChanged",
                (itemID: bigint, newShare: number, prevShare: number) => {
                    return prevShare;
                }));
    }

    public async startRevShareReductionEventRequest(
        itemID: bigint, 
        reducedShare: number, 
        endTime: Date, 
        deadline: bigint
    ): Promise<RelayRequest<void>> 
    {
        return await (
            this.component.createForwarderRequest(
                this.contractAddress,
                this.contract.interface,
                "startRevShareReductionEventRequest", 
                [itemID, reducedShare, BigInt(endTime.getTime() / 1000)],
                deadline,
                "RevShareReductionStarted",
                (_) => {}
            )
        )    
    }
}

export class AdminAdapterPriceTable
    extends ReadonlyAdapterPriceTable<ethers.Signer, AdminAdapterComponent>
    implements IPriceTableAdminAccess, IPriceTableServiceAccess
{
    public constructor (config: LudexConfig, component: AdminAdapterComponent)
    {
        super(config, component);
    }

    public async changeExchangeRate(token: Address, usdToToken: bigint)
    : Promise<bigint>
    {return await this.callAndParseLog(
        await this.contract.changeExchangeRate(token.stringValue, usdToToken),
        "ExchangeRateChanged",
        (token: string, usdToToken:bigint, prevExchangeRate: bigint) => {
            console.log(
                `New exchange rate: ${usdToToken} USD for a ${token}`);
            return prevExchangeRate;
        }
    );}

    public async addPaymentChannel(token: Address, usdToToken: bigint)
    : Promise<void>
    {return await this.callAndParseLog(
        await this.contract.addPaymentChannel(token.stringValue, usdToToken),
        "PaymentChannelAdded",
        (token: string, usdToToken: bigint) => {
            console.log(
                `New payment channel: ${usdToToken} USD for 1 ${token}`);
        }
    );}

    public async removePaymentChannel(token: Address)
    : Promise<boolean>
    {return await this.callAndParseLog(
        await this.contract.removePaymentChannel(token.stringValue),
        "PaymentChannelRemoved",
        (token: string, isSuccess: boolean) => {
            console.log(`Payment channel removed: ${token}`)
            return isSuccess;
        }
    );}
}