import { ethers } from "ethers";
import { Address } from "../address";

export class RelaySlave
{
    private readonly contract: ethers.Contract;
    private readonly filteredCallback
        : Map<string, (...args: any[]) => void>;

    public constructor (contractAddress: Address, abi: any, signer: ethers.Signer)
    {
        this.contract = (
            new ethers.Contract(
                contractAddress.stringValue,
                abi,
                signer));
        this.filteredCallback = new Map();
    }

    public startListening (
        eventName: string, 
        callback: (...args: any[]) => void,
        transactionHash: string)
    {
        let actualCallback = (...args: any[]) => {
            let log = args[args.length - 1] as ethers.Log;

            if (log.transactionHash !== transactionHash)
                return;
        
            callback(args);

            this.filteredCallback.delete(transactionHash);
            this.contract.off(eventName, actualCallback);
        }
        this.filteredCallback.set(transactionHash, actualCallback);
        this.contract.on(eventName, callback);
    }

    public stopListening (
        eventName: string, 
        transactionHash: string)
    {
        let callbackToRemove = this.filteredCallback.get(transactionHash);
        if (callbackToRemove === undefined)
            return;
        this.contract.off(eventName, callbackToRemove);
        this.filteredCallback.delete(transactionHash);
    }
}