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
exports.AdminAdapterPriceTable = exports.MetaTXAdapterPriceTable = exports.ReadonlyAdapterPriceTable = void 0;
const ludex_contracts_1 = require("ludex-contracts");
const adapter_1 = require("./adapter");
const address_1 = require("../address");
const error_1 = require("../error");
class ReadonlyAdapterPriceTable extends adapter_1.Adapter {
    constructor(config, component) {
        if (!config.priceTableAddress) {
            throw new error_1.Web3Error("Address of PriceTable not configured");
        }
        super(address_1.Address.create(config.priceTableAddress), ludex_contracts_1.LudexContract.ABI.PriceTable, component);
    }
    getPriceUsd(itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.getPriceUsd(itemID);
        });
    }
    getPriceInfoList(itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoListRaw = yield this.contract.getPriceInfoList(itemID);
            const result = [];
            for (let i = 0; i < infoListRaw.length; i++) {
                const token = result.push({
                    token: address_1.Address.create(infoListRaw[i].token),
                    tokenAmount: infoListRaw[i].tokenAmount
                });
            }
            return result;
        });
    }
    getExchangeRateOf(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.usdToToken(token.stringValue);
        });
    }
    getRevShare(sharerID, itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.getRevShare(sharerID, itemID);
        });
    }
}
exports.ReadonlyAdapterPriceTable = ReadonlyAdapterPriceTable;
class MetaTXAdapterPriceTable extends ReadonlyAdapterPriceTable {
    constructor(config, component) {
        super(config, component);
    }
    changeItemPriceRequest(itemID, priceUsd, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            let onResponseFunction = (itemID, priceUsd, prevPriceUsd) => prevPriceUsd;
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "changeItemPrice", [itemID, priceUsd], deadline, "ItemPriceChanged", onResponseFunction));
        });
    }
    startDiscountRequest(itemID, usdPrice, endTime, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "startDiscount", [itemID, usdPrice, BigInt(endTime.getTime() / 1000)], deadline, "DiscountStarted", (_) => { }));
        });
    }
    changeRevShareRequest(itemID, newShare, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "changeRevShare", [itemID, newShare], deadline, "RevShareChanged", (itemID, newShare, prevShare) => {
                return prevShare;
            }));
        });
    }
    startRevShareReductionEventRequest(itemID, reducedShare, endTime, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "startRevShareReductionEventRequest", [itemID, reducedShare, BigInt(endTime.getTime() / 1000)], deadline, "RevShareReductionStarted", (_) => { }));
        });
    }
}
exports.MetaTXAdapterPriceTable = MetaTXAdapterPriceTable;
class AdminAdapterPriceTable extends ReadonlyAdapterPriceTable {
    constructor(config, component) {
        super(config, component);
    }
    changeExchangeRate(token, usdToToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.changeExchangeRate(token.stringValue, usdToToken), "ExchangeRateChanged", (token, usdToToken, prevExchangeRate) => {
                console.log(`New exchange rate: ${usdToToken} USD for a ${token}`);
                return prevExchangeRate;
            });
        });
    }
    addPaymentChannel(token, usdToToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.addPaymentChannel(token.stringValue, usdToToken), "PaymentChannelAdded", (token, usdToToken) => {
                console.log(`New payment channel: ${usdToToken} USD for 1 ${token}`);
            });
        });
    }
    removePaymentChannel(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.removePaymentChannel(token.stringValue), "PaymentChannelRemoved", (token, isSuccess) => {
                console.log(`Payment channel removed: ${token}`);
                return isSuccess;
            });
        });
    }
}
exports.AdminAdapterPriceTable = AdminAdapterPriceTable;
//# sourceMappingURL=price-table.js.map