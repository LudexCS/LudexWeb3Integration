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
exports.ServiceAdapterPurchaseProxy = exports.ReadonlyAdapterPurchaseProxy = void 0;
const ethers_1 = require("ethers");
const adapter_1 = require("./adapter");
const ludex_contracts_1 = require("ludex-contracts");
const address_1 = require("../address");
const error_1 = require("../error");
class ReadonlyAdapterPurchaseProxy extends adapter_1.Adapter {
    constructor(ludexConfig, component) {
        if (!ludexConfig.purchaseProxyAddress) {
            throw new error_1.Web3Error("Address of PurchaseProxy not configured");
        }
        super(address_1.Address.create(ludexConfig.purchaseProxyAddress), ludex_contracts_1.LudexContract.ABI.PurchaseProxy, component);
    }
    getPurchaseInfo(purchaseID) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_, rawItemID, rawBuyer, rawTimestamp] = yield this.contract.getPurchaseInfo(purchaseID);
            return {
                tokenID: purchaseID,
                itemID: BigInt(rawItemID),
                buyer: BigInt(rawBuyer),
                timestamp: new Date(Number(rawTimestamp) * 1000)
            };
        });
    }
}
exports.ReadonlyAdapterPurchaseProxy = ReadonlyAdapterPurchaseProxy;
class ServiceAdapterPurchaseProxy extends ReadonlyAdapterPurchaseProxy {
    constructor(ludexConfig, component) {
        super(ludexConfig, component);
        if (!ludexConfig.storeAddress) {
            throw new error_1.Web3Error("Address of Store not configured");
        }
        this.store =
            new ethers_1.ethers.Contract(ludexConfig.storeAddress, ludex_contracts_1.LudexContract.ABI.Store, this.component.runner);
    }
    purchaseItem(token, itemID, ownerID) {
        return __awaiter(this, void 0, void 0, function* () {
            function onItemPurchased(itemID, buyer, tokenID) {
                return tokenID;
            }
            return yield this.callAndParseLog(yield this.contract.purchaseItem(token.stringValue, itemID, ownerID), "ItemPurchased", onItemPurchased, this.store);
        });
    }
    claimPurchaseIDs(ownerID, claimer, purchaseIDs) {
        return __awaiter(this, void 0, void 0, function* () {
            function onPurchaseIDsClaimed(owner, purchases) {
                return [address_1.Address.create(owner), purchases];
            }
            return yield this.callAndParseLog(yield this.contract.claimPurchaseIDs(ownerID, claimer.stringValue, purchaseIDs), "PurchaseIDsClaimed", onPurchaseIDsClaimed);
        });
    }
}
exports.ServiceAdapterPurchaseProxy = ServiceAdapterPurchaseProxy;
//# sourceMappingURL=purchase-proxy.js.map