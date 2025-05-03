import { ethers } from "ethers";
import { Address } from "../address";
import { EthereumError } from "../error";

export class RelaySlave {
    private readonly contract: ethers.Contract;

    public constructor(contractAddress: Address, abi: any, signer: ethers.Signer) {
        this.contract = new ethers.Contract(contractAddress.stringValue, abi, signer);
    }

    public async queryAndParseLog(
        eventName: string,
        blockNumber: number,
        txHash: string,
        sendResponse: (response: any) => void
    ): Promise<boolean> {
        const filter = this.contract.filters[eventName]?.();
        if (!filter) {
            throw new EthereumError(`Event '${eventName}' not found in ABI`);
        }

        const logs = await this.contract.queryFilter(filter, blockNumber, blockNumber);
        const log = logs.find(log => log.transactionHash === txHash);
        if (!log) {
            return false; 
        }

        const decodedArgs = this.contract.interface.parseLog(log);
        if(!decodedArgs)
        {
            return false;
        }

        sendResponse([...decodedArgs.args]); 
        return true;
    }
}
