import { ethers } from 'ethers';
import { Address } from '../address';
import { RelayRequest } from '../relayer/relay-request';
export declare class AdapterComponent<T extends ethers.ContractRunner> {
    readonly runner: T;
    constructor(runner: T);
}
export declare class MetaTXAdapterComponent extends AdapterComponent<ethers.Signer> {
    private readonly forwarder;
    constructor(runner: ethers.Signer, forwarder: ethers.Contract);
    createForwarderRequest<T>(contractAddress: Address, contractInterface: ethers.Interface, func: string, params: ReadonlyArray<any>, deadline: bigint, responseEvent: string, onResponseFunction: (...args: any[]) => T): Promise<RelayRequest<T>>;
}
export declare abstract class Adapter<T extends ethers.ContractRunner, U extends AdapterComponent<T>> {
    protected readonly component: U;
    protected readonly contractFactory: () => ethers.Contract;
    protected readonly contractAddress: Address;
    private txTimeOut;
    private eventTimeout;
    constructor(contractAddress: Address, abi: any, component: U, txTimeout?: number, eventTimeout?: number);
    get contract(): ethers.Contract;
    protected callAndParseLog<V>(tx: ethers.TransactionResponse, eventName: string, onEmit: (...args: any[]) => V, filteringContract?: ethers.Contract): Promise<V>;
}
export type UserAdapterComponent = AdapterComponent<ethers.ContractRunner>;
export type AdminAdapterComponent = AdapterComponent<ethers.Signer>;
export type ServiceAdapterComponent = AdapterComponent<ethers.Wallet>;
//# sourceMappingURL=adapter.d.ts.map