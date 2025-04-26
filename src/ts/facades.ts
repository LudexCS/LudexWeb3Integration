import { ethers } from "ethers";
import { ChainConfig, LudexConfig } from "./configs";
import { ReadonlyAdapterPriceTable, IPriceTableReadOnlyAccess, IPriceTableMetaTXAccess, MetaTXAdapterPriceTable, IPriceTableAdminAccess, AdminAdapterPriceTable, IPriceTableServiceAccess } from "./adapters/price-table";
import { Adapter, AdapterComponent, MetaTXAdapterComponent, UserAdapterComponent } from "./adapters/adapter";
import { ILedgerReadonlyAccess, ILedgerMetaTXAccess, ReadonlyAdapterLedger, ILedgerAdminAccess, ILedgerServiceAccess } from "./adapters/ledger";
import { ISellerRegistryReadonlyAccess, ISellerRegistryMetaTXAccess, ReadonlyAdapterSellerRegistry, MetaTXAdapterSellerRegistry, ISellerRegistryAdminAccess, ISellerRegistryServiceAccess } from "./adapters/seller-registry";
import { IItemRegistryReadonlyAccess, IItemRegistryMetaTXAccess, ReadonlyAdapterItemRegistry, IItemRegistryAdminAccess, AdminAdapterItemRegistry, ServiceAdapterItemRegistry, IItemRegistryServiceAccess } from "./adapters/item-registry";
import { BrowserWalletConnection } from "./browser-wallet-connection";
import { IStoreMetaTXAccess, MetaTXAdapterStore } from "./adapters/store";
import { Web3Error } from "./error";
import { Address } from "./address";
import { LudexContract} from "ludex-contracts"

export interface IReadonlyFacade
{
    readonlyAccessPriceTable(): IPriceTableReadOnlyAccess;
    readonlyAccessLedger(): ILedgerReadonlyAccess;
    readonlyAccessSellerRegistry(): ISellerRegistryReadonlyAccess;
    readonlyAccessItemRegistry(): IItemRegistryReadonlyAccess;
}

export interface IMetaTXFacade extends IReadonlyFacade
{
    metaTXAccessPriceTable(): IPriceTableMetaTXAccess;
    metaTXAccessLedger(): ILedgerMetaTXAccess;
    metaTXAccessSellerRegistry(): ISellerRegistryMetaTXAccess;
    metaTXAccessItemRegistry(): IItemRegistryMetaTXAccess;
    metaTXAccessStore(): IStoreMetaTXAccess;
}

export interface IAdminFacade extends IReadonlyFacade
{
    adminAccessPriceTable(): IPriceTableAdminAccess;
    adminAccessLedger(): ILedgerAdminAccess;
    adminAccessSellerRegistry(): ISellerRegistryAdminAccess;
    adminAccessItemRegistry(): IItemRegistryAdminAccess;
}

export interface IServiceFacade extends IAdminFacade
{
    serviceAccessPriceTable(): IPriceTableServiceAccess;
    serviceAccessLedger(): ILedgerServiceAccess;
    serviceAccessSellerRegistry(): ISellerRegistryServiceAccess;
    serviceAccessItemRegistry(): IItemRegistryServiceAccess;
}

export abstract class ReadonlyFacade<
    T extends ethers.ContractRunner,
    U extends AdapterComponent<T>
>
    implements IReadonlyFacade
{
    protected readonly chainConfig: ChainConfig;
    protected readonly ludexConfig: LudexConfig;
    protected readonly runner: T;
    protected readonly component: U;

    public constructor (
        chainConfig: ChainConfig, 
        ludexConfig: LudexConfig,
        runner: T,
        component: U
    ){
        this.chainConfig = chainConfig;
        this.ludexConfig = ludexConfig;
        this.runner = runner;
        this.component = component;
    }

    public readonlyAccessPriceTable(): IPriceTableReadOnlyAccess
    {return (
        new ReadonlyAdapterPriceTable<T, U>(
            this.ludexConfig, this.component));
    }

    public readonlyAccessLedger(): ILedgerReadonlyAccess
    {return (
        new ReadonlyAdapterLedger<T, U>(
            this.ludexConfig, this.component));
    }

    public readonlyAccessSellerRegistry(): ISellerRegistryReadonlyAccess
    {return (
        new ReadonlyAdapterSellerRegistry<T, U>(
            this.ludexConfig, this.component));
    }

    public readonlyAccessItemRegistry(): IItemRegistryReadonlyAccess
    {return (
        new ReadonlyAdapterItemRegistry<T, U>(
            this.ludexConfig, this.component));
    }
}

export abstract class MetaTXFacade<
    T extends ethers.ContractRunner,
    U extends AdapterComponent<T>
