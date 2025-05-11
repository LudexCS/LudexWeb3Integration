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
exports.ServiceAdapterItemRegistry = exports.AdminAdapterItemRegistry = exports.ReadonlyAdapterItemRegistry = void 0;
const ethers_1 = require("ethers");
const adapter_1 = require("./adapter");
const ludex_contracts_1 = require("ludex-contracts");
const address_1 = require("../address");
const error_1 = require("../error");
class ReadonlyAdapterItemRegistry extends adapter_1.Adapter {
    constructor(config, component) {
        if (!config.itemRegistryAddress) {
            throw new error_1.Web3Error("Address of ItemRegistry not configured");
        }
        super(address_1.Address.create(config.itemRegistryAddress), ludex_contracts_1.LudexContract.ABI.ItemRegistry, component);
    }
    sellerOf(itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            let addressString = yield this.contract.seller(itemID);
            if (addressString === ethers_1.ethers.ZeroAddress) {
                return undefined;
            }
            return address_1.Address.create(addressString);
        });
    }
    ancestorsOf(itemID_1) {
        return __awaiter(this, arguments, void 0, function* (itemID, hierarchy = 1) {
            if (hierarchy < 1) {
                return [];
            }
            let parents = yield this.contract.itemParents(itemID);
            for (let parent of parents) {
                parents.concat(yield this.ancestorsOf(parent, hierarchy - 1));
            }
            return parents;
        });
    }
    descendentsOf(itemID_1) {
        return __awaiter(this, arguments, void 0, function* (itemID, hierarchy = 1) {
            if (hierarchy < 1) {
                return [];
            }
            let children = yield this.contract.itemChilds(itemID);
            for (let child of children) {
                children.concat(yield this.descendentsOf(child, hierarchy - 1));
            }
            return children;
        });
    }
    timestampRegistered(itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.contract.timestampRegistered(itemID)
                .then(unixTime => new Date(unixTime * 1000)));
        });
    }
    getNameHash(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (this.contract.nameHash(itemName));
        });
    }
}
exports.ReadonlyAdapterItemRegistry = ReadonlyAdapterItemRegistry;
;
class AdminAdapterItemRegistry extends ReadonlyAdapterItemRegistry {
    constructor(config, component) {
        super(config, component);
    }
    suspendItemSale(itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.suspendItemSale(itemID), "ItemSaleSuspended", (item, suspension) => {
                console.log(`Item sale suspended: ${item}`);
                return suspension;
            });
        });
    }
    resumeItemSale(itemID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.resumeItemSale(itemID), "ItemSaleResumed", (item, resume) => {
                console.log(`Item sale resumed: ${item}`);
                return resume;
            });
        });
    }
}
exports.AdminAdapterItemRegistry = AdminAdapterItemRegistry;
class ServiceAdapterItemRegistry extends AdminAdapterItemRegistry {
    constructor(config, component) {
        super(config, component);
    }
    registerItem(itemName, seller, parents, usdPrice, shares) {
        return __awaiter(this, void 0, void 0, function* () {
            function onItemRegistred(itemName, seller, itemID, price, shareIDs) {
                console.log(`New item registered: ${itemName} by ${seller}`);
                return [itemID, shareIDs];
            }
            const shareTermIDs = [];
            const shareRatios = [];
            for (let i = 0; i < shares.length; i++) {
                const [term, ratio] = shares[i];
                shareTermIDs.push(term);
                shareRatios.push(ratio);
            }
            return yield this.callAndParseLog(yield this.contract.registerItem(itemName, seller.stringValue, parents, usdPrice, shareTermIDs, shareRatios), "ItemRegistered", onItemRegistred);
        });
    }
}
exports.ServiceAdapterItemRegistry = ServiceAdapterItemRegistry;
//# sourceMappingURL=item-registry.js.map