import { ethers } from "ethers";
import { Adapter, MetaTXAdapterComponent } from "./adapter";
import { LudexConfig } from "../configs";
import { RelayRequest } from "../relayer/relay-request";
export interface IPaymentProcessorMetaTXAccess {
    claimRequest(deadline: bigint): Promise<RelayRequest<bigint>>;
}
export declare class MetaTXAdapterPaymentProcessor extends Adapter<ethers.Signer, MetaTXAdapterComponent> implements IPaymentProcessorMetaTXAccess {
    constructor(config: LudexConfig, component: MetaTXAdapterComponent);
    claimRequest(deadline: bigint): Promise<RelayRequest<bigint>>;
}
//# sourceMappingURL=paymentProcessor.d.ts.map