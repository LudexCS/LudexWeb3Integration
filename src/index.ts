import * as configs from "./ts/configs"

export { configs };


import { EthereumError, Web3Error } from "./ts/error";

export { EthereumError, Web3Error };


import { Address } from "./ts/address";

export { Address };


import * as structs from "./ts/contract-defined-types";

export { structs };


import { BrowserWalletConnection } from "./ts/browser-wallet-connection";

export { BrowserWalletConnection };


import { EIP712 } from "./ts/utils/eip712";

export { EIP712 };


import { ERC2771 } from "./ts/utils/erc2771";

export { ERC2771 };

import { giveawayUSDC, balanceOfUSDC } from "./ts/mock-usdc";

export { giveawayUSDC, balanceOfUSDC };

import * as relay from "./ts/relayer/relay";

export { relay };

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
import {
    IProfitEscrowReadonlyAccess,
    IProfitEscrowMetaTXAccess,
    IProfitEscrowServiceAccess
} from "./ts/adapters/profit-escrow";
import {
    ISellerProxyServiceAccess
} from "./ts/adapters/seller-proxy";
import {
    IPurchaseProxyReadonlyAccess,
    IPurchaseProxyServiceAccess
} from "./ts/adapters/purchase-proxy";

export namespace Access {
    export namespace Readonly {
        export type ILedger = ILedgerReadonlyAccess;
        export type IPriceTable = IPriceTableReadOnlyAccess;
        export type ISellerRegistry = ISellerRegistryReadonlyAccess;
        export type IItemRegistry = IItemRegistryReadonlyAccess;
        export type IProfitEscrow = IProfitEscrowReadonlyAccess;
        export type IPurchaseProxy = IPurchaseProxyReadonlyAccess;
    }

    export namespace MetaTX {
        export type IStore = IStoreMetaTXAccess;
        export type ILedger = ILedgerMetaTXAccess;
        export type IPriceTable = IPriceTableMetaTXAccess;
        export type ISellerRegistry = ISellerRegistryMetaTXAccess;
        export type IItemRegistry = IItemRegistryMetaTXAccess;
        export type IProfitEscrow = IProfitEscrowMetaTXAccess;
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
        export type IProfitEscrow = IProfitEscrowServiceAccess;
        export type ISellerProxy = ISellerProxyServiceAccess;
        export type IPurchaseProxy = IPurchaseProxyServiceAccess;
    }
};

import * as facade from "./ts/facades";

export { facade };
