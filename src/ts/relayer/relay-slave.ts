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
    ): Promise<boolean> 
    {
        const filter = this.contract.filters[eventName]?.();
        if (!filter) {
            throw new EthereumError(`'${eventName}' not found in contract filters`);
        }

        const logs = await this.contract.queryFilter(
            filter,
            blockNumber,
            blockNumber
        );

        const log = logs.find(log => log.transactionHash === txHash);
        if (!log) {
            throw new EthereumError(`'${eventName}' not found in transaction logs`);
        }

        const decodedArgs = this.contract.interface.decodeEventLog(
            eventName,
            log.data,
            log.topics
        );

        sendResponse([...decodedArgs]); 
        return true;
    }
}
