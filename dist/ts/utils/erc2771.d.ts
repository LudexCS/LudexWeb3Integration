export declare namespace ERC2771 {
    type ForwardRequest = {
        from: string;
        to: string;
        value: bigint;
        gas: bigint;
        nonce: bigint;
        deadline: bigint;
        data: string;
    };
    const ForwardRequestTypeDef: {
        ForwardRequest: {
            name: string;
            type: string;
        }[];
    };
}
//# sourceMappingURL=erc2771.d.ts.map