import { ethers } from 'ethers';
import { Adapter, AdminAdapterComponent } from './adapter';
import { Address } from '../address';
import { LudexConfig } from '../configs';
export interface ISellerProxyServiceAccess {
    registerItem(nameHash: string, sellerID: bigint, parents: Array<bigint>, usdPrice: bigint, shares: Array<[bigint, number]>): Promise<[bigint, Array<bigint>]>;
    claimProfit(sellerID: bigint, items: bigint, token: Address, recipient: Address): Promise<bigint>;
    claimSellerRight(sellerID: bigint, items: bigint[], seller: Address): Promise<[Address, bigint[]]>;
}
export declare class ServiceAdapterSellerProxy extends Adapter<ethers.Signer, AdminAdapterComponent> implements ISellerProxyServiceAccess {
    private itemRegistry;
    private profitEscrow;
    constructor(config: LudexConfig, component: AdminAdapterComponent);
    registerItem(nameHash: string, sellerID: bigint, parents: Array<bigint>, usdPrice: bigint, shares: Array<[bigint, number]>): Promise<[bigint, bigint[]]>;
    claimProfit(sellerID: bigint, itemID: bigint, token: Address, recipient: Address): Promise<bigint>;
    claimSellerRight(sellerID: bigint, items: bigint[], seller: Address): Promise<[Address, bigint[]]>;
}
//# sourceMappingURL=seller-proxy.d.ts.map