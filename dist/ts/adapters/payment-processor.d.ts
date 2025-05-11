import { ethers } from "ethers";
import { Adapter, MetaTXAdapterComponent } from "./adapter";
import { Address } from "../address";
import { LudexConfig } from "../configs";
import { RelayRequest } from "../relayer/relay-request";
export interface IPaymentProcessorMetaTXAccess {
    getEscrowBalance(token: Address): Promise<bigint>;
    claimRequest(token: Address, deadline: bigint): Promise<RelayRequest<bigint>>;
}
export declare class MetaTXAdapterPaymentProcessor extends Adapter<ethers.Signer, MetaTXAdapterComponent> implements IPaymentProcessorMetaTXAccess {
    constructor(config: LudexConfig, component: MetaTXAdapterComponent);
    getEscrowBalance(token: Address): Promise<bigint>;
    claimRequest(token: Address, deadline: bigint): Promise<RelayRequest<bigint>>;
}
//# sourceMappingURL=payment-processor.d.ts.map