import { ethers } from "ethers";
import { Address } from "../address";
export declare class RelaySlave {
    private readonly contract;
    constructor(contractAddress: Address, abi: any, signer: ethers.Signer);
    queryAndParseLog(eventName: string, blockNumber: number, txHash: string, sendResponse: (response: any) => void): Promise<boolean>;
}
//# sourceMappingURL=relay-slave.d.ts.map