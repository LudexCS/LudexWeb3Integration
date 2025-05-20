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
exports.MetaTXAdapterStore = void 0;
const ethers_1 = require("ethers");
const adapter_1 = require("./adapter");
const ludex_contracts_1 = require("ludex-contracts");
const address_1 = require("../address");
const eip712_1 = require("../utils/eip712");
const error_1 = require("../error");
class MetaTXAdapterStore extends adapter_1.Adapter {
    constructor(config, component) {
        if (!config.storeAddress) {
            throw new error_1.Web3Error("Address of Store not configured");
        }
        super(address_1.Address.create(config.storeAddress), ludex_contracts_1.LudexContract.ABI.Store, component);
    }
    permissionSignature(token, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            let tokenAddress = token.stringValue;
            let tokenContract = new ethers_1.ethers.Contract(tokenAddress, ludex_contracts_1.LudexContract.ABI.ERC20Permit, this.component.runner);
            let domain = yield eip712_1.EIP712.getDomainOfContract(tokenContract);
            let userAddress = yield this.component.runner.getAddress();
            let payment = yield this.contract.payment();
            let erc20PermitNonce = yield tokenContract.nonces(userAddress);
            let types = {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" }
                ]
            };
            let value = {
                owner: userAddress,
                spender: payment,
                value: ethers_1.MaxUint256,
                nonce: erc20PermitNonce,
                deadline: BigInt(Math.floor(Date.now() / 1000)) + deadline
            };
            let signature = yield this.component.runner.signTypedData(domain, types, value);
            return [value.deadline, ethers_1.ethers.Signature.from(signature)];
        });
    }
    purchaseItemRequest(itemID, token, deadline) {
        return __awaiter(this, void 0, void 0, function* () {
            let onResponseFunction = (itemID, buyer, tokenID) => tokenID;
            if (yield this.contract.isTokenPermitted(token.stringValue)) {
                return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "purchaseItem", [itemID, token.stringValue], deadline, "ItemPurchased", onResponseFunction));
            }
            let [purchaseDeadline, signature] = yield this.permissionSignature(token, deadline);
            let { v, r, s } = signature;
            return yield (this.component.createForwarderRequest(this.contractAddress, this.contract.interface, "purchaseItemWithPermission", [itemID, token.stringValue, purchaseDeadline, v, r, s], deadline, "ItemPurchased", onResponseFunction));
        });
    }
}
exports.MetaTXAdapterStore = MetaTXAdapterStore;
//# sourceMappingURL=store.js.map