>
    extends ReadonlyFacade<T, U>
    implements IMetaTXFacade
{
    public abstract metaTXAccessPriceTable(): IPriceTableMetaTXAccess;
    public abstract metaTXAccessLedger(): ILedgerMetaTXAccess;
    public abstract metaTXAccessSellerRegistry(): ISellerRegistryMetaTXAccess;
    public abstract metaTXAccessItemRegistry(): IItemRegistryMetaTXAccess;
    public abstract metaTXAccessStore(): IStoreMetaTXAccess;
}

export class Web2UserFacade
    extends ReadonlyFacade<
        ethers.JsonRpcProvider, 
        AdapterComponent<ethers.JsonRpcProvider>>
{}

export class Web3UserFacade
    extends MetaTXFacade<
        ethers.Signer,
        MetaTXAdapterComponent>
{
    public metaTXAccessPriceTable(): IPriceTableMetaTXAccess 
    {return (
        new MetaTXAdapterPriceTable(this.ludexConfig, this.component));
    }

    public metaTXAccessLedger(): ILedgerMetaTXAccess 
    {return (
        new ReadonlyAdapterLedger(this.ludexConfig, this.component));
    }

    public metaTXAccessSellerRegistry(): ISellerRegistryMetaTXAccess 
    {return (
        new MetaTXAdapterSellerRegistry(this.ludexConfig, this.component));
    }

    public metaTXAccessItemRegistry(): IItemRegistryMetaTXAccess 
    {return (
        new ReadonlyAdapterItemRegistry(this.ludexConfig, this.component));
    }

    public metaTXAccessStore(): IStoreMetaTXAccess 
    {return (
        new MetaTXAdapterStore(this.ludexConfig, this.component));
    }
}

export class AdminFacade
    extends ReadonlyFacade<ethers.Signer, AdapterComponent<ethers.Signer>>
    implements IAdminFacade
{
    public adminAccessPriceTable(): IPriceTableAdminAccess 
    {return (
        new AdminAdapterPriceTable(
            this.ludexConfig,
            this.component));
    }

    public adminAccessLedger(): ILedgerAdminAccess
    {return (
        new ReadonlyAdapterLedger(
            this.ludexConfig,
            this.component));
    }

    public adminAccessSellerRegistry(): ISellerRegistryAdminAccess 
    {return (
        new ReadonlyAdapterSellerRegistry(
            this.ludexConfig,
            this.component));
    }

    public adminAccessItemRegistry(): IItemRegistryAdminAccess 
    {return (
        new AdminAdapterItemRegistry(
            this.ludexConfig,
            this.component));
    }
}

export class ServiceFacade
    extends AdminFacade
    implements IServiceFacade
{
    public serviceAccessLedger()
    : ILedgerServiceAccess 
    {return (
        new ReadonlyAdapterLedger(this.ludexConfig, this.component));
    }

    public serviceAccessPriceTable()
    : IPriceTableServiceAccess 
    {return (
        new AdminAdapterPriceTable(this.ludexConfig, this.component));
    }

    public serviceAccessSellerRegistry()
    : ISellerRegistryServiceAccess 
    {return (
        new ReadonlyAdapterSellerRegistry(this.ludexConfig, this.component));
    }

    public serviceAccessItemRegistry(): ServiceAdapterItemRegistry 
    {return (
        new ServiceAdapterItemRegistry(this.ludexConfig, this.component));
    }
}

export function createWeb2UserFacade(
    chainConfig: ChainConfig, 
    ludexConfig: LudexConfig,
    provider?: ethers.JsonRpcProvider
): Web2UserFacade
{
    let provider_ = 
        (provider) 
        ?   provider 
        :   new ethers.JsonRpcProvider(chainConfig.rpcUrls[0]);
    let component = new AdapterComponent<ethers.JsonRpcProvider>(provider_);
    return new Web2UserFacade(chainConfig, ludexConfig, provider_, component);
}

export function createWeb3UserFacade(
    chainConfig: ChainConfig,
    ludexConfig: LudexConfig,
    signer: ethers.Signer,
    forwarderAddress: Address
): Web3UserFacade
{
    let component = 
        new MetaTXAdapterComponent(
            signer, 
            new ethers.Contract(
                forwarderAddress.stringValue, 
                LudexContract.ABI.ERC2771Forwarder,
                signer));
    return new Web3UserFacade(chainConfig, ludexConfig, signer, component);
}

export function createAdminFacade(
    chainConfig: ChainConfig,
    ludexConfig: LudexConfig,
    signer: ethers.Signer
): AdminFacade
{
    let component = new AdapterComponent<ethers.Signer>(signer);
    return new AdminFacade(chainConfig, ludexConfig, signer, component);
}

export function createServiceFacade(
    chainConfig: ChainConfig,
    ludexConfig: LudexConfig,
    signer: ethers.Signer
): ServiceFacade
{
    let component = new AdapterComponent<ethers.Signer>(signer);
    return new ServiceFacade(chainConfig, ludexConfig, signer, component);
}