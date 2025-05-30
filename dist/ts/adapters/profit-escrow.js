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
exports.ServiceAdapterProfitEscrow = exports.MetaTXAdapterProfitEscrow = exports.ReadonlyAdapterProfitEscrow = void 0;
const adapter_1 = require("./adapter");
const ludex_contracts_1 = require("ludex-contracts");
const address_1 = require("../address");
const error_1 = require("../error");
class ReadonlyAdapterProfitEscrow extends adapter_1.Adapter {
    constructor(ludexConfig, component) {
        if (!ludexConfig.profitEscrowAddress) {
            throw new error_1.Web3Error("Address of ProfitEscrow not configured");
        }
        super(address_1.Address.create(ludexConfig.profitEscrowAddress), ludex_contracts_1.LudexContract.ABI.ProfitEscrow, component);
    }
    getBalanceFor(itemID, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.getBalanceFor(itemID, token.stringValue);
        });
    }
    getPendingProfit(itemID, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.getPendingProfit(itemID, token.stringValue);
        });
    }
}
exports.ReadonlyAdapterProfitEscrow = ReadonlyAdapterProfitEscrow;
class MetaTXAdapterProfitEscrow extends ReadonlyAdapterProfitEscrow {
    claimRequest(itemID, token, recipient, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            function onResponseFunction(itemID, token, recipient, amount) {
                return amount;
            }
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "claim", [itemID, token.stringValue, recipient.stringValue], deadline, "ProfitClaimed", onResponseFunction));
        });
    }
}
exports.MetaTXAdapterProfitEscrow = MetaTXAdapterProfitEscrow;
class ServiceAdapterProfitEscrow extends ReadonlyAdapterProfitEscrow {
    getWholePendingProfit(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.contract.getWholePendingProfit(token.stringValue);
        });
    }
    settlePendingProfit(token, itemIDs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.callAndParseLog(yield this.contract.settlePendingProfit(token.stringValue, itemIDs), "ProfitSettled", (_) => { });
        });
    }
}
exports.ServiceAdapterProfitEscrow = ServiceAdapterProfitEscrow;
//# sourceMappingURL=profit-escrow.js.map