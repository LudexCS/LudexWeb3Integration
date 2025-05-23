import { ethers } from "ethers";
import { Adapter, AdapterComponent, AdminAdapterComponent, MetaTXAdapterComponent } from "./adapter";
import { Address } from "../address";
import { RelayRequest } from "../relayer/relay-request";
import { PriceInfo } from "../contract-defined-types";
import { LudexConfig } from "../configs";
export interface IPriceTableReadOnlyAccess {
    getPriceUsd(itemID: bigint): Promise<bigint>;
    getPriceInfoList(itemID: bigint): Promise<PriceInfo[]>;
    getExchangeRateOf(token: Address): Promise<bigint>;
    getRevShare(sharerID: bigint, itemID: bigint): Promise<number>;
}
export interface IPriceTableMetaTXAccess extends IPriceTableReadOnlyAccess {
    changeItemPriceRequest(itemID: bigint, priceUsd: bigint, deadline: bigint): Promise<RelayRequest<bigint>>;
    startDiscountRequest(itemID: bigint, usdPrice: bigint, endTime: Date, deadline: bigint): Promise<RelayRequest<void>>;
    changeRevShareRequest(itemID: bigint, newShare: number, deadline: bigint): Promise<RelayRequest<number>>;
    startRevShareReductionEventRequest(itemID: bigint, reducedShare: number, endTime: Date, deadline: bigint): Promise<RelayRequest<void>>;
}
export interface IPriceTableAdminAccess extends IPriceTableReadOnlyAccess {
    changeExchangeRate(token: Address, usdToToken: bigint): Promise<bigint>;
    addPaymentChannel(token: Address, usdToToken: bigint): Promise<void>;
    removePaymentChannel(token: Address): Promise<boolean>;
}
export interface IPriceTableServiceAccess extends IPriceTableAdminAccess {
}
export declare class ReadonlyAdapterPriceTable<T extends ethers.ContractRunner, U extends AdapterComponent<T>> extends Adapter<T, U> implements IPriceTableReadOnlyAccess {
    constructor(config: LudexConfig, component: U);
    getPriceUsd(itemID: bigint): Promise<bigint>;
    getPriceInfoList(itemID: bigint): Promise<PriceInfo[]>;
    getExchangeRateOf(token: Address): Promise<bigint>;
    getRevShare(sharerID: bigint, itemID: bigint): Promise<number>;
}
export type BaseAdapterPriceTable = ReadonlyAdapterPriceTable<ethers.JsonRpcProvider, AdapterComponent<ethers.JsonRpcProvider>>;
export declare class MetaTXAdapterPriceTable extends ReadonlyAdapterPriceTable<ethers.Signer, MetaTXAdapterComponent> implements IPriceTableMetaTXAccess {
    constructor(config: LudexConfig, component: MetaTXAdapterComponent);
    changeItemPriceRequest(itemID: bigint, priceUsd: bigint, deadline: bigint): Promise<RelayRequest<bigint>>;
    startDiscountRequest(itemID: bigint, usdPrice: bigint, endTime: Date, deadline: bigint): Promise<RelayRequest<void>>;
    changeRevShareRequest(itemID: bigint, newShare: number, deadline: bigint): Promise<RelayRequest<number>>;
    startRevShareReductionEventRequest(itemID: bigint, reducedShare: number, endTime: Date, deadline: bigint): Promise<RelayRequest<void>>;
}
export declare class AdminAdapterPriceTable extends ReadonlyAdapterPriceTable<ethers.Signer, AdminAdapterComponent> implements IPriceTableAdminAccess, IPriceTableServiceAccess {
    constructor(config: LudexConfig, component: AdminAdapterComponent);
    changeExchangeRate(token: Address, usdToToken: bigint): Promise<bigint>;
    addPaymentChannel(token: Address, usdToToken: bigint): Promise<void>;
    removePaymentChannel(token: Address): Promise<boolean>;
}
//# sourceMappingURL=price-table.d.ts.map