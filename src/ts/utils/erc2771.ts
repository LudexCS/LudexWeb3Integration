import { ethers } from "ethers";
import { EIP712 } from "./eip712";
import { Address } from "../address";

export namespace ERC2771
{

    export type ForwardRequest = {
        from: string;      
        to: string;        
        value: bigint;     
        gas: bigint;       
        nonce: bigint;     
        deadline: bigint;
        data: string;  
    };

    export const ForwardRequestTypeDef = {
        ForwardRequest: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'gas', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint48' },
            { name: 'data', type: 'bytes' }
        ]
    };
};