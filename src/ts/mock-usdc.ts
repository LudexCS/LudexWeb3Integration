import { ethers } from "ethers";
import { LudexContract } from "ludex-contracts";
import { Address } from "./address";

export async function giveawayUSDC (
    contractAddress: Address,
    to: Address, 
    signer: ethers.Signer
): Promise<void>
{
    const mockUSDC = 
        LudexContract.Factory.MockUSDC.connect(
            contractAddress.stringValue,
            signer);
    
    await mockUSDC.giveaway(to.stringValue);
}

export async function balanceOfUSDC(
    contractAddress: Address,
    of: Address,
    provider: ethers.Provider
): Promise<bigint>
{
    const mockUSDC = 
        LudexContract.Factory.MockUSDC.connect(
            contractAddress.stringValue,
            provider);

    return await mockUSDC.balanceOf(of.stringValue);
}