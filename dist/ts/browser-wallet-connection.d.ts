import { Address } from './address';
import { ethers } from 'ethers';
import { ChainConfig } from './configs';
declare global {
    interface Window {
        ethereum?: any;
    }
}
export declare class BrowserWalletConnection {
    private readonly provider;
    private constructor();
    static create(config: ChainConfig): Promise<BrowserWalletConnection>;
    getSigner(): Promise<ethers.Signer>;
    getCurrentAddress(): Promise<Address>;
}
//# sourceMappingURL=browser-wallet-connection.d.ts.map