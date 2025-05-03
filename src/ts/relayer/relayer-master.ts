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

    private async verify(relayRequest: RelayRequest<any>): Promise<void> {
        const domain = await EIP712.getDomainOfContract(this.forwarder);

        const verifyPromise = (async () => {
            const recoveredAddress = ethers.verifyTypedData(
                domain,
                ERC2771.ForwardRequestTypeDef,
                relayRequest.request,
                relayRequest.signature
            );

            const expected = relayRequest.request.from.toLowerCase();
            const actual = recoveredAddress.toLowerCase();

            if (expected !== actual) {
                throw new EthereumError(
                    "Signature verification failed: mismatched signer");
            }
        })();

        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new Web3Error("Verification timeout")),
                this.verificationTimeoutMs
            )
        );

        return Promise.race([verifyPromise, timeoutPromise]);
    }
 

    private async waitTX (tx: ethers.TransactionResponse)
    : Promise<ethers.TransactionReceipt>
    {
        let promise = 
            tx.wait().then(receipt => 
                new Promise<ethers.TransactionReceipt>((resolve, reject) => {
                    (receipt)
                    ? resolve(receipt)
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
        onError: (error: Error) => void
    ): Promise<void> {
        const eventName = relayRequest.responseEvent;

        try {
            await this.verify(relayRequest);

            const forwardRequestObject = {
                from: relayRequest.request.from,
                to: relayRequest.request.to,
                value: relayRequest.request.value,
                gas: relayRequest.request.gas,
                deadline: relayRequest.request.deadline,
                data: relayRequest.request.data,
                signature: relayRequest.signature
            };

            const tx: ethers.TransactionResponse = await this.forwarder.execute(forwardRequestObject);
            const receipt = await this.waitTX(tx);
            const blockNumber = receipt.blockNumber;

            for (const slave of this.slaves) {
                const success = await slave.queryAndParseLog(
                    eventName,
                    blockNumber,
                    tx.hash,
                    sendResponse
                );
                if (success) return;
            }

            throw new EthereumError("No matching event found in any slave");

        } catch (error) {
            if (error instanceof Error) {
                onError(error);
            }
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