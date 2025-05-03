import { ethers } from "ethers";
import { ERC2771 } from "../utils/erc2771";

export type RelayRequest<T> = {
    request: ERC2771.ForwardRequest;
    signature: string;
    responseEvent: string;
    onResponse: (...args: any[]) => T;
};

export type RelayRequestData = {
    request: {
        from: string;
        to: string;
        value: string;
        gas: string;
        nonce: string;
        deadline: string;
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
            deadline: relayRequest.request.deadline.toString()
        }
}));}

export function deserializeRelayRequest(data: RelayRequestData)
: RelayRequest<any>
{
    return {
        ...data,
        request: {
            ...data.request,
            value: BigInt(data.request.value),
            gas: BigInt(data.request.gas),
            nonce: BigInt(data.request.nonce),
            deadline: BigInt(data.request.deadline)
        },
        onResponse: (..._) => undefined
    }   
}