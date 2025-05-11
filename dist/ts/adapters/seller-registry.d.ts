import { ethers } from "ethers";
import { Address } from "../address";
import { RelayRequest } from "../relayer/relay-request";
import { Adapter, AdapterComponent, MetaTXAdapterComponent } from "./adapter";
import { LudexConfig } from "../configs";
export interface ISellerRegistryReadonlyAccess {
    isActiveSeller(seller: Address): Promise<boolean>;
    checkAcceptPaymentChannel(seller: Address, token: Address): Promise<boolean>;
}
export interface ISellerRegistryMetaTXAccess extends ISellerRegistryReadonlyAccess {
    registerSellerRequest(paymentChannels: Array<Address>, deadline: bigint): Promise<RelayRequest<boolean>>;
    addPaymentChannelsRequest(paymentChannels: Array<Address>, deadline: bigint): Promise<RelayRequest<void>>;
    removePaymentChannelsRequest(paymentChannels: Array<Address>, deadline: bigint): Promise<RelayRequest<void>>;
}
export interface ISellerRegistryAdminAccess extends ISellerRegistryReadonlyAccess {
}
export interface ISellerRegistryServiceAccess extends ISellerRegistryAdminAccess {
}
export declare class ReadonlyAdapterSellerRegistry<T extends ethers.ContractRunner, U extends AdapterComponent<T>> extends Adapter<T, U> implements ISellerRegistryReadonlyAccess, ISellerRegistryAdminAccess, ISellerRegistryServiceAccess {
    constructor(config: LudexConfig, component: U);
    isActiveSeller(seller: Address): Promise<boolean>;
    checkAcceptPaymentChannel(seller: Address, token: Address): Promise<boolean>;
}
export type BaseSellerRegistry = ReadonlyAdapterSellerRegistry<ethers.JsonRpcProvider, AdapterComponent<ethers.JsonRpcProvider>>;
export declare class MetaTXAdapterSellerRegistry extends ReadonlyAdapterSellerRegistry<ethers.Signer, MetaTXAdapterComponent> implements ISellerRegistryMetaTXAccess {
    constructor(config: LudexConfig, component: MetaTXAdapterComponent);
    registerSellerRequest(paymentChannels: Array<Address>, deadline: bigint): Promise<RelayRequest<boolean>>;
    addPaymentChannelsRequest(paymentChannels: Array<Address>, deadline: bigint): Promise<RelayRequest<void>>;
    removePaymentChannelsRequest(paymentChannels: Array<Address>, deadline: bigint): Promise<RelayRequest<void>>;
}
//# sourceMappingURL=seller-registry.d.ts.map