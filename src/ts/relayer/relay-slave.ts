import { ethers } from "ethers";
import { Address } from "../address";
import { encodeRelayResult, EncodedRelayResult } from "./relay-serialization";

export class RelaySlave {
    private readonly contract: ethers.Contract;

    public constructor(contractAddress: Address, abi: any, signer: ethers.Signer) {
        this.contract = new ethers.Contract(contractAddress.stringValue, abi, signer);
        const eventNames = [];
        for(const eventName of Object.keys(this.contract.filters))
        {
            eventNames.push(eventName);
        }
    }

    public async queryAndParseLog(
        eventName: string,
        blockNumber: number,
        txHash: string,
        sendResponse: (response: any) => void
    ): Promise<boolean> 
    {
        let log;
        try {
            const filter = this.contract.filters[eventName]?.();
            if (!filter) return false;

            const logs = await this.contract.queryFilter(filter, blockNumber, blockNumber);
            log = logs.find(log => log.transactionHash === txHash);
            if (!log) return false;
        } catch {
            return false;
        }
    
        const decodedArgs = this.contract.interface.decodeEventLog(
            eventName,
            log.data,
            log.topics
        );

        sendResponse([...decodedArgs].map(encodeRelayResult));
        return true;
    }
}
