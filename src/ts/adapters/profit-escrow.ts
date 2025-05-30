import { ethers } from 'ethers';
import { Adapter, MetaTXAdapterComponent, AdminAdapterComponent, AdapterComponent } from './adapter';
import { LudexContract } from 'ludex-contracts';
import { Address } from '../address'; 
import { RelayRequest } from '../relayer/relay-request';
import { LudexConfig } from '../configs';
import { Web3Error } from '../error';
import { IPriceTableReadOnlyAccess } from './price-table';

export interface IProfitEscrowReadonlyAccess
{
    getBalanceFor(itemID: bigint, token: Address)
    : Promise<bigint>;

    getPendingProfit(itemID: bigint, token: Address)
    : Promise<bigint>;
}

export interface IProfitEscrowMetaTXAccess
    extends IProfitEscrowReadonlyAccess
{
    claimRequest(
        itemID: bigint, 
        token: Address, 
        recipient: Address, 
        deadline: bigint
    ): Promise<RelayRequest<bigint>>;
}

export interface IProfitEscrowServiceAccess
    extends IProfitEscrowReadonlyAccess
{
    getWholePendingProfit(token: Address)
    : Promise<bigint>;

    settlePendingProfit(token: Address, itemIDs: bigint[])
    : Promise<void>;
}

export class ReadonlyAdapterProfitEscrow <
    T extends ethers.ContractRunner,
    U extends AdapterComponent<T>
>
    extends Adapter<T, U>
    implements IProfitEscrowReadonlyAccess
{

    public constructor (ludexConfig: LudexConfig, component: U)
    {
        if (!ludexConfig.profitEscrowAddress)
        {
            throw new Web3Error(
                "Address of ProfitEscrow not configured");
        }

        super(
            Address.create(ludexConfig.profitEscrowAddress), 
            LudexContract.ABI.ProfitEscrow,
            component);
    }

    public async getBalanceFor(
        itemID: bigint, 
        token: Address
    ): Promise<bigint> 
    {
        return await this.contract.getBalanceFor(itemID, token.stringValue);
    }

    public async getPendingProfit(itemID: bigint, token: Address)
    : Promise<bigint> 
    {
        return await this.contract.getPendingProfit(itemID, token.stringValue);
    }
}

export class MetaTXAdapterProfitEscrow
    extends ReadonlyAdapterProfitEscrow<ethers.Signer, MetaTXAdapterComponent>
    implements IProfitEscrowMetaTXAccess
{
    public async claimRequest(
        itemID: bigint, 
        token: Address, 
        recipient: Address,
        deadline: bigint
    ): Promise<RelayRequest<bigint>> 
    {
        function onResponseFunction (
            itemID: bigint,
            token: string,
            recipient: string,
            amount: bigint
        ){
            return amount;
        }

        return await (
            this.component.createForwarderRequest(
                this.contractAddress,
                this.contract.interface,
                "claim", [itemID, token.stringValue, recipient.stringValue],
                deadline,               
                "ProfitClaimed",
                onResponseFunction));
    }
}

export class ServiceAdapterProfitEscrow
    extends ReadonlyAdapterProfitEscrow<ethers.Signer, AdminAdapterComponent>
    implements IProfitEscrowServiceAccess
{
    public async getWholePendingProfit(token: Address)
    : Promise<bigint> 
    {
        return await this.contract.getWholePendingProfit(token.stringValue);
    }

    public async settlePendingProfit(token: Address, itemIDs: bigint[])
    : Promise<void> 
    {
        return await this.callAndParseLog(
            await this.contract.settlePendingProfit(
                token.stringValue, 
                itemIDs),
            "ProfitSettled",
            (_) => {})
    }
}
