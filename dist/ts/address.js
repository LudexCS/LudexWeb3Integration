"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const error_1 = require("./error");
const ethers_1 = require("ethers");
class Address {
    constructor(stringValue) {
        this.stringValue = stringValue;
    }
    static create(addressString) {
        if (!ethers_1.ethers.isAddress(addressString))
            throw new error_1.Web3Error(`Invalid address of ${addressString}`);
        else
            return new Address(ethers_1.ethers.getAddress(addressString));
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map