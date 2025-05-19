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
exports.Adapter = exports.MetaTXAdapterComponent = exports.AdapterComponent = void 0;
const ethers_1 = require("ethers");
const relay_serialization_1 = require("../relayer/relay-serialization");
const erc2771_1 = require("../utils/erc2771");
const eip712_1 = require("../utils/eip712");
const error_1 = require("../error");
class AdapterComponent {
    constructor(runner) {
        this.runner = runner;
    }
}
exports.AdapterComponent = AdapterComponent;
class MetaTXAdapterComponent extends AdapterComponent {
    constructor(runner, forwarder) {
        super(runner);
        this.forwarder = forwarder;
    }
    createForwarderRequest(contractAddress, contractInterface, func, params, deadline, responseEvent, onResponseFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            let forwarderDomain = yield eip712_1.EIP712.getDomainOfContract(this.forwarder);
            let userAddress = yield this.runner.getAddress();
            let forwarderNonce = yield this.forwarder.nonces(userAddress);
            let calldata = contractInterface.encodeFunctionData(func, params);
            let forwarderRequest = {
                from: userAddress,
                to: contractAddress.stringValue,
                value: BigInt(0),
                gas: BigInt(30000000),
                nonce: forwarderNonce,
                deadline: BigInt(Math.floor(Date.now() / 1000)) + deadline,
                data: calldata
            };
            let signature = yield (this.runner.signTypedData(forwarderDomain, erc2771_1.ERC2771.ForwardRequestTypeDef, forwarderRequest));
            let onResponseFunctionWithDecode = (encodedResults) => {
                let args = encodedResults.map(relay_serialization_1.decodeRelayResult);
                return onResponseFunction(...args);
            };
            return {
                request: forwarderRequest,
                signature: signature,
                responseEvent: responseEvent,
                onResponse: onResponseFunctionWithDecode
            };
        });
    }
}
exports.MetaTXAdapterComponent = MetaTXAdapterComponent;
class Adapter {
    constructor(contractAddress, abi, component, txTimeout = 60000, eventTimeout = 30000) {
        this.component = component;
        this.contractAddress = contractAddress;
        this.contractFactory = () => new ethers_1.ethers.Contract(contractAddress.stringValue, abi, component.runner);
        this.txTimeOut = txTimeout;
        this.eventTimeout = eventTimeout;
    }
    get contract() {
        return this.contractFactory();
    }
    callAndParseLog(tx, eventName, onEmit, filteringContract) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const receipt = yield Promise.race([
                tx.wait(),
                new Promise((_, reject) => setTimeout(() => reject(new error_1.EthereumError("Transaction confirmation timeout")), this.txTimeOut))
            ]);
            if (!receipt) {
                throw new error_1.EthereumError("Transaction failed");
            }
            const contract = filteringContract !== null && filteringContract !== void 0 ? filteringContract : this.contract;
            const logs = yield contract.queryFilter((_b = (_a = this.contract.filters)[eventName]) === null || _b === void 0 ? void 0 : _b.call(_a), receipt.blockNumber, receipt.blockNumber);
            const log = logs.find(log => log.transactionHash === tx.hash);
            if (!log) {
                throw new error_1.EthereumError(`'${eventName}' not found in transaction logs`);
            }
            const decodedArgs = this.contract.interface.decodeEventLog(eventName, log.data, log.topics);
            return onEmit(...decodedArgs);
        });
    }
}
exports.Adapter = Adapter;
//# sourceMappingURL=adapter.js.map