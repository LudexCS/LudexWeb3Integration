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
exports.RelayMaster = void 0;
exports.createLudexRelayMaster = createLudexRelayMaster;
const ethers_1 = require("ethers");
const address_1 = require("../address");
const ludex_contracts_1 = require("ludex-contracts");
const eip712_1 = require("../utils/eip712");
const erc2771_1 = require("../utils/erc2771");
const error_1 = require("../error");
const relay_slave_1 = require("./relay-slave");
class RelayMaster {
    constructor(forwarderAddress, slaves, signer, verificationTimeoutMs = 10000, // 10 sec
    txTimeoutMs = 60000, // 1 min
    eventTimeoutMs = 30000) {
        this.verificationTimeoutMs = 10000; // 10 sec
        this.txTimeoutMs = 60000; // 1 min
        this.eventTimeOutms = 30000; // 30 sec
        this.forwarder = (new ethers_1.ethers.Contract(forwarderAddress.stringValue, ludex_contracts_1.LudexContract.ABI.ERC2771Forwarder, signer));
        this.slaves = slaves;
        this.verificationTimeoutMs = verificationTimeoutMs;
        this.txTimeoutMs = txTimeoutMs;
        this.eventTimeOutms = eventTimeoutMs;
    }
    setTimeouts({ verify, tx, event }) {
        if (verify !== undefined)
            this.verificationTimeoutMs = verify;
        if (tx !== undefined)
            this.txTimeoutMs = tx;
        if (event !== undefined)
            this.eventTimeOutms = event;
    }
    verify(relayRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = yield eip712_1.EIP712.getDomainOfContract(this.forwarder);
            const verifyPromise = (() => __awaiter(this, void 0, void 0, function* () {
                const recoveredAddress = ethers_1.ethers.verifyTypedData(domain, erc2771_1.ERC2771.ForwardRequestTypeDef, relayRequest.request, relayRequest.signature);
                const expected = relayRequest.request.from.toLowerCase();
                const actual = recoveredAddress.toLowerCase();
                if (expected !== actual) {
                    throw new error_1.EthereumError("Signature verification failed: mismatched signer");
                }
            }))();
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new error_1.Web3Error("Verification timeout")), this.verificationTimeoutMs));
            return Promise.race([verifyPromise, timeoutPromise]);
        });
    }
    waitTX(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = tx.wait().then(receipt => new Promise((resolve, reject) => {
                (receipt)
                    ? resolve(receipt)
                    : reject(new error_1.EthereumError("Transaction receipt was null"));
            }));
            let timeout = new Promise((_, reject) => setTimeout(() => reject(new error_1.EthereumError("Transaction wait timeout")), this.txTimeoutMs));
            return Promise.race([promise, timeout]);
        });
    }
    acceptRequest(relayRequest, sendResponse, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventName = relayRequest.responseEvent;
            try {
                yield this.verify(relayRequest);
                const forwardRequestObject = {
                    from: relayRequest.request.from,
                    to: relayRequest.request.to,
                    value: relayRequest.request.value,
                    gas: relayRequest.request.gas,
                    deadline: relayRequest.request.deadline,
                    data: relayRequest.request.data,
                    signature: relayRequest.signature
                };
                const tx = yield this.forwarder.execute(forwardRequestObject);
                const receipt = yield this.waitTX(tx);
                const blockNumber = receipt.blockNumber;
                for (const slave of this.slaves) {
                    const success = yield slave.queryAndParseLog(eventName, blockNumber, tx.hash, sendResponse);
                    if (success)
                        return;
                }
                throw new error_1.EthereumError("No matching event found in any slave");
            }
            catch (error) {
                if (error instanceof Error) {
                    onError(error);
                }
            }
        });
    }
}
exports.RelayMaster = RelayMaster;
function createLudexRelayMaster(ludexConfig, forwarderAddress, signer) {
    let slaves = [];
    if (ludexConfig.sellerRegistryAddress) {
        slaves.push(new relay_slave_1.RelaySlave(address_1.Address.create(ludexConfig.sellerRegistryAddress), ludex_contracts_1.LudexContract.ABI.SellerRegistry, signer));
    }
    if (ludexConfig.itemRegistryAddress) {
        slaves.push(new relay_slave_1.RelaySlave(address_1.Address.create(ludexConfig.itemRegistryAddress), ludex_contracts_1.LudexContract.ABI.ItemRegistry, signer));
    }
    if (ludexConfig.ledgerAddress) {
        slaves.push(new relay_slave_1.RelaySlave(address_1.Address.create(ludexConfig.ledgerAddress), ludex_contracts_1.LudexContract.ABI.Ledger, signer));
    }
    if (ludexConfig.priceTableAddress) {
        slaves.push(new relay_slave_1.RelaySlave(address_1.Address.create(ludexConfig.priceTableAddress), ludex_contracts_1.LudexContract.ABI.PriceTable, signer));
    }
    if (ludexConfig.paymentProcessorAddress) {
        slaves.push(new relay_slave_1.RelaySlave(address_1.Address.create(ludexConfig.paymentProcessorAddress), ludex_contracts_1.LudexContract.ABI.PaymentProcessor, signer));
    }
    if (ludexConfig.storeAddress) {
        slaves.push(new relay_slave_1.RelaySlave(address_1.Address.create(ludexConfig.storeAddress), ludex_contracts_1.LudexContract.ABI.Store, signer));
    }
    if (slaves.length == 0)
        throw new error_1.Web3Error("No RelaySlave generated from LudexConfig");
    return new RelayMaster(forwarderAddress, slaves, signer);
}
//# sourceMappingURL=relayer-master.js.map