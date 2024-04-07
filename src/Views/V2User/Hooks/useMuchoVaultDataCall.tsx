import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import MuchoBadgeManagerAbi from '../Config/Abis/MuchoBadgeManager.json';
import MuchoRewardRouterAbi from '../Config/Abis/MuchoRewardRouter.json';
import MuchoVaultConfigDataAbi from '../Config/Abis/MuchoVaultConfigData.json';
import MuchoProtocolGmxAbi from '../Config/Abis/MuchoProtocolGmx.json';
import MuchoHubAbi from '../Config/Abis/MuchoHub.json';
import { V2USER_CONFIG } from '../Config/v2UserConfig';
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
import { t } from 'i18next';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetMuchoVaultV2Data = () => {
  //console.log("useGetPlans");
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const v2UserConfig: (typeof V2USER_CONFIG)[42161] = V2USER_CONFIG[activeChain.id];

  let tokenCalls = [];
  v2UserConfig.TokenDictionary.forEach(t => { tokenCalls = tokenCalls.concat(getERC20TokenCalls(t)); });
  const { address: account } = useUserAccount();
  //console.log("tokenCalls", tokenCalls);

  let vaultInfoCalls = v2UserConfig.MuchoVault.vaults.map(v => {
    return {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getVaultInfo',
      args: [v],
      chainId: activeChain?.id,
      map: `getVaultInfo_${v}`
    }
  });

  vaultInfoCalls = vaultInfoCalls.concat(v2UserConfig.MuchoVault.vaults.map(v => {
    return {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'vaultTotalStaked',
      args: [v],
      chainId: activeChain?.id,
      map: `vaultTotalStaked_${v}`
    }
  }));

  vaultInfoCalls = vaultInfoCalls.concat([
    {
      address: v2UserConfig.MuchoVault.configDataContract,
      abi: MuchoVaultConfigDataAbi,
      functionName: "realGlpApr",
      args: [],
      chainId: activeChain?.id,
      map: "realGlpApr"
    },
    {
      address: v2UserConfig.MuchoProtocolGmx.contract,
      abi: MuchoProtocolGmxAbi,
      functionName: "glpApr",
      args: [],
      chainId: activeChain?.id,
      map: "glpApr"
    },
    {
      address: v2UserConfig.MuchoProtocolGmx.contract,
      abi: MuchoProtocolGmxAbi,
      functionName: "getTotalUSD",
      args: [],
      chainId: activeChain?.id,
      map: "getTotalUSD"
    },
    {
      address: v2UserConfig.MuchoProtocolGmx.contract,
      abi: MuchoProtocolGmxAbi,
      functionName: "getTotalUSDBacked",
      args: [],
      chainId: activeChain?.id,
      map: "getTotalUSDBacked"
    },
    {
      address: v2UserConfig.MuchoVault.configDataContract,
      abi: MuchoVaultConfigDataAbi,
      functionName: "weeklyUsdNftRewards",
      args: [],
      chainId: activeChain?.id,
      map: "weeklyUsdNftRewards"
    }
  ]);

  const vaultUSDCalls = v2UserConfig.MuchoVault.vaults.map(v => {
    return {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'vaultTotalUSD',
      args: [v],
      chainId: activeChain?.id,
      map: `vaultTotalUSD_${v}`
    }
  });

  const vaultAPRCalls = v2UserConfig.MuchoVault.vaults.map((v, i) => {
    const amount = v2UserConfig.MuchoVault.amountsForAprSimulation[i].amount * 10 ** v2UserConfig.MuchoVault.amountsForAprSimulation[i].decimals;
    return {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getExpectedAPR',
      args: [v, amount.toString()],
      chainId: activeChain?.id,
      map: `getExpectedAPR_${v}`
    }
  });

  const vaultDepfee = v2UserConfig.MuchoVault.vaults.map((v, i) => {
    const amount = 10 ** v2UserConfig.MuchoVault.amountsForAprSimulation[i].decimals;
    return {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getDepositFee',
      args: [v, amount.toString()],
      chainId: activeChain?.id,
      map: `getDepositFee_${v}`
    }
  });

  const vaultWdwfee = v2UserConfig.MuchoVault.vaults.map((v, i) => {
    const amount = 10 ** v2UserConfig.MuchoVault.amountsForAprSimulation[i].decimals;
    return {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getWithdrawalFee',
      args: [v, amount.toString()],
      chainId: activeChain?.id,
      map: `getWithdrawalFee_${v}`
    }
  });

  const muchoVaultParameterCalls = [
    /*{
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'bpSwapMuchoTokensFee',
      chainId: activeChain?.id,
      map: 'bpSwapMuchoTokensFee'
    },*/
    {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'muchoHub',
      chainId: activeChain?.id,
      map: 'muchoHub'
    },
    {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'priceFeed',
      chainId: activeChain?.id,
      map: 'priceFeed'
    },
    {
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'badgeManager',
      chainId: activeChain?.id,
      map: 'badgeManager'
    },
    /*{
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getSwapFee',
      args: [account],
      chainId: activeChain?.id,
      map: `getSwapFee_${account}`
    },*/
  ]

  let planCalls = [];
  v2UserConfig.Plans.forEach(p => {
    /*planCalls.push({
      address: v2UserConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'bpSwapMuchoTokensFeeForBadgeHolders',
      chainId: activeChain?.id,
      args: [p],
      map: `bpSwapMuchoTokensFeeForBadgeHolder_${p}`,
    });*/

    v2UserConfig.MuchoVault.vaults.forEach(v => {
      planCalls.push({
        address: v2UserConfig.MuchoVault.contract,
        abi: MuchoVaultAbi,
        functionName: 'getMaxDepositUserForPlan',
        chainId: activeChain?.id,
        args: [v, p],
        map: `getMaxDepositUserForPlan_${v}_${p}`,
      });
    })
  });

  let badgeDataCalls = [
    {
      address: v2UserConfig.MuchoBadgeManager.contract,
      abi: MuchoBadgeManagerAbi,
      functionName: 'allPlans',
      chainId: activeChain?.id,
      map: 'allPlans'
    },
    {
      address: v2UserConfig.MuchoHub.contract,
      abi: MuchoHubAbi,
      functionName: 'getExpectedNFTAnnualYield',
      chainId: activeChain?.id,
      map: 'getExpectedNFTAnnualYield'
    },
    {
      address: v2UserConfig.MuchoRewardRouter.contract,
      abi: MuchoRewardRouterAbi,
      functionName: 'getTotalPonderatedInvestment',
      chainId: activeChain?.id,
      map: 'getTotalPonderatedInvestment'
    },

  ]

  if (account) {
    badgeDataCalls = badgeDataCalls.concat([
      {
        address: v2UserConfig.MuchoRewardRouter.contract,
        abi: MuchoRewardRouterAbi,
        functionName: 'getUserMultiplierAndPlan',
        args: [account],
        chainId: activeChain?.id,
        map: `getUserMultiplierAndPlan_${account}`
      },
      {
        address: v2UserConfig.MuchoRewardRouter.contract,
        abi: MuchoRewardRouterAbi,
        functionName: 'rewards',
        args: [account, v2UserConfig.MuchoRewardRouter.rewardsToken],
        chainId: activeChain?.id,
        map: `rewards_${account}_${v2UserConfig.MuchoRewardRouter.rewardsToken}`
      },])
  }


  const calls = [...tokenCalls, ...vaultInfoCalls, ...vaultUSDCalls, ...vaultAPRCalls, ...muchoVaultParameterCalls, ...planCalls, ...badgeDataCalls, ...vaultDepfee, ...vaultWdwfee];
  let indexes: any = {};
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
    //console.log("DATA!!", data);
    data.indexes = indexes;



    responseMV = {
      contract: v2UserConfig.MuchoVault.contract,
      vaultsInfo: v2UserConfig.MuchoVault.vaults.map((v, i) => {
        const vInfo = getDataString(data, `getVaultInfo_${v}`);
        //console.log("vault info", vInfo);
        const depFee = getDataNumber(data, `getDepositFee_${v}`) / (10 ** v2UserConfig.MuchoVault.amountsForAprSimulation[i].decimals);
        const wdwFee = getDataNumber(data, `getWithdrawalFee_${v}`) / (10 ** v2UserConfig.MuchoVault.amountsForAprSimulation[i].decimals);
        //console.log("Dep fee", depFee);
        const dToken: IToken = getERC20Token(data, vInfo.depositToken);
        const mToken: IToken = getERC20Token(data, vInfo.muchoToken);
        const userVaultData = getUserVaultData(data, dToken.contract, mToken.contract);
        if (vInfo) {
          return {
            id: v,
            depositToken: dToken,
            muchoToken: mToken,
            decimals: dToken.decimals,
            expectedAPR: getDataNumber(data, `getExpectedAPR_${v}`) / 100,
            totalStaked: getDataNumber(data, `vaultTotalStaked_${v}`) / (10 ** dToken.decimals),
            totalUSDStaked: getDataNumber(data, `vaultTotalUSD_${v}`) / 10 ** 18,
            lastUpdate: new Date(vInfo.lastUpdate),
            stakable: vInfo.stakable,
            depositFee: depFee * 100,
            withdrawFee: wdwFee * 100,
            maxCap: vInfo.maxCap / (10 ** dToken.decimals),
            maxDepositUser: vInfo.maxDepositUser / (10 ** dToken.decimals),
            maxDepositPlans: v2UserConfig.Plans.map(p => { return { planId: p, maxDeposit: getDataNumber(data, `getMaxDepositUserForPlan_${v}_${p}`) / (10 ** dToken.decimals) } }),
            userData: userVaultData,
          }
        }
        return null;
      }),
      parametersInfo: {
        //swapFee: getDataNumber(data, 'bpSwapMuchoTokensFee') / 100,
        //swapFeePlans: v2UserConfig.Plans.map(p => { return { planId: p, swapFee: getDataNumber(data, `bpSwapMuchoTokensFeeForBadgeHolder_${p}`).fee / 100 } }),
        //userSwapFee: getDataNumber(data, `getSwapFee_${account}`) / 100,
      },
      contractsInfo: { muchoHub: getDataString(data, 'muchoHub'), priceFeed: getDataString(data, 'priceFeed'), badgeManager: getDataString(data, 'badgeManager') },
      badgeInfo: {
        annualEarningExpected: (getDataNumber(data, "realGlpApr") / getDataNumber(data, "glpApr")) * getDataNumber(data, 'getExpectedNFTAnnualYield') / 10 ** 18 + getDataNumber(data, 'weeklyUsdNftRewards') * 52,
        totalPonderatedInvestment: getDataNumber(data, 'getTotalPonderatedInvestment') / 10 ** 18,
        userBadgeData: getUserBadgeData(data, account),
      },
      backingInfo: {
        totalUSD: getDataNumber(data, 'getTotalUSD'),
        backedUSD: getDataNumber(data, 'getTotalUSDBacked')
      }
    };

  }

  //console.log("Response RPC", responseMV);

  return responseMV ? responseMV : null;
};

