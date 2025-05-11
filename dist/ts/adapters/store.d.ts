import { ethers } from 'ethers';
import { Adapter, MetaTXAdapterComponent } from './adapter';
import { Address } from '../address';
import { RelayRequest } from '../relayer/relay-request';
import { LudexConfig } from '../configs';
export interface IStoreMetaTXAccess {
    purchaseItemRequest(itemID: bigint, token: Address, deadline: bigint): Promise<RelayRequest<bigint>>;
}
export declare class MetaTXAdapterStore extends Adapter<ethers.Signer, MetaTXAdapterComponent> implements IStoreMetaTXAccess {
    constructor(config: LudexConfig, component: MetaTXAdapterComponent);
    purchaseItemRequest(itemID: bigint, token: Address, deadline: bigint): Promise<RelayRequest<bigint>>;
}
//# sourceMappingURL=store.d.ts.map