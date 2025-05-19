import { ethers } from 'ethers';
import { Adapter, AdminAdapterComponent, AdapterComponent } from './adapter';
import { Address } from '../address';
import { LudexConfig } from '../configs';
import { Purchase } from '../contract-defined-types';
export interface IPurchaseProxyReadonlyAccess {
    getPurchaseInfo(purchaseID: bigint): Promise<Purchase>;
}
export interface IPurchaseProxyServiceAccess {
    purchaseItem(token: Address, itemID: bigint, ownerID: bigint): Promise<bigint>;
    claimPurchaseIDs(ownerID: bigint, claimer: Address, purchaseIDs: bigint[]): Promise<[Address, bigint[]]>;
}
export declare class ReadonlyAdapterPurchaseProxy<T extends ethers.ContractRunner, U extends AdapterComponent<T>> extends Adapter<T, U> implements IPurchaseProxyReadonlyAccess {
    constructor(ludexConfig: LudexConfig, component: U);
    getPurchaseInfo(purchaseID: bigint): Promise<Purchase>;
}
export declare class ServiceAdapterPurchaseProxy extends ReadonlyAdapterPurchaseProxy<ethers.Signer, AdminAdapterComponent> implements IPurchaseProxyServiceAccess {
    private store;
    constructor(ludexConfig: LudexConfig, component: AdminAdapterComponent);
    purchaseItem(token: Address, itemID: bigint, ownerID: bigint): Promise<bigint>;
    claimPurchaseIDs(ownerID: bigint, claimer: Address, purchaseIDs: bigint[]): Promise<[Address, bigint[]]>;
}
//# sourceMappingURL=purchase-proxy.d.ts.map