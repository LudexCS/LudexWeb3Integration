import { ethers } from "ethers";
import { Adapter, AdapterComponent, AdminAdapterComponent } from "./adapter";
import { Address } from "../address";
import { LudexConfig } from "../configs";
export interface IItemRegistryReadonlyAccess {
    sellerOf(itemID: bigint): Promise<undefined | Address>;
    ancestorsOf(itemID: bigint, hierarchy: number): Promise<Array<bigint>>;
    descendentsOf(itemID: bigint, hierarchy: number): Promise<Array<bigint>>;
    timestampRegistered(itemID: bigint): Promise<Date>;
    getNameHash(itemName: string): Promise<string>;
}
export interface IItemRegistryMetaTXAccess extends IItemRegistryReadonlyAccess {
}
export interface IItemRegistryAdminAccess extends IItemRegistryReadonlyAccess {
    suspendItemSale(itemID: bigint): Promise<Array<bigint>>;
    resumeItemSale(itemID: bigint): Promise<Array<bigint>>;
}
export interface IItemRegistryServiceAccess extends IItemRegistryAdminAccess {
    registerItem(itemName: string, seller: Address, parents: Array<bigint>, usdPrice: bigint, shares: Array<[bigint, number]>): Promise<[bigint, Array<bigint>]>;
}
export declare class ReadonlyAdapterItemRegistry<T extends ethers.ContractRunner, U extends AdapterComponent<T>> extends Adapter<T, U> implements IItemRegistryReadonlyAccess, IItemRegistryMetaTXAccess {
    constructor(config: LudexConfig, component: U);
    sellerOf(itemID: bigint): Promise<undefined | Address>;
    ancestorsOf(itemID: bigint, hierarchy?: number): Promise<Array<bigint>>;
    descendentsOf(itemID: bigint, hierarchy?: number): Promise<Array<bigint>>;
    timestampRegistered(itemID: bigint): Promise<Date>;
    getNameHash(itemName: string): Promise<string>;
}
export declare class AdminAdapterItemRegistry extends ReadonlyAdapterItemRegistry<ethers.Signer, AdminAdapterComponent> implements IItemRegistryAdminAccess {
    constructor(config: LudexConfig, component: AdminAdapterComponent);
    suspendItemSale(itemID: bigint): Promise<Array<bigint>>;
    resumeItemSale(itemID: bigint): Promise<Array<bigint>>;
}
export declare class ServiceAdapterItemRegistry extends AdminAdapterItemRegistry implements IItemRegistryServiceAccess {
    constructor(config: LudexConfig, component: AdminAdapterComponent);
    registerItem(itemName: string, seller: Address, parents: Array<bigint>, usdPrice: bigint, shares: Array<[bigint, number]>): Promise<[bigint, Array<bigint>]>;
}
//# sourceMappingURL=item-registry.d.ts.map