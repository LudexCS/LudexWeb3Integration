import { Address } from "./address";

export type PriceInfo = {
    token: Address;
    tokenAmount: bigint;
};

export type Purchase = {
    tokenID:  bigint;
    itemID: bigint;
    buyer: Address | bigint;
    timestamp: Date;
}
