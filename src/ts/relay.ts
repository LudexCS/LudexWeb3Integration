import { ethers } from "ethers";
import { Address } from "./address";
import { abi as ERC2771ForwarderABI } from "contracts/abi/ERC2771Forwarder.json";
import { RelayRequest } from "./relay-request";
import { EIP712 } from "./utils/eip712";
import { ERC2771 } from "./utils/erc2771";
import { EthereumError } from "./error";

export class RelayCommand
{
    private readonly forwarder: ethers.Contract;
    private readonly wallet: ethers.Wallet;

    public constructor (forwarderAddress: Address, wallet: ethers.Wallet)
    {
        this.forwarder = 
            new ethers.Contract(
                forwarderAddress.stringValue, 
                ERC2771ForwarderABI, 
                wallet);
        this.wallet = wallet;
    }

    private async verify<T>(relayRequest: RelayRequest<T>): Promise<boolean>
    {
        let { request, signature } = relayRequest;

        let domain = await EIP712.getDomainOfContract(this.forwarder);

        let types = ERC2771.ForwardRequestTypeDef;

        let signerAddress = 
            ethers.verifyTypedData(domain, types, request, signature);

        return signerAddress.toLowerCase() === request.from.toLowerCase();
    }

    public async execute<T>(relayRequest: RelayRequest<T>)
    : Promise<T>
    {
        if (!await this.verify(relayRequest))
            throw new EthereumError("RelayRequest signature verification failed");

        let { request, signature, responseEvent, getValue } = relayRequest;

        let transaction: ethers.TransactionResponse = 
            await this.forwarder.execute(request, signature);

        let receipt = await transaction.wait();

        if (!receipt)
        {
            throw new EthereumError("No transaction receipt gotten");
        }

        for (let log of receipt.logs)
        {
            try{
                let parseResult = 
                    this.forwarder.interface.parseLog(log);

                if(parseResult?.name !== responseEvent) continue;
                
                let result = getValue(log);

                if (result) return result;
            } 
            catch (_) 
            {
                continue;
            }
        }

        throw new EthereumError("Expected event not found in receipt logs");
    }
}