import { ethers } from "ethers";
import { ERC2771 } from "./utils/erc2771";

export type RelayRequest<T> = {
    request: ERC2771.ForwardRequest;
    signature: string;
    responseEvent: string;
    getValue: (log: ethers.Log) => T | null;
};