export class Web3Error extends Error
{
    public errorType: string;

    public constructor(msg: string)
    {
        super(msg);
        this.errorType = 'Web3';
    }
}

export class EthereumError extends Error
{
    public errorType: string;

    public constructor(msg: string)
    {
        super(msg);
        this.errorType = 'Ethereum';
    }
}