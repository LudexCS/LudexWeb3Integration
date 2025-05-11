"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC2771 = void 0;
var ERC2771;
(function (ERC2771) {
    ERC2771.ForwardRequestTypeDef = {
        ForwardRequest: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'gas', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint48' },
            { name: 'data', type: 'bytes' }
        ]
    };
})(ERC2771 || (exports.ERC2771 = ERC2771 = {}));
;
//# sourceMappingURL=erc2771.js.map