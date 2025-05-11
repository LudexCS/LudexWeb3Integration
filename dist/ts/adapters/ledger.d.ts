import { ethers } from "ethers";
import { Adapter, AdapterComponent } from "./adapter";
import { Address } from "../address";
import { Purchase } from "../contract-defined-types";
import { LudexConfig } from "../configs";
export interface ILedgerReadonlyAccess {
    getPurchaseID(buyer: Address, itemID: bigint, timestamp: Date): Promise<undefined | bigint>;
    proveOwnership(buyer: Address, tokenID: bigint): Promise<boolean>;
    getPurchaseInfo(tokenID: bigint): Promise<Purchase>;
}
export interface ILedgerMetaTXAccess extends ILedgerReadonlyAccess {
}
export interface ILedgerAdminAccess extends ILedgerReadonlyAccess {
}
export interface ILedgerServiceAccess extends ILedgerAdminAccess {
}
export declare class ReadonlyAdapterLedger<T extends ethers.ContractRunner, U extends AdapterComponent<T>> extends Adapter<T, U> implements ILedgerReadonlyAccess, ILedgerMetaTXAccess, ILedgerAdminAccess, ILedgerServiceAccess {
    private readonly nftContract;
    constructor(config: LudexConfig, component: U);
    getPurchaseID(buyer: Address, itemID: bigint, timestamp: Date): Promise<undefined | bigint>;
    proveOwnership(buyer: Address, tokenID: bigint): Promise<boolean>;
    getPurchaseInfo(tokenID: bigint): Promise<Purchase>;
}
export type BaseUserAdapterLedger = ReadonlyAdapterLedger<ethers.JsonRpcProvider, AdapterComponent<ethers.JsonRpcProvider>>;
//# sourceMappingURL=ledger.d.ts.map