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
exports.EIP712 = void 0;
var EIP712;
(function (EIP712) {
    function getDomainOfContract(contract) {
        return __awaiter(this, void 0, void 0, function* () {
            const [_fields, name, version, chainId, verifyingContract, _salt, _extensions] = yield contract.eip712Domain();
            return {
                name,
                version,
                chainId: Number(chainId),
                verifyingContract
            };
        });
    }
    EIP712.getDomainOfContract = getDomainOfContract;
})(EIP712 || (exports.EIP712 = EIP712 = {}));
;
//# sourceMappingURL=eip712.js.map