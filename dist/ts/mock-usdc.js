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
exports.giveawayUSDC = giveawayUSDC;
exports.balanceOfUSDC = balanceOfUSDC;
const ludex_contracts_1 = require("ludex-contracts");
function giveawayUSDC(contractAddress, to, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const mockUSDC = ludex_contracts_1.LudexContract.Factory.MockUSDC.connect(contractAddress.stringValue, signer);
        yield mockUSDC.giveaway(to.stringValue);
    });
}
function balanceOfUSDC(contractAddress, of, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const mockUSDC = ludex_contracts_1.LudexContract.Factory.MockUSDC.connect(contractAddress.stringValue, provider);
        return yield mockUSDC.balanceOf(of.stringValue);
    });
}
//# sourceMappingURL=mock-usdc.js.map