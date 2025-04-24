import * as integrationConfig from "./ts/configs"
import { EthereumError, Web3Error } from "./ts/error";
import { Address as AddressType } from "./ts/address";
import * as structs from "./ts/contract-defined-types";
import { BrowserWalletConnection as connection } 
    from "./ts/browser-wallet-connection";
import { EIP712 as EIP712Util } from "./ts/utils/eip712";
import { ERC2771 as ERC2771Util } from "./ts/utils/erc2771";
import { RelayRequest } from "./ts/relay-request";
import { RelayCommand } from "./ts/relay";
import { IStoreMetaTXAccess } from "./ts/adapters/store";
import { 
    ILedgerReadonlyAccess,
    ILedgerMetaTXAccess,
    ILedgerAdminAccess,
    ILedgerServiceAccess
} from "./ts/adapters/ledger";
import { 
    IPriceTableReadOnlyAccess, 
    IPriceTableMetaTXAccess,
    IPriceTableAdminAccess,
    IPriceTableServiceAccess
} from "./ts/adapters/price-table"; 
import { 
    IItemRegistryReadonlyAccess,
    IItemRegistryMetaTXAccess,
    IItemRegistryAdminAccess,
    IItemRegistryServiceAccess
} from "./ts/adapters/item-registry";
import { 
    ISellerRegistryReadonlyAccess,
    ISellerRegistryMetaTXAccess,
    ISellerRegistryAdminAccess,
    ISellerRegistryServiceAccess
} from "./ts/adapters/seller-registry";

import * as facade from "./ts/facades";

export namespace Ludex {

    export const IntegrationConfig = integrationConfig;

    export const Error = { EthereumError, Web3Error };

    export type Address = AddressType;

    export const Structs = structs;

    export type Connection = connection;

    export const EIP712 = EIP712Util;

    export const ERC2771 = ERC2771Util;

    export namespace Relay {
        export type Request<T> = RelayRequest<T>;
        export type Command = RelayCommand;
    }

    export namespace Access {
        export namespace Readonly {
            export type ILedger = ILedgerReadonlyAccess;
            export type IPriceTable = IPriceTableReadOnlyAccess;
            export type ISellerRegistry = ISellerRegistryReadonlyAccess;
            export type IItemRegistry = IItemRegistryReadonlyAccess;
        }

        export namespace MetaTX {
            export type IStore = IStoreMetaTXAccess;
            export type ILedger = ILedgerMetaTXAccess;
            export type IPriceTable = IPriceTableMetaTXAccess;
            export type ISellerRegistry = ISellerRegistryMetaTXAccess;
            export type IItemRegistry = IItemRegistryMetaTXAccess;
        }

        export namespace Admin {
            export type ILedger = ILedgerAdminAccess;
            export type IPriceTable = IPriceTableAdminAccess;
            export type ISellerRegistry = ISellerRegistryAdminAccess;
            export type IItemRegistry = IItemRegistryAdminAccess;
        }

        export namespace Service {
            export type ILedger = ILedgerServiceAccess;
            export type IPriceTable = IPriceTableServiceAccess;
            export type ISellerRegistry = ISellerRegistryServiceAccess;
            export type IItemRegistry = IItemRegistryServiceAccess;
        }
    };
    
    export const Facade = facade;

}
