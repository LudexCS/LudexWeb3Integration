import { ethers } from "ethers";
import { Address } from "./address";
export declare function giveawayUSDC(contractAddress: Address, to: Address, signer: ethers.Signer): Promise<void>;
export declare function balanceOfUSDC(contractAddress: Address, of: Address, provider: ethers.Provider): Promise<bigint>;
//# sourceMappingURL=mock-usdc.d.ts.map