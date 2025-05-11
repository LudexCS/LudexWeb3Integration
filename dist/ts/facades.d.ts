import { ethers } from "ethers";
import { ChainConfig, LudexConfig } from "./configs";
import { IPriceTableReadOnlyAccess, IPriceTableMetaTXAccess, IPriceTableAdminAccess, IPriceTableServiceAccess } from "./adapters/price-table";
import { AdapterComponent, MetaTXAdapterComponent } from "./adapters/adapter";
import { ILedgerReadonlyAccess, ILedgerMetaTXAccess, ILedgerAdminAccess, ILedgerServiceAccess } from "./adapters/ledger";
import { ISellerRegistryReadonlyAccess, ISellerRegistryMetaTXAccess, ISellerRegistryAdminAccess, ISellerRegistryServiceAccess } from "./adapters/seller-registry";
import { IItemRegistryReadonlyAccess, IItemRegistryMetaTXAccess, IItemRegistryAdminAccess, ServiceAdapterItemRegistry, IItemRegistryServiceAccess } from "./adapters/item-registry";
import { IStoreMetaTXAccess } from "./adapters/store";
import { IPaymentProcessorMetaTXAccess } from "./adapters/payment-processor";
export interface IReadonlyFacade {
    readonlyAccessPriceTable(): IPriceTableReadOnlyAccess;
    readonlyAccessLedger(): ILedgerReadonlyAccess;
    readonlyAccessSellerRegistry(): ISellerRegistryReadonlyAccess;
    readonlyAccessItemRegistry(): IItemRegistryReadonlyAccess;
}
export interface IMetaTXFacade extends IReadonlyFacade {
    metaTXAccessPriceTable(): IPriceTableMetaTXAccess;
    metaTXAccessLedger(): ILedgerMetaTXAccess;
    metaTXAccessSellerRegistry(): ISellerRegistryMetaTXAccess;
    metaTXAccessItemRegistry(): IItemRegistryMetaTXAccess;
    metaTXAccessStore(): IStoreMetaTXAccess;
    metaTXAccessPaymentProcessor(): IPaymentProcessorMetaTXAccess;
}
export interface IAdminFacade extends IReadonlyFacade {
    adminAccessPriceTable(): IPriceTableAdminAccess;
    adminAccessLedger(): ILedgerAdminAccess;
    adminAccessSellerRegistry(): ISellerRegistryAdminAccess;
    adminAccessItemRegistry(): IItemRegistryAdminAccess;
}
export interface IServiceFacade extends IAdminFacade {
    serviceAccessPriceTable(): IPriceTableServiceAccess;
    serviceAccessLedger(): ILedgerServiceAccess;
    serviceAccessSellerRegistry(): ISellerRegistryServiceAccess;
    serviceAccessItemRegistry(): IItemRegistryServiceAccess;
}
export declare abstract class ReadonlyFacade<T extends ethers.ContractRunner, U extends AdapterComponent<T>> implements IReadonlyFacade {
    protected readonly chainConfig: ChainConfig;
    protected readonly ludexConfig: LudexConfig;
    protected readonly runner: T;
    protected readonly component: U;
    constructor(chainConfig: ChainConfig, ludexConfig: LudexConfig, runner: T, component: U);
    readonlyAccessPriceTable(): IPriceTableReadOnlyAccess;
    readonlyAccessLedger(): ILedgerReadonlyAccess;
    readonlyAccessSellerRegistry(): ISellerRegistryReadonlyAccess;
    readonlyAccessItemRegistry(): IItemRegistryReadonlyAccess;
}
export declare abstract class MetaTXFacade<T extends ethers.ContractRunner, U extends AdapterComponent<T>> extends ReadonlyFacade<T, U> implements IMetaTXFacade {
    abstract metaTXAccessPriceTable(): IPriceTableMetaTXAccess;
    abstract metaTXAccessLedger(): ILedgerMetaTXAccess;
    abstract metaTXAccessSellerRegistry(): ISellerRegistryMetaTXAccess;
    abstract metaTXAccessItemRegistry(): IItemRegistryMetaTXAccess;
    abstract metaTXAccessStore(): IStoreMetaTXAccess;
    abstract metaTXAccessPaymentProcessor(): IPaymentProcessorMetaTXAccess;
}
export declare class Web2UserFacade extends ReadonlyFacade<ethers.JsonRpcProvider, AdapterComponent<ethers.JsonRpcProvider>> {
}
export declare class Web3UserFacade extends MetaTXFacade<ethers.Signer, MetaTXAdapterComponent> {
    metaTXAccessPriceTable(): IPriceTableMetaTXAccess;
    metaTXAccessLedger(): ILedgerMetaTXAccess;
    metaTXAccessSellerRegistry(): ISellerRegistryMetaTXAccess;
    metaTXAccessItemRegistry(): IItemRegistryMetaTXAccess;
    metaTXAccessStore(): IStoreMetaTXAccess;
    metaTXAccessPaymentProcessor(): IPaymentProcessorMetaTXAccess;
}
export declare class AdminFacade extends ReadonlyFacade<ethers.Signer, AdapterComponent<ethers.Signer>> implements IAdminFacade {
    adminAccessPriceTable(): IPriceTableAdminAccess;
    adminAccessLedger(): ILedgerAdminAccess;
    adminAccessSellerRegistry(): ISellerRegistryAdminAccess;
    adminAccessItemRegistry(): IItemRegistryAdminAccess;
}
export declare class ServiceFacade extends AdminFacade implements IServiceFacade {
    serviceAccessLedger(): ILedgerServiceAccess;
    serviceAccessPriceTable(): IPriceTableServiceAccess;
    serviceAccessSellerRegistry(): ISellerRegistryServiceAccess;
    serviceAccessItemRegistry(): ServiceAdapterItemRegistry;
}
export declare function createWeb2UserFacade(chainConfig: ChainConfig, ludexConfig: LudexConfig, provider?: ethers.JsonRpcProvider): Web2UserFacade;
export declare function createWeb3UserFacade(chainConfig: ChainConfig, ludexConfig: LudexConfig, signer: ethers.Signer): Web3UserFacade;
export declare function createAdminFacade(chainConfig: ChainConfig, ludexConfig: LudexConfig, signer: ethers.Signer): AdminFacade;
export declare function createServiceFacade(chainConfig: ChainConfig, ludexConfig: LudexConfig, signer: ethers.Signer): ServiceFacade;
//# sourceMappingURL=facades.d.ts.map