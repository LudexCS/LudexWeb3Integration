import { ethers } from "ethers";
import { ERC2771 } from "../utils/erc2771";
import { EncodedRelayResult } from "./relay-serialization";

export type RelayRequest<T> = {
    request: ERC2771.ForwardRequest;
    signature: string;
    responseEvent: string;
    onResponse: (args: EncodedRelayResult[]) => T;
};
