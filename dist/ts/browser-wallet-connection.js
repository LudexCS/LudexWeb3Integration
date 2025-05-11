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
exports.BrowserWalletConnection = void 0;
const address_1 = require("./address");
const ethers_1 = require("ethers");
const error_1 = require("./error");
function connectBrowserWallet(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!window.ethereum) {
            throw new error_1.Web3Error("No MetaMask found");
        }
        let currentChainId = yield window.ethereum.request({ method: "eth_chainId" });
        if (currentChainId == config.chainId) {
            return;
        }
        try {
            yield window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: config.chainId }]
            });
            return;
        }
        catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    yield window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [config]
                    });
                    return;
                }
                catch (addError) {
                    throw new error_1.Web3Error("LowLevelFailure: Add Chain");
                }
            }
            else {
                throw new error_1.Web3Error("LowLevelFailure: Add Chain");
            }
        }
    });
}
class BrowserWalletConnection {
    constructor(provider) {
        this.provider = provider;
    }
    static create(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connectBrowserWallet(config);
            if (typeof window.ethereum === 'undefined') {
                throw new error_1.Web3Error("No provider detected");
            }
            else {
                let provider = new ethers_1.ethers.BrowserProvider(window.ethereum);
                return new BrowserWalletConnection(provider);
            }
        });
    }
    getSigner() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.getSigner();
        });
    }
    getCurrentAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return (this.provider.getSigner(0)
                .then(signer => signer.address)
                .then(currentAddress => address_1.Address.create(currentAddress)));
        });
    }
}
exports.BrowserWalletConnection = BrowserWalletConnection;
//# sourceMappingURL=browser-wallet-connection.js.map