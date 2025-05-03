import { ethers } from "ethers";

export namespace EIP712
{
    export type Domain = {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };

    export async function getDomainOfContract (contract: ethers.Contract): Promise<Domain> {
        const [
            _fields,
            name,
            version,
            chainId,
            verifyingContract,
            _salt,
            _extensions
        ] = await contract.eip712Domain();

        return {
            name,
            version,
            chainId: Number(chainId),
            verifyingContract
        };
    }
 
};
