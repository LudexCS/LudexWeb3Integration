export type ChainConfig = {
    chainId: string;         // hex string
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
};

export type LudexConfig = {
    storeAddress: string;
    priceTableAddress: string;
    ledgerAddress: string;
    sellerRegistryAddress: string;
    itemRegistryAddress: string;
};
