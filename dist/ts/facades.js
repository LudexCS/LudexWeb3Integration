"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFacade = exports.AdminFacade = exports.Web3UserFacade = exports.Web2UserFacade = exports.MetaTXFacade = exports.ReadonlyFacade = void 0;
exports.createWeb2UserFacade = createWeb2UserFacade;
exports.createWeb3UserFacade = createWeb3UserFacade;
exports.createAdminFacade = createAdminFacade;
exports.createServiceFacade = createServiceFacade;
const ethers_1 = require("ethers");
const price_table_1 = require("./adapters/price-table");
const adapter_1 = require("./adapters/adapter");
const ledger_1 = require("./adapters/ledger");
const seller_registry_1 = require("./adapters/seller-registry");
const item_registry_1 = require("./adapters/item-registry");
const store_1 = require("./adapters/store");
const error_1 = require("./error");
const address_1 = require("./address");
const ludex_contracts_1 = require("ludex-contracts");
const payment_processor_1 = require("./adapters/payment-processor");
class ReadonlyFacade {
    constructor(chainConfig, ludexConfig, runner, component) {
        this.chainConfig = chainConfig;
        this.ludexConfig = ludexConfig;
        this.runner = runner;
        this.component = component;
    }
    readonlyAccessPriceTable() {
        return (new price_table_1.ReadonlyAdapterPriceTable(this.ludexConfig, this.component));
    }
    readonlyAccessLedger() {
        return (new ledger_1.ReadonlyAdapterLedger(this.ludexConfig, this.component));
    }
    readonlyAccessSellerRegistry() {
        return (new seller_registry_1.ReadonlyAdapterSellerRegistry(this.ludexConfig, this.component));
    }
    readonlyAccessItemRegistry() {
        return (new item_registry_1.ReadonlyAdapterItemRegistry(this.ludexConfig, this.component));
    }
}
exports.ReadonlyFacade = ReadonlyFacade;
class MetaTXFacade extends ReadonlyFacade {
}
exports.MetaTXFacade = MetaTXFacade;
class Web2UserFacade extends ReadonlyFacade {
}
exports.Web2UserFacade = Web2UserFacade;
class Web3UserFacade extends MetaTXFacade {
    metaTXAccessPriceTable() {
        return (new price_table_1.MetaTXAdapterPriceTable(this.ludexConfig, this.component));
    }
    metaTXAccessLedger() {
        return (new ledger_1.ReadonlyAdapterLedger(this.ludexConfig, this.component));
    }
    metaTXAccessSellerRegistry() {
        return (new seller_registry_1.MetaTXAdapterSellerRegistry(this.ludexConfig, this.component));
    }
    metaTXAccessItemRegistry() {
        return (new item_registry_1.ReadonlyAdapterItemRegistry(this.ludexConfig, this.component));
    }
    metaTXAccessStore() {
        return (new store_1.MetaTXAdapterStore(this.ludexConfig, this.component));
    }
    metaTXAccessPaymentProcessor() {
        return (new payment_processor_1.MetaTXAdapterPaymentProcessor(this.ludexConfig, this.component));
    }
}
exports.Web3UserFacade = Web3UserFacade;
class AdminFacade extends ReadonlyFacade {
    adminAccessPriceTable() {
        return (new price_table_1.AdminAdapterPriceTable(this.ludexConfig, this.component));
    }
    adminAccessLedger() {
        return (new ledger_1.ReadonlyAdapterLedger(this.ludexConfig, this.component));
    }
    adminAccessSellerRegistry() {
        return (new seller_registry_1.ReadonlyAdapterSellerRegistry(this.ludexConfig, this.component));
    }
    adminAccessItemRegistry() {
        return (new item_registry_1.AdminAdapterItemRegistry(this.ludexConfig, this.component));
    }
}
exports.AdminFacade = AdminFacade;
class ServiceFacade extends AdminFacade {
    serviceAccessLedger() {
        return (new ledger_1.ReadonlyAdapterLedger(this.ludexConfig, this.component));
    }
    serviceAccessPriceTable() {
        return (new price_table_1.AdminAdapterPriceTable(this.ludexConfig, this.component));
    }
    serviceAccessSellerRegistry() {
        return (new seller_registry_1.ReadonlyAdapterSellerRegistry(this.ludexConfig, this.component));
    }
    serviceAccessItemRegistry() {
        return (new item_registry_1.ServiceAdapterItemRegistry(this.ludexConfig, this.component));
    }
}
exports.ServiceFacade = ServiceFacade;
function createWeb2UserFacade(chainConfig, ludexConfig, provider) {
    let provider_ = (provider)
        ? provider
        : new ethers_1.ethers.JsonRpcProvider(chainConfig.rpcUrls[0]);
    let component = new adapter_1.AdapterComponent(provider_);
    return new Web2UserFacade(chainConfig, ludexConfig, provider_, component);
}
function createWeb3UserFacade(chainConfig, ludexConfig, signer) {
    if (!ludexConfig.forwarderAddress) {
        throw new error_1.Web3Error("Address of forwarder not in ludexConfig");
    }
    let forwarderAddress = address_1.Address.create(ludexConfig.forwarderAddress);
    let component = new adapter_1.MetaTXAdapterComponent(signer, new ethers_1.ethers.Contract(forwarderAddress.stringValue, ludex_contracts_1.LudexContract.ABI.ERC2771Forwarder, signer));
    return new Web3UserFacade(chainConfig, ludexConfig, signer, component);
}
function createAdminFacade(chainConfig, ludexConfig, signer) {
    let component = new adapter_1.AdapterComponent(signer);
    return new AdminFacade(chainConfig, ludexConfig, signer, component);
}
function createServiceFacade(chainConfig, ludexConfig, signer) {
    let component = new adapter_1.AdapterComponent(signer);
    return new ServiceFacade(chainConfig, ludexConfig, signer, component);
}
//# sourceMappingURL=facades.js.map