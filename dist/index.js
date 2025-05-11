"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.facade = exports.relay = exports.balanceOfUSDC = exports.giveawayUSDC = exports.ERC2771 = exports.EIP712 = exports.BrowserWalletConnection = exports.structs = exports.Address = exports.Web3Error = exports.EthereumError = exports.configs = void 0;
const configs = __importStar(require("./ts/configs"));
exports.configs = configs;
const error_1 = require("./ts/error");
Object.defineProperty(exports, "EthereumError", { enumerable: true, get: function () { return error_1.EthereumError; } });
Object.defineProperty(exports, "Web3Error", { enumerable: true, get: function () { return error_1.Web3Error; } });
const address_1 = require("./ts/address");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return address_1.Address; } });
const structs = __importStar(require("./ts/contract-defined-types"));
exports.structs = structs;
const browser_wallet_connection_1 = require("./ts/browser-wallet-connection");
Object.defineProperty(exports, "BrowserWalletConnection", { enumerable: true, get: function () { return browser_wallet_connection_1.BrowserWalletConnection; } });
const eip712_1 = require("./ts/utils/eip712");
Object.defineProperty(exports, "EIP712", { enumerable: true, get: function () { return eip712_1.EIP712; } });
const erc2771_1 = require("./ts/utils/erc2771");
Object.defineProperty(exports, "ERC2771", { enumerable: true, get: function () { return erc2771_1.ERC2771; } });
const mock_usdc_1 = require("./ts/mock-usdc");
Object.defineProperty(exports, "giveawayUSDC", { enumerable: true, get: function () { return mock_usdc_1.giveawayUSDC; } });
Object.defineProperty(exports, "balanceOfUSDC", { enumerable: true, get: function () { return mock_usdc_1.balanceOfUSDC; } });
const relay = __importStar(require("./ts/relayer/relay"));
exports.relay = relay;
;
const facade = __importStar(require("./ts/facades"));
exports.facade = facade;
//# sourceMappingURL=index.js.map