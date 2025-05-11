import { RelayRequest } from "./relay-request";
export type RelayRequestData = {
    request: {
        from: string;
        to: string;
        value: string;
        gas: string;
        nonce: string;
        deadline: string;
        data: string;
    };
    signature: string;
    responseEvent: string;
};
export declare function serializeRelayRequest(relayRequest: RelayRequest<any>): string;
export declare function deserializeRelayRequest(data: RelayRequestData): RelayRequest<any>;
export type EncodedRelayResult = {
    type: 'primitive';
    value: string | number | boolean | null;
} | {
    type: 'bigint';
    value: string;
} | {
    type: 'array';
    value: EncodedRelayResult[];
} | {
    type: 'object';
    value: {
        [key: string]: EncodedRelayResult;
    };
};
export declare function encodeRelayResult(value: any): EncodedRelayResult;
export declare function decodeRelayResult(tagged: EncodedRelayResult): any;
//# sourceMappingURL=relay-serialization.d.ts.map