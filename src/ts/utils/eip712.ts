import { ethers } from "ethers";

export namespace EIP712
{
    export type Domain = {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };

    export async function getDomainOfContract (contract: ethers.Contract)
    : Promise<Domain>
    {
        let domainObject = await contract.eip712Domain();
        return {
            name: domainObject.name,
            version: domainObject.version,
            chainId: Number(domainObject.chainId),
            verifyingContract: domainObject.verifyingContract
        };
    }
};
