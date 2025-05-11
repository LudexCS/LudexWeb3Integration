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
exports.MetaTXAdapterPaymentProcessor = void 0;
const ethers_1 = require("ethers");
const adapter_1 = require("./adapter");
const ludex_contracts_1 = require("ludex-contracts");
const address_1 = require("../address");
const error_1 = require("../error");
class MetaTXAdapterPaymentProcessor extends adapter_1.Adapter {
    constructor(config, component) {
        if (!config.paymentProcessorAddress) {
            throw new error_1.Web3Error("Address of PaymentProcessor not configured");
        }
        super(address_1.Address.create(config.paymentProcessorAddress), ludex_contracts_1.LudexContract.ABI.PaymentProcessor, component);
    }
    getEscrowBalance(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let provider = this.component.runner.provider;
            let seller = yield this.component.runner.getAddress();
            let readonlyContract = new ethers_1.ethers.Contract(this.contractAddress.stringValue, this.contract.interface, provider);
            return yield readonlyContract.sellerTokenEscrow(seller, token.stringValue);
        });
    }
    claimRequest(token, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            let onResponseFunction = (seller, token, amount) => {
                console.log(`${seller} has gotten ${amount} of ${token}`);
                return amount;
            };
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "claim", [token.stringValue], deadline, "ProfitClaimed", onResponseFunction));
        });
    }
}
exports.MetaTXAdapterPaymentProcessor = MetaTXAdapterPaymentProcessor;
//# sourceMappingURL=payment-processor.js.map