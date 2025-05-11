import { ethers } from "ethers";
export declare namespace EIP712 {
    type Domain = {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    function getDomainOfContract(contract: ethers.Contract): Promise<Domain>;
}
//# sourceMappingURL=eip712.d.ts.map