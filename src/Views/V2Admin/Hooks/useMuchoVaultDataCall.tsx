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
import { IMuchoVaultData, IToken } from '../v2AdminAtom';
import { getDataNumber, getDataString, getERC20Token, getERC20TokenCalls } from './useCommonUtils';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetMuchoVaultV2Data = () => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const v2AdminConfig: (typeof V2ADMIN_CONFIG)[42161] = V2ADMIN_CONFIG[activeChain.id];

  let tokenCalls = [];
  v2AdminConfig.TokenDictionary.forEach(t => tokenCalls = tokenCalls.concat(getERC20TokenCalls(t)));

  let vaultInfoCalls = v2AdminConfig.MuchoVault.vaults.map(v => {
    return {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getVaultInfo',
      args: [v],
      chainId: activeChain?.id,
      map: `getVaultInfo_${v}`
    }
  });

  vaultInfoCalls = vaultInfoCalls.concat(v2AdminConfig.MuchoVault.vaults.map(v => {
    return {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'vaultTotalStaked',
      args: [v],
      chainId: activeChain?.id,
      map: `vaultTotalStaked_${v}`
    }
  }));

  const muchoVaultParameterCalls = [
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'bpSwapMuchoTokensFee',
      chainId: activeChain?.id,
      map: 'bpSwapMuchoTokensFee'
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'earningsAddress',
      chainId: activeChain?.id,
      map: 'earningsAddress'
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'muchoHub',
      chainId: activeChain?.id,
      map: 'muchoHub'
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'priceFeed',
      chainId: activeChain?.id,
      map: 'priceFeed'
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'badgeManager',
      chainId: activeChain?.id,
      map: 'badgeManager'
    },
  ]

  let planCalls = [];
  v2AdminConfig.Plans.forEach(p => {
    planCalls.push({
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'bpSwapMuchoTokensFeeForBadgeHolders',
      chainId: activeChain?.id,
      args: [p],
      map: `bpSwapMuchoTokensFeeForBadgeHolder_${p}`,
    });

    v2AdminConfig.MuchoVault.vaults.forEach(v => {
      planCalls.push({
        address: v2AdminConfig.MuchoVault.contract,
        abi: MuchoVaultAbi,
        functionName: 'getMaxDepositUserForPlan',
        chainId: activeChain?.id,
        args: [v, p],
        map: `getMaxDepositUserForPlan_${v}_${p}`,
      });
    })
  })

  const calls = [...tokenCalls, ...vaultInfoCalls, ...muchoVaultParameterCalls, ...planCalls];
  let indexes = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });

  //console.log("Calls", calls);
  //console.log("indexes", indexes);

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result contracts", data);

  let responseMV: IMuchoVaultData;
  //return response;

  if (data && data[0]) {
    data.indexes = indexes;
    //console.log("DATA!!", data);

    responseMV = {
      contract: v2AdminConfig.MuchoVault.contract,
      vaultsInfo: v2AdminConfig.MuchoVault.vaults.map((v, i) => {
        const vInfo = getDataString(data, `getVaultInfo_${v}`);
        const dToken: IToken = getERC20Token(data, vInfo.depositToken);
        const mToken: IToken = getERC20Token(data, vInfo.muchoToken);
        if (vInfo) {
          return {
            id: v,
            depositToken: dToken,
            muchoToken: mToken,
            decimals: dToken.decimals,
            totalStaked: getDataNumber(data, `vaultTotalStaked_${v}`) / (10 ** dToken.decimals),
            lastUpdate: Date(vInfo.lastUpdate),
            stakable: vInfo.stakable,
            depositFee: vInfo.depositFee / 100,
            withdrawFee: vInfo.withdrawFee / 100,
            maxCap: vInfo.maxCap / (10 ** dToken.decimals),
            maxDepositUser: vInfo.maxDepositUser / (10 ** dToken.decimals),
            maxDepositPlans: v2AdminConfig.Plans.map(p => { return { planId: p, maxDeposit: getDataNumber(data, `getMaxDepositUserForPlan_${v}_${p}`) / (10 ** dToken.decimals) } }),
          }
        }
        return null;
      }),
      parametersInfo: {
        swapFee: getDataNumber(data, 'bpSwapMuchoTokensFee') / 100,
        swapFeePlans: v2AdminConfig.Plans.map(p => { return { planId: p, swapFee: getDataNumber(data, `bpSwapMuchoTokensFeeForBadgeHolder_${p}`).fee / 100 } }),
        earningsAddress: getDataNumber(data, 'earningsAddress')
      },
      contractsInfo: { muchoHub: getDataString(data, 'muchoHub'), priceFeed: getDataString(data, 'priceFeed'), badgeManager: getDataString(data, 'badgeManager') },
    };

  }

  //console.log("Response RPC", responseMV);

  return responseMV ? responseMV : null;
};
