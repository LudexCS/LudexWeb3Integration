import { ethers } from 'ethers';
import { Adapter, MetaTXAdapterComponent, AdminAdapterComponent, AdapterComponent } from './adapter';
import { Address } from '../address';
import { RelayRequest } from '../relayer/relay-request';
import { LudexConfig } from '../configs';
export interface IProfitEscrowReadonlyAccess {
    getBalanceFor(itemID: bigint, token: Address): Promise<bigint>;
    getPendingProfit(itemID: bigint, token: Address): Promise<bigint>;
}
export interface IProfitEscrowMetaTXAccess extends IProfitEscrowReadonlyAccess {
    claimRequest(itemID: bigint, token: Address, recipient: Address, deadline: bigint): Promise<RelayRequest<bigint>>;
}
export interface IProfitEscrowServiceAccess extends IProfitEscrowReadonlyAccess {
    getWholePendingProfit(token: Address): Promise<bigint>;
    settlePendingProfit(token: Address, itemIDs: bigint[]): Promise<void>;
}
export declare class ReadonlyAdapterProfitEscrow<T extends ethers.ContractRunner, U extends AdapterComponent<T>> extends Adapter<T, U> implements IProfitEscrowReadonlyAccess {
    constructor(ludexConfig: LudexConfig, component: U);
    getBalanceFor(itemID: bigint, token: Address): Promise<bigint>;
    getPendingProfit(itemID: bigint, token: Address): Promise<bigint>;
}
export declare class MetaTXAdapterProfitEscrow extends ReadonlyAdapterProfitEscrow<ethers.Signer, MetaTXAdapterComponent> implements IProfitEscrowMetaTXAccess {
    claimRequest(itemID: bigint, token: Address, recipient: Address, deadline: bigint): Promise<RelayRequest<bigint>>;
}
export declare class ServiceAdapterProfitEscrow extends ReadonlyAdapterProfitEscrow<ethers.Signer, AdminAdapterComponent> implements IProfitEscrowServiceAccess {
    getWholePendingProfit(token: Address): Promise<bigint>;
    settlePendingProfit(token: Address, itemIDs: bigint[]): Promise<void>;
}
//# sourceMappingURL=profit-escrow.d.ts.map