"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumError = exports.Web3Error = void 0;
class Web3Error extends Error {
    constructor(msg) {
        super(msg);
        this.errorType = 'Web3';
    }
}
exports.Web3Error = Web3Error;
class EthereumError extends Error {
    constructor(msg) {
        super(msg);
        this.errorType = 'Ethereum';
    }
}
exports.EthereumError = EthereumError;
//# sourceMappingURL=error.js.map