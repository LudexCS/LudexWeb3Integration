import { ethers } from 'ethers';
import { Adapter, AdminAdapterComponent } from './adapter';
import { Address } from '../address';
import { LudexConfig } from '../configs';
export interface ISellerProxyServiceAccess {
    registerItem(nameHash: string, sellerID: bigint, parents: Array<bigint>, usdPrice: bigint, shares: Array<[bigint, number]>): Promise<[bigint, Array<bigint>]>;
    claimProfit(sellerID: bigint, itemID: bigint, token: Address, recipient: Address): Promise<bigint>;
    claimSellerRight(sellerID: bigint, items: bigint[], seller: Address): Promise<[Address, bigint[]]>;
    changeItemPrice(sellerID: bigint, itemID: bigint, newUsdPrice: bigint): Promise<bigint>;
    startDiscount(sellerID: bigint, itemID: bigint, discountPrice: bigint, endTime: bigint): Promise<void>;
    changeRevShare(sellerID: bigint, itemID: bigint, newSharePermyriad: number): Promise<number>;
    startRevShareReductionEvent(sellerID: bigint, itemID: bigint, reducedShare: number, endTime: bigint): Promise<void>;
}
export declare class ServiceAdapterSellerProxy extends Adapter<ethers.Signer, AdminAdapterComponent> implements ISellerProxyServiceAccess {
    private itemRegistry;
    private profitEscrow;
    private priceTable;
    constructor(config: LudexConfig, component: AdminAdapterComponent);
    registerItem(nameHash: string, sellerID: bigint, parents: Array<bigint>, usdPrice: bigint, shares: Array<[bigint, number]>): Promise<[bigint, bigint[]]>;
    claimProfit(sellerID: bigint, itemID: bigint, token: Address, recipient: Address): Promise<bigint>;
    claimSellerRight(sellerID: bigint, items: bigint[], seller: Address): Promise<[Address, bigint[]]>;
    changeItemPrice(sellerID: bigint, itemID: bigint, newUsdPrice: bigint): Promise<bigint>;
    startDiscount(sellerID: bigint, itemID: bigint, discountPrice: bigint, endTime: bigint): Promise<void>;
    changeRevShare(sellerID: bigint, itemID: bigint, newSharePermyriad: number): Promise<number>;
    startRevShareReductionEvent(sellerID: bigint, itemID: bigint, reducedShare: number, endTime: bigint): Promise<void>;
}
//# sourceMappingURL=seller-proxy.d.ts.map