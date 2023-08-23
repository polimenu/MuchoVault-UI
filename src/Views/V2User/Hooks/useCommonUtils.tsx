
import { Chain, useContractReads } from 'wagmi';
import ERC20Abi from '../Config/Abis/ERC20Ext.json';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { useContext } from 'react';
import { ViewContext } from '..';
import { IToken } from '../v2AdminAtom';

export const getERC20Token = (address: string) => {
    let activeChain: Chain | null = null;
    const v2AdminContextValue = useContext(ViewContext);
    if (v2AdminContextValue) {
        activeChain = v2AdminContextValue.activeChain;
    }

    const calls = [{
        address: address,
        abi: ERC20Abi,
        functionName: 'symbol',
        chainId: activeChain?.id,
    },
    {
        address: address,
        abi: ERC20Abi,
        functionName: 'decimals',
        chainId: activeChain?.id,
    },
    {
        address: address,
        abi: ERC20Abi,
        functionName: 'totalSupply',
        chainId: activeChain?.id,
    }
    ];


    let { data } = useContractReads({
        contracts: calls,
        watch: false,
    });
    data = getBNtoStringCopy(data);

    if (data && data[0]) {
        return { name: data[0], contract: address, decimals: data[1], supply: data[2] } as IToken
    }
    return { name: "", contract: address, decimals: 18, supply: 0 } as IToken
}