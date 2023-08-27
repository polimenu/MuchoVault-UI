
import { Chain } from 'wagmi';
import ERC20Abi from '../Config/Abis/ERC20Ext.json';
import { useContext } from 'react';
import { ViewContext } from '..';
import { IToken } from '../v2AdminAtom';
import { useUserAccount } from '@Hooks/useUserAccount';


export const getDataString = (data: any, call: string) => {
    return data[data.indexes[call]] ? data[data.indexes[call]] : "";
}

export const getDataNumber = (data: any, call: string) => {
    return data[data.indexes[call]] ? data[data.indexes[call]] : 0;
}

export const getERC20TokenCalls = (address: string) => {
    let activeChain: Chain | null = null;
    const { address: account } = useUserAccount();
    const v2AdminContextValue = useContext(ViewContext);
    if (v2AdminContextValue) {
        activeChain = v2AdminContextValue.activeChain;
    }

    let calls = [{
        address: address,
        abi: ERC20Abi,
        functionName: 'symbol',
        chainId: activeChain?.id,
        args: [],
        map: `symbol_${address}`
    },
    {
        address: address,
        abi: ERC20Abi,
        functionName: 'decimals',
        chainId: activeChain?.id,
        args: [],
        map: `decimals_${address}`
    },
    {
        address: address,
        abi: ERC20Abi,
        functionName: 'totalSupply',
        chainId: activeChain?.id,
        args: [],
        map: `totalSupply_${address}`
    }
    ]

    //console.log("Account", account);
    if (account) {
        //console.log("pushing account info");
        calls.push({
            address: address,
            abi: ERC20Abi,
            functionName: 'balanceOf',
            chainId: activeChain?.id,
            args: [account],
            map: `balanceOf_${address}`
        })
    }

    //console.log("Intra token addr", address);
    //console.log("Intra token calls", calls);

    return calls;
}

export const getERC20Token = (data: any, address: string) => {
    return {
        name: getDataString(data, `symbol_${address}`),
        contract: address,
        decimals: getDataNumber(data, `decimals_${address}`),
        supply: getDataNumber(data, `totalSupply_${address}`),
        userBalance: getDataNumber(data, `balanceOf_${address}`),
    } as IToken
}