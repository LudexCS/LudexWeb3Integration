import { ethers } from "ethers";
import { LudexConfig } from "../configs";
import { Address } from "../address";
import { RelayRequest } from "./relay-request";
import { RelaySlave } from "./relay-slave";
export declare class RelayMaster {
    private readonly forwarder;
    private readonly slaves;
    private verificationTimeoutMs;
    private txTimeoutMs;
    private eventTimeOutms;
    constructor(forwarderAddress: Address, slaves: RelaySlave[], signer: ethers.Signer, verificationTimeoutMs?: number, // 10 sec
    txTimeoutMs?: number, // 1 min
    eventTimeoutMs?: number);
    setTimeouts({ verify, tx, event }: {
        verify?: number;
        tx?: number;
        event?: number;
    }): void;
    private verify;
    private waitTX;
    acceptRequest(relayRequest: RelayRequest<any>, sendResponse: (response: any) => void, onError: (error: Error) => void): Promise<void>;
}
export declare function createLudexRelayMaster(ludexConfig: LudexConfig, forwarderAddress: Address, signer: ethers.Signer): RelayMaster;
//# sourceMappingURL=relayer-master.d.ts.map