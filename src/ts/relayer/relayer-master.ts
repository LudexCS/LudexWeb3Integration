import { ethers } from "ethers"; 
import { LudexConfig } from "../configs";
import { Address } from "../address";
import { LudexContract } from "ludex-contracts";
import { RelayRequest } from "./relay-request";
import { EIP712 } from "../utils/eip712";
import { ERC2771 } from "../utils/erc2771";
import { EthereumError, Web3Error } from "../error";
import { RelaySlave } from "./relay-slave";

export class RelayMaster
{
    private readonly forwarder: ethers.Contract;
    private readonly slaves: RelaySlave[];

    private verificationTimeoutMs: number = 10000; // 10 sec
    private txTimeoutMs: number = 60000; // 1 min
    private eventTimeOutms: number = 30000; // 30 sec

    public constructor (
        forwarderAddress: Address,
        slaves: RelaySlave[],
        signer: ethers.Signer,
        verificationTimeoutMs: number = 10000, // 10 sec
        txTimeoutMs: number = 60000, // 1 min
        eventTimeoutMs: number = 30000) // 30 sec
    {
        this.forwarder = (
            new ethers.Contract(
                forwarderAddress.stringValue,
                LudexContract.ABI.ERC2771Forwarder,
                signer));
        this.slaves = slaves;
        this.verificationTimeoutMs = verificationTimeoutMs;
        this.txTimeoutMs = txTimeoutMs;
        this.eventTimeOutms = eventTimeoutMs;
    }

    public setTimeouts(
        { verify, tx, event }: { verify?: number; tx?: number; event?: number }) 
    : void
    {
        if (verify !== undefined) this.verificationTimeoutMs = verify;
        if (tx !== undefined) this.txTimeoutMs = tx;
        if (event !== undefined) this.eventTimeOutms = event;
    }

    private async verify(relayRequest: RelayRequest<any>): Promise<void>
    {
        let promise = 
            EIP712.getDomainOfContract(this.forwarder)
            .then(domain => {
                let types = ERC2771.ForwardRequestTypeDef;
                return (
                    ethers.verifyTypedData(
                        domain, 
                        types, 
                        relayRequest.request,
                        relayRequest.signature));})
            .then(recoveredAddress => {
                let from = relayRequest.request.from.toLowerCase();
                new Promise<void>((resolve, reject) =>
                    (from === recoveredAddress.toLowerCase())
                    ? resolve()
                    : reject(new EthereumError("Verification failed")))});
        let timeout = 
            new Promise<never>(
                (_, reject) => 
                    setTimeout(() => 
                        reject(new Web3Error("Verification timeout")),
                        this.verificationTimeoutMs));
        return Promise.race([promise, timeout]);
    }

    private async waitTX (tx: ethers.TransactionResponse)
    : Promise<void>
    {
        let promise = 
            tx.wait().then(receipt => 
                new Promise<void>((resolve, reject) => {
                    (receipt)
                    ? resolve()
                    : reject(new EthereumError("Transaction receipt was null"))}));
        let timeout = 
            new Promise<never>(
                (_, reject) => 
                    setTimeout(() => 
                        reject(new EthereumError("Transaction wait timeout")),
                        this.txTimeoutMs));
        return Promise.race([promise, timeout]);
    }

    public async acceptRequest(
        relayRequest: RelayRequest<any>, 
        sendResponse: (response: any) => void,
        onError: (error: Error) => void)
    : Promise<void>
    {
        let eventName = relayRequest.responseEvent;
        let txHash: string | null = null;

        try{
            await this.verify(relayRequest);

            let tx: ethers.TransactionResponse = 
                await (
                    this.forwarder.execute(
                        relayRequest.request, 
                        relayRequest.signature));

            txHash = tx.hash;
            for (let slave of this.slaves)
            {
                slave.startListening(eventName, sendResponse, txHash);
            }
            
            await this.waitTX(tx);

            return new Promise<never>((_, reject) => 
                setTimeout(() => reject(new EthereumError("No event happened")),
                    this.eventTimeOutms));
        }
        catch (error)
        {
            if (error instanceof Error)
            {
                onError(error);
            }
        }
        finally
        {
            if (!txHash) return;
            for (let slave of this.slaves)
                slave.stopListening(eventName, txHash);
        }
    }
}

export function createLudexRelayMaster(
    ludexConfig: LudexConfig, forwarderAddress: Address, signer: ethers.Signer
): RelayMaster
{
    let slaves = [
        new RelaySlave(
            Address.create(ludexConfig.storeAddress),
            LudexContract.ABI.Store,
            signer),
        new RelaySlave(
            Address.create(ludexConfig.priceTableAddress),
            LudexContract.ABI.PriceTable,
            signer),
        new RelaySlave(
            Address.create(ludexConfig.ledgerAddress),
            LudexContract.ABI.Ledger,
            signer),
        new RelaySlave(
            Address.create(ludexConfig.sellerRegistryAddress),
            LudexContract.ABI.SellerRegistry,
            signer),
        new RelaySlave(
            Address.create(ludexConfig.itemRegistryAddress),
            LudexContract.ABI.ItemRegistry,
            signer),
    ]

    return new RelayMaster(forwarderAddress, slaves, signer);
}