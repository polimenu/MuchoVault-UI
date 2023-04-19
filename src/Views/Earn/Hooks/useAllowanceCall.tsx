import ERC20ExtAbi from '../Config/Abis/ERC20Ext.json';
import { EARN_CONFIG } from '../Config/Pools';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractRead } from 'wagmi';
import { EarnContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';

export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetAllowance = (tokenAdress: string, decimals: number) => {
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const earnContextValue = useContext(EarnContext);
  if (earnContextValue) {
    activeChain = earnContextValue.activeChain;
  }
  const pool_config: (typeof EARN_CONFIG)[42161] = EARN_CONFIG[activeChain?.id];

  const call = {
    address: tokenAdress,
    abi: ERC20ExtAbi,
    functionName: 'allowance',
    args: [account, pool_config.MuchoVault],
    chainId: activeChain.id,
    watch: true,
  };


  /*console.log("Allowance call");
  console.log(call);*/

  let { data } = useContractRead(call);

  if (!data)
    return 0;

  [data] = getBNtoStringCopy([data]), decimals;

  /*console.log("Allowance data read 2");
  console.log(data);*/

  return fromWei(data, decimals);
};