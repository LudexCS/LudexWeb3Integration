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

export type EncodedRelayResult =
  | { type: 'primitive'; value: string | number | boolean | null }
  | { type: 'bigint'; value: string }
  | { type: 'array'; value: EncodedRelayResult[] }
  | { type: 'object'; value: { [key: string]: EncodedRelayResult } };

export function encodeRelayResult(value: any): EncodedRelayResult {
  if (typeof value === 'bigint') {
    return { type: 'bigint', value: value.toString() };
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return { type: 'primitive', value };
  }
  if (Array.isArray(value)) {
    return { type: 'array', value: value.map(encodeRelayResult) };
  }
  if (typeof value === 'object') {
    const obj: Record<string, EncodedRelayResult> = {};
    for (const [key, val] of Object.entries(value)) {
      obj[key] = encodeRelayResult(val);
    }
    return { type: 'object', value: obj };
  }
  throw new Error(`Unsupported type for serialization: ${typeof value}`);
}

export function decodeRelayResult(tagged: EncodedRelayResult): any {
  switch (tagged.type) {
    case 'primitive':
      return tagged.value;
    case 'bigint':
      return BigInt(tagged.value);
    case 'array':
      return tagged.value.map(decodeRelayResult);
    case 'object':
      return Object.fromEntries(
        Object.entries(tagged.value).map(([k, v]) => [k, decodeRelayResult(v)])
      );
  }
}