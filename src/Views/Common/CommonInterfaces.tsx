export interface IContractReadsCall {
    address: string;
    abi: any;
    functionName: string;
    args: any[];
    chainId: number;
    map?: string
}