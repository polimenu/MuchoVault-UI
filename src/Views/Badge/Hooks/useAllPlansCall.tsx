import FetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import MuchoNFTAbi from '../Config/Abis/MuchoNFT.json';
import MuchoPricingAbi from '../Config/Abis/MuchoPricing.json';
import { BADGE_CONFIG, BLACKLISTED_NFT, VALID_TOKENS } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractRead, useContractReads } from 'wagmi';
import { BadgeContext } from '..';
import { useContext, useEffect, useState } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { DEPRECATED_IBadge, DEPRECATED_IPlan, IPlanDetailed } from '../badgeAtom';
import { getDataString } from '@Views/Index/Hooks/useCommonUtils';
import { getDataNumber } from '@Views/Index/Hooks/useCommonUtils';
import { useGetPlansDetailed } from './useGetPlanData';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};


export const useGetAllPlanIds = (admin: boolean): number[] => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];
  //const [planIds, setPlanIds] = useState<number[]>([]);

  let { data } = useContractRead({
    address: badge_config.MuchoNFTFetcher,
    abi: FetcherAbi,
    functionName: 'allPlans',
    chainId: activeChain.id,
    watch: false
  });
  data = getBNtoStringCopy(data);

  //console.log("all plans data", data);
  if (data && data[0]) {
    const planList = data.map(p => Number(p.id)).filter(pid => admin || BLACKLISTED_NFT.indexOf(pid) < 0);
    return planList;
  }

  return [];
}

export const useGetPlans = (admin: boolean): IPlanDetailed[] => {
  const planIds = useGetAllPlanIds(admin);
  //console.log("***********PLANS IDS***************", planIds);
  const plans = useGetPlansDetailed(planIds);
  //console.log("***********PLANS***************", plans);

  return plans;
};