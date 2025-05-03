import { ethers } from "ethers";
import { Address } from "../address";
import { LudexContract } from "ludex-contracts";
import { RelayRequest } from "../relayer/relay-request";
import { Adapter, AdapterComponent, MetaTXAdapterComponent } from "./adapter";
import { LudexConfig } from "../configs";

export interface ISellerRegistryReadonlyAccess
{
    isActiveSeller(seller: Address)
    : Promise<boolean>;

    checkAcceptPaymentChannel(seller: Address, token: Address)
    : Promise<boolean>;
}

export interface ISellerRegistryMetaTXAccess 
    extends ISellerRegistryReadonlyAccess
{
    registerSellerRequest(paymentChannels: Array<Address>, deadline: bigint)
    : Promise<RelayRequest<boolean>>;

    addPaymentChannelsRequest(paymentChannels: Array<Address>, deadline: bigint)
    : Promise<RelayRequest<void>>;

    removePaymentChannelsRequest(paymentChannels: Array<Address>, deadline: bigint)
    : Promise<RelayRequest<void>>;
}

export interface ISellerRegistryAdminAccess
    extends ISellerRegistryReadonlyAccess
{}

export interface ISellerRegistryServiceAccess
    extends ISellerRegistryAdminAccess
{}

export class ReadonlyAdapterSellerRegistry<
    T extends ethers.ContractRunner,
    U extends AdapterComponent<T>
>
    extends Adapter<T, U>
    implements 
        ISellerRegistryReadonlyAccess, 
        ISellerRegistryAdminAccess,
        ISellerRegistryServiceAccess
{
    public constructor (config: LudexConfig, component: U)
    {
        super(
            Address.create(config.sellerRegistryAddress),
            LudexContract.ABI.SellerRegistry,
            component);
    }

    public async isActiveSeller (seller: Address): Promise<boolean>
    {return await (
        this.contract.isActiveSeller(seller.stringValue));
    }

    public async checkAcceptPaymentChannel (
        seller: Address, 
        token: Address
    ): Promise<boolean>
    {return await (
        this.contract.paymentChannels(seller.stringValue, token.stringValue));
    }

}

export type BaseSellerRegistry =
    ReadonlyAdapterSellerRegistry<
        ethers.JsonRpcProvider,
        AdapterComponent<ethers.JsonRpcProvider>>;

export class MetaTXAdapterSellerRegistry 
    extends ReadonlyAdapterSellerRegistry<ethers.Signer, MetaTXAdapterComponent>
    implements ISellerRegistryMetaTXAccess
{

    public constructor (
        config: LudexConfig,
        component: MetaTXAdapterComponent
    ){
        super(config, component);
    }
    
    public async registerSellerRequest (
        paymentChannels: Array<Address>, 
        deadline: bigint
    ): Promise<RelayRequest<boolean>>
    {
        let onResponseFunction = 
            (_seller: string, _channels: string[], isSuccess: boolean) => {
                return isSuccess;   
            }

        return await (
            this.component.createForwarderRequest(
                this.contractAddress,
                this.contract.interface,
                "registerSeller", 
                [paymentChannels.map(address => address.stringValue)],
                deadline,
                "SellerRegistered",
                onResponseFunction));
    }

    public async addPaymentChannelsRequest(
        paymentChannels: Array<Address>,
        deadline: bigint
    ): Promise<RelayRequest<void>>
    {return await(
        this.component.createForwarderRequest(
            this.contractAddress,
            this.contract.interface,
            "addPaymentChannels",
            [paymentChannels.map(address => address.stringValue)],
            deadline,
            "PaymentChannelsAdded",
            (_) => {}));
    }

    public async removePaymentChannelsRequest(
        paymentChannels: Array<Address>,
        deadline: bigint
    ): Promise<RelayRequest<void>>
    {return await(
        this.component.createForwarderRequest(
            this.contractAddress,
            this.contract.interface,
            "removePaymentChannels",
            [paymentChannels.map(address => address.stringValue)],
            deadline,
            "PaymentChannelsRemoved",
            (_) => {}));
    }

}

