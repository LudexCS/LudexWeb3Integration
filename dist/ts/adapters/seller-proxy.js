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
exports.ServiceAdapterSellerProxy = void 0;
const ethers_1 = require("ethers");
const adapter_1 = require("./adapter");
const ludex_contracts_1 = require("ludex-contracts");
const address_1 = require("../address");
const error_1 = require("../error");
class ServiceAdapterSellerProxy extends adapter_1.Adapter {
    constructor(config, component) {
        if (!config.sellerProxyAddress) {
            throw new error_1.Web3Error("Address of SellerProxy not configured");
        }
        if (!config.itemRegistryAddress) {
            throw new error_1.Web3Error("Address of ItemRegistry not configured");
        }
        if (!config.profitEscrowAddress) {
            throw new error_1.Web3Error("Address of ProfitEscrow not configured");
        }
        if (!config.priceTableAddress) {
            throw new error_1.Web3Error("Address of PriceTable not configured");
        }
        super(address_1.Address.create(config.sellerProxyAddress), ludex_contracts_1.LudexContract.ABI.SellerProxy, component);
        this.itemRegistry =
            new ethers_1.ethers.Contract(config.itemRegistryAddress, ludex_contracts_1.LudexContract.ABI.ItemRegistry, component.runner);
        this.profitEscrow =
            new ethers_1.ethers.Contract(config.profitEscrowAddress, ludex_contracts_1.LudexContract.ABI.ProfitEscrow, component.runner);
        this.priceTable =
            new ethers_1.ethers.Contract(config.priceTableAddress, ludex_contracts_1.LudexContract.ABI.PriceTable, component.runner);
    }
    registerItem(nameHash, sellerID, parents, usdPrice, shares) {
        return __awaiter(this, void 0, void 0, function* () {
            function onItemRegistred(itemName, seller, itemID, price, shareIDs) {
                console.log(`New item register delegated: ${itemName} by ${sellerID}`);
                return [itemID, shareIDs];
            }
            const shareTermIDs = [];
            const shareRatios = [];
            for (let i = 0; i < shares.length; i++) {
                const [term, ratio] = shares[i];
                shareTermIDs.push(term);
                shareRatios.push(ratio);
            }
            return yield this.callAndParseLog(yield this.contract.registerItem(nameHash, sellerID, parents, usdPrice, shareTermIDs, shareRatios), "ItemRegistered", onItemRegistred, this.itemRegistry);
        });
    }
    claimProfit(sellerID, itemID, token, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            function onProfitClaimed(itemID, token, recipient, amount) {
                return amount;
            }
            return yield this.callAndParseLog(yield this.contract.claimProfit(sellerID, itemID, token.stringValue, recipient.stringValue), "ProfitClaimed", onProfitClaimed, this.profitEscrow);
        });
    }
    claimSellerRight(sellerID, items, seller) {
        return __awaiter(this, void 0, void 0, function* () {
            function onSellerRightClaimed(sellerID, seller, items) {
                return [address_1.Address.create(seller), items];
            }
            return yield this.callAndParseLog(yield this.contract.claimSellerRight(sellerID, items, seller.stringValue), "SellerRightClaimed", onSellerRightClaimed);
        });
    }
    changeItemPrice(sellerID, itemID, newUsdPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.changeItemPrice(sellerID, itemID, newUsdPrice), "ItemPriceChanged", (itemID, newUsdPrice, prevUsdPrice) => {
                return prevUsdPrice;
            }, this.priceTable);
        });
    }
    startDiscount(sellerID, itemID, discountPrice, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.startDiscount(sellerID, itemID, discountPrice, endTime), "DiscountStarted", (_) => { }, this.priceTable);
        });
    }
    changeRevShare(sellerID, itemID, newSharePermyriad) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.changeRevShare(sellerID, itemID, newSharePermyriad), "RevShareChanged", (itemID, newShare, prevShare) => prevShare, this.priceTable);
        });
    }
    startRevShareReductionEvent(sellerID, itemID, reducedShare, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.startRevShareReductionEvent(sellerID, itemID, reducedShare, endTime), "RevShareReductionStarted", (_) => { }, this.priceTable);
        });
    }
}
exports.ServiceAdapterSellerProxy = ServiceAdapterSellerProxy;
//# sourceMappingURL=seller-proxy.js.map