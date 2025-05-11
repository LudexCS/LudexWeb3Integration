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
exports.ReadonlyAdapterLedger = void 0;
const ethers_1 = require("ethers");
const error_1 = require("../error");
const ludex_contracts_1 = require("ludex-contracts");
const adapter_1 = require("./adapter");
const address_1 = require("../address");
class ReadonlyAdapterLedger extends adapter_1.Adapter {
    constructor(config, component) {
        if (!config.ledgerAddress) {
            throw new error_1.Web3Error("Address of Ledger not configured");
        }
        super(address_1.Address.create(config.ledgerAddress), ludex_contracts_1.LudexContract.ABI.Ledger, component);
        this.nftContract = (new ethers_1.ethers.Contract(this.contractAddress.stringValue, ludex_contracts_1.LudexContract.ABI.ERC721, component.runner));
    }
    getPurchaseID(buyer, itemID, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            let tokenID = yield (this.contract.getPurchaseID(buyer.stringValue, itemID, timestamp.getTime() / 1000));
            if (!(yield this.proveOwnership(buyer, tokenID))) {
                return undefined;
            }
            return tokenID;
        });
    }
    proveOwnership(buyer, tokenID) {
        return __awaiter(this, void 0, void 0, function* () {
            let ownerAddress = yield this.nftContract.ownerOf(tokenID);
            return ownerAddress.toLowerCase() === buyer.stringValue.toLowerCase();
        });
    }
    getPurchaseInfo(tokenID) {
        return __awaiter(this, void 0, void 0, function* () {
            let [_, rawItemID, rawBuyer, rawTimestamp] = yield this.contract.purchases(tokenID);
            return {
                tokenID: tokenID,
                itemID: BigInt(rawItemID),
                buyer: address_1.Address.create(rawBuyer),
                timestamp: new Date(Number(rawTimestamp) * 1000)
            };
        });
    }
}
exports.ReadonlyAdapterLedger = ReadonlyAdapterLedger;
//# sourceMappingURL=ledger.js.map