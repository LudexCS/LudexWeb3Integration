"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaTXAdapterSellerRegistry = exports.ReadonlyAdapterSellerRegistry = void 0;
const address_1 = require("../address");
const ludex_contracts_1 = require("ludex-contracts");
const adapter_1 = require("./adapter");
const error_1 = require("../error");
class ReadonlyAdapterSellerRegistry extends adapter_1.Adapter {
    constructor(config, component) {
        if (!config.sellerRegistryAddress) {
            throw new error_1.Web3Error("Address of SellerRegistry not configured");
        }
        super(address_1.Address.create(config.sellerRegistryAddress), ludex_contracts_1.LudexContract.ABI.SellerRegistry, component);
    }
    isActiveSeller(seller) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.contract.isActiveSeller(seller.stringValue));
        });
    }
    checkAcceptPaymentChannel(seller, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.contract.paymentChannels(seller.stringValue, token.stringValue));
        });
    }
}
exports.ReadonlyAdapterSellerRegistry = ReadonlyAdapterSellerRegistry;
class MetaTXAdapterSellerRegistry extends ReadonlyAdapterSellerRegistry {
    constructor(config, component) {
        super(config, component);
    }
    registerSellerRequest(paymentChannels, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            let onResponseFunction = (_seller, _channels, isSuccess) => {
                return isSuccess;
            };
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "registerSeller", [paymentChannels.map(address => address.stringValue)], deadline, "SellerRegistered", onResponseFunction));
        });
    }
    addPaymentChannelsRequest(paymentChannels, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "addPaymentChannels", [paymentChannels.map(address => address.stringValue)], deadline, "PaymentChannelsAdded", (_) => { }));
        });
    }
    removePaymentChannelsRequest(paymentChannels, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "removePaymentChannels", [paymentChannels.map(address => address.stringValue)], deadline, "PaymentChannelsRemoved", (_) => { }));
        });
    }
}
exports.MetaTXAdapterSellerRegistry = MetaTXAdapterSellerRegistry;
//# sourceMappingURL=seller-registry.js.map