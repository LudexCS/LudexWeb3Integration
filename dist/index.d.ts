import * as configs from "./ts/configs";
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
import { ILedgerReadonlyAccess, ILedgerMetaTXAccess, ILedgerAdminAccess, ILedgerServiceAccess } from "./ts/adapters/ledger";
import { IPriceTableReadOnlyAccess, IPriceTableMetaTXAccess, IPriceTableAdminAccess, IPriceTableServiceAccess } from "./ts/adapters/price-table";
import { IItemRegistryReadonlyAccess, IItemRegistryMetaTXAccess, IItemRegistryAdminAccess, IItemRegistryServiceAccess } from "./ts/adapters/item-registry";
import { ISellerRegistryReadonlyAccess, ISellerRegistryMetaTXAccess, ISellerRegistryAdminAccess, ISellerRegistryServiceAccess } from "./ts/adapters/seller-registry";
import { IProfitEscrowReadonlyAccess, IProfitEscrowMetaTXAccess, IProfitEscrowServiceAccess } from "./ts/adapters/profit-escrow";
import { ISellerProxyServiceAccess } from "./ts/adapters/seller-proxy";
import { IPurchaseProxyReadonlyAccess, IPurchaseProxyServiceAccess } from "./ts/adapters/purchase-proxy";
export declare namespace Access {
    namespace Readonly {
        type ILedger = ILedgerReadonlyAccess;
        type IPriceTable = IPriceTableReadOnlyAccess;
        type ISellerRegistry = ISellerRegistryReadonlyAccess;
        type IItemRegistry = IItemRegistryReadonlyAccess;
        type IProfitEscrow = IProfitEscrowReadonlyAccess;
        type IPurchaseProxy = IPurchaseProxyReadonlyAccess;
    }
    namespace MetaTX {
        type IStore = IStoreMetaTXAccess;
        type ILedger = ILedgerMetaTXAccess;
        type IPriceTable = IPriceTableMetaTXAccess;
        type ISellerRegistry = ISellerRegistryMetaTXAccess;
        type IItemRegistry = IItemRegistryMetaTXAccess;
        type IProfitEscrow = IProfitEscrowMetaTXAccess;
    }
    namespace Admin {
        type ILedger = ILedgerAdminAccess;
        type IPriceTable = IPriceTableAdminAccess;
        type ISellerRegistry = ISellerRegistryAdminAccess;
        type IItemRegistry = IItemRegistryAdminAccess;
    }
    namespace Service {
        type ILedger = ILedgerServiceAccess;
        type IPriceTable = IPriceTableServiceAccess;
        type ISellerRegistry = ISellerRegistryServiceAccess;
        type IItemRegistry = IItemRegistryServiceAccess;
        type IProfitEscrow = IProfitEscrowServiceAccess;
        type ISellerProxy = ISellerProxyServiceAccess;
        type IPurchaseProxy = IPurchaseProxyServiceAccess;
    }
}
import * as facade from "./ts/facades";
export { facade };
//# sourceMappingURL=index.d.ts.map