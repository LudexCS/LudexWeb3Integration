import { ethers } from "ethers";
import { Address } from "./address";
import { RelayRequest } from "./relay-request";
export declare class RelayCommand {
    private readonly forwarder;
    private readonly wallet;
    constructor(forwarderAddress: Address, wallet: ethers.Wallet);
    private verify;
    execute<T>(relayRequest: RelayRequest<T>): Promise<T>;
}
//# sourceMappingURL=relay.d.ts.map