const getUserBadgeData = (data: any, account: string) => {
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  const usrMulPlan = getDataNumber(data, `getUserMultiplierAndPlan_${account}`);
  const v2UserConfig: (typeof V2USER_CONFIG)[42161] = V2USER_CONFIG[activeChain.id];
  if (!usrMulPlan) {
    return {
      planId: 0, planName: t("v2.No active subscription"), planMultiplier: 0,
      currentRewards: {
        amount: 0,
        token: "",
      }
    };
  }

  const [multiplier, planId] = usrMulPlan;

  return {
    planId: planId,
    planName: getDataString(data, 'allPlans').find(p => p.planId = planId).name,
    planMultiplier: multiplier,
    currentRewards: {
      amount: getDataNumber(data, `rewards_${account}_${v2UserConfig.MuchoRewardRouter.rewardsToken}`) / 10 ** 18,
      token: getERC20Token(data, v2UserConfig.MuchoRewardRouter.rewardsToken),
    }
  }
}

const getUserVaultData = (data: any, depositTokenContract: string, muchoTokenContract: string) => {
  return {
    depositTokens: getDataNumber(data, `balanceOf_${depositTokenContract}`) / 10 ** getDataNumber(data, `decimals_${depositTokenContract}`),
    muchoTokens: getDataNumber(data, `balanceOf_${muchoTokenContract}`) / 10 ** getDataNumber(data, `decimals_${muchoTokenContract}`),
  };
}