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
exports.RelayCommand = void 0;
const ethers_1 = require("ethers");
const ludex_contracts_1 = require("ludex-contracts");
const eip712_1 = require("./utils/eip712");
const erc2771_1 = require("./utils/erc2771");
const error_1 = require("./error");
class RelayCommand {
    constructor(forwarderAddress, wallet) {
        this.forwarder =
            new ethers_1.ethers.Contract(forwarderAddress.stringValue, ludex_contracts_1.LudexContract.ABI.ERC2771Forwarder, wallet);
        this.wallet = wallet;
    }
    verify(relayRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let { request, signature } = relayRequest;
            let domain = yield eip712_1.EIP712.getDomainOfContract(this.forwarder);
            let types = erc2771_1.ERC2771.ForwardRequestTypeDef;
            let signerAddress = ethers_1.ethers.verifyTypedData(domain, types, request, signature);
            return signerAddress.toLowerCase() === request.from.toLowerCase();
        });
    }
    execute(relayRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.verify(relayRequest)))
                throw new error_1.EthereumError("RelayRequest signature verification failed");
            let { request, signature, responseEvent, getValue } = relayRequest;
            let transaction = yield this.forwarder.execute(request, signature);
            let receipt = yield transaction.wait();
            if (!receipt) {
                throw new error_1.EthereumError("No transaction receipt gotten");
            }
            for (let log of receipt.logs) {
                try {
                    let parseResult = this.forwarder.interface.parseLog(log);
                    if ((parseResult === null || parseResult === void 0 ? void 0 : parseResult.name) !== responseEvent)
                        continue;
                    let result = getValue(log);
                    if (result)
                        return result;
                }
                catch (_) {
                    continue;
                }
            }
            throw new error_1.EthereumError("Expected event not found in receipt logs");
        });
    }
}
exports.RelayCommand = RelayCommand;
//# sourceMappingURL=relay.js.map