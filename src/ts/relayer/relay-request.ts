import { ethers } from "ethers";
import { ERC2771 } from "../utils/erc2771";

export type RelayRequest<T> = {
    request: ERC2771.ForwardRequest;
    signature: string;
    responseEvent: string;
    onResponse: (...args: any[]) => T;
};

type RelayRequestSerialization = {
    request: {
        from: string;
        to: string;
        value: string;
        gas: string;
        nonce: string;
        data: string;
    },
    signature: string;
    responseEvent: string;
}

export function serializeRelayRequest(relayRequest: RelayRequest<any>)
: string
{return (
    JSON.stringify({
        ...relayRequest,
        request: {
            ...relayRequest.request,
            value: relayRequest.request.value.toString(),
            gas: relayRequest.request.gas.toString(),
            nonce: relayRequest.request.nonce.toString(),
        }
}));}

export function deserializeRelayRequest(data: string)
: RelayRequest<any>
{
    const serialization: RelayRequestSerialization = JSON.parse(data);

    return {
        request: {
            from: serialization.request.from,
            to: serialization.request.to,
            value: BigInt(serialization.request.value),
            gas: BigInt(serialization.request.gas),
            nonce: BigInt(serialization.request.nonce),
            data: serialization.request.data
        },
        signature: serialization.signature,
        responseEvent: serialization.responseEvent,
        onResponse: (...args) => undefined
    }   
}