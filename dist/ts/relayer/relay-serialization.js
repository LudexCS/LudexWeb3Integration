"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeRelayRequest = serializeRelayRequest;
exports.deserializeRelayRequest = deserializeRelayRequest;
exports.encodeRelayResult = encodeRelayResult;
exports.decodeRelayResult = decodeRelayResult;
function serializeRelayRequest(relayRequest) {
    return (JSON.stringify(Object.assign(Object.assign({}, relayRequest), { request: Object.assign(Object.assign({}, relayRequest.request), { value: relayRequest.request.value.toString(), gas: relayRequest.request.gas.toString(), nonce: relayRequest.request.nonce.toString(), deadline: relayRequest.request.deadline.toString() }) })));
}
function deserializeRelayRequest(data) {
    return Object.assign(Object.assign({}, data), { request: Object.assign(Object.assign({}, data.request), { value: BigInt(data.request.value), gas: BigInt(data.request.gas), nonce: BigInt(data.request.nonce), deadline: BigInt(data.request.deadline) }), onResponse: (..._) => undefined });
}
function encodeRelayResult(value) {
    if (typeof value === 'bigint') {
        return { type: 'bigint', value: value.toString() };
    }
    if (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null) {
        return { type: 'primitive', value };
    }
    if (Array.isArray(value)) {
        return { type: 'array', value: value.map(encodeRelayResult) };
    }
    if (typeof value === 'object') {
        const obj = {};
        for (const [key, val] of Object.entries(value)) {
            obj[key] = encodeRelayResult(val);
        }
        return { type: 'object', value: obj };
    }
    throw new Error(`Unsupported type for serialization: ${typeof value}`);
}
function decodeRelayResult(tagged) {
    switch (tagged.type) {
        case 'primitive':
            return tagged.value;
        case 'bigint':
            return BigInt(tagged.value);
        case 'array':
            return tagged.value.map(decodeRelayResult);
        case 'object':
            return Object.fromEntries(Object.entries(tagged.value).map(([k, v]) => [k, decodeRelayResult(v)]));
    }
}
//# sourceMappingURL=relay-serialization.js.map