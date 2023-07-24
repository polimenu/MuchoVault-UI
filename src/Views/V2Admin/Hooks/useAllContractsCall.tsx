import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IMuchoVaultData, IMuchoVaultParametersInfo, IV2ContractData, IVaultInfo } from '../v2AdminAtom';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetV2Contracts = () => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const v2AdminConfig: (typeof V2ADMIN_CONFIG)[42161] = V2ADMIN_CONFIG[activeChain.id];

  const vaultInfoCalls = v2AdminConfig.MuchoVault.vaults.map(vId => {
    return {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getVaultInfo',
      args: [vId],
      chainId: activeChain?.id,
    }
  })

  const muchoVaultParameterCalls = [
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'bpSwapMuchoTokensFee',
      chainId: activeChain?.id,
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'earningsAddress',
      chainId: activeChain?.id,
    },
  ]

  const allPlansCall = {
    address: v2AdminConfig.MuchoBadgeManager,
    abi: MuchoVaultAbi,
    functionName: 'allPlans',
    chainId: activeChain.id,
  }

  let calls = [allPlansCall];

  //console.log("Calls"); console.log(calls);

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result plans"); console.log(data);

  let response = {};

  if (data && data[0]) {

    const tokenMap = VALID_TOKENS;
    //console.log("test"); console.log(tokenMap(tokens[0]));

    let resObject: IBadge = {};
    resObject.plans = [];

    for (var i = 0; i < data[0].length; i++) {
      const subTk = tokenMap[data[0][i].subscriptionPrice.token];
      const renTk = tokenMap[data[0][i].renewalPrice.token];

      //console.log("Checking plan " + data[0][i].id);
      //console.log(data[1].filter(p => p.id == data[0][i].id));
      //console.log(data[2].filter(p => p.id == data[0][i].id));
      const activeSubscription = (data[1] && (data[1].filter(p => p.id == data[0][i].id).length > 0)) ? true : false;
      const expiredSubscription = (data[2] && (data[2].filter(p => p.id == data[0][i].id).length > 0)) ? true : false;

      resObject.plans.push({
        id: data[0][i].id,
        name: data[0][i].name,
        uri: data[0][i].uri,
        subscribers: data[0][i].subscribers,
        subscriptionPrice: {
          token: subTk.symbol,
          amount: data[0][i].subscriptionPrice.amount / (10 ** subTk.decimals),
          contract: data[0][i].subscriptionPrice.token,
          decimals: subTk.decimals
        },
        renewalPrice: {
          token: renTk.symbol,
          amount: data[0][i].renewalPrice.amount / (10 ** renTk.decimals),
          contract: data[0][i].renewalPrice.token,
          decimals: renTk.decimals
        },
        time: data[0][i].time / (24 * 3600),
        exists: data[0][i].exists,
        enabled: data[0][i].enabled,
        status: data[0][i].enabled ? "Enabled" : "Disabled",
        activeSubscribers: data[0][i].activeSubscribers,
        isActiveForCurrentUser: activeSubscription,
        isExpiredForCurrentUser: expiredSubscription,
      });
    }


    // FORMATTING
    response = resObject;


  }

  //console.log("Formatting done!");
  //console.log(response);

  return response ? response : { plans: null };
};