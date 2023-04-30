import ERC20ExtAbi from '../../Earn/Config/Abis/ERC20Ext.json';
import { EARN_CONFIG } from '../../Earn/Config/Pools';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractRead } from 'wagmi';
import { EarnContext } from '../../Earn';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';

export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetAllowance = (tokenAdress: string, decimals: number, spender: string, activeChainId: number) => {
  const { address: account } = useUserAccount();

  const call = {
    address: tokenAdress,
    abi: ERC20ExtAbi,
    functionName: 'allowance',
    args: [account, spender],
    chainId: activeChainId,
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

export const useGetApprovalAmount = (
  abi: any[],
  token_address: string,
  spender_address: string
) => {
  const { writeCall } = useWriteCall(token_address, abi);

  async function approve(amount, cb: (newState) => void) {
    cb(true);
    writeCall(
      (res) => {
        cb(false);
      },
      'approve',
      [spender_address, amount]
    );
  }


  return { approve };
};
