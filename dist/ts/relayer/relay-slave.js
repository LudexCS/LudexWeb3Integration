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
exports.RelaySlave = void 0;
const ethers_1 = require("ethers");
const relay_serialization_1 = require("./relay-serialization");
class RelaySlave {
    constructor(contractAddress, abi, signer) {
        this.contract = new ethers_1.ethers.Contract(contractAddress.stringValue, abi, signer);
        const eventNames = [];
        for (const eventName of Object.keys(this.contract.filters)) {
            eventNames.push(eventName);
        }
    }
    queryAndParseLog(eventName, blockNumber, txHash, sendResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let log;
            try {
                const filter = (_b = (_a = this.contract.filters)[eventName]) === null || _b === void 0 ? void 0 : _b.call(_a);
                if (!filter)
                    return false;
                const logs = yield this.contract.queryFilter(filter, blockNumber, blockNumber);
                log = logs.find(log => log.transactionHash === txHash);
                if (!log)
                    return false;
            }
            catch (_c) {
                return false;
            }
            const decodedArgs = this.contract.interface.decodeEventLog(eventName, log.data, log.topics);
            sendResponse([...decodedArgs].map(relay_serialization_1.encodeRelayResult));
            return true;
        });
    }
}
exports.RelaySlave = RelaySlave;
//# sourceMappingURL=relay-slave.js.map