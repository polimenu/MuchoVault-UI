import mRampPlanAbi from '../Config/Abis/mRampPlan.json';
import MuchoBadgeAbi from '../../V2User/Config/Abis/MuchoBadgeManager.json';
import { getBNtoStringCopy } from '@Utils/useReadCall';

import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { RAMP_CONFIG } from '../Config/rampConfig';
import { IRampPremiumInfo } from '../rampAtom';
import { getDataString } from '@Views/Airdrop/Hooks/useCommonUtils';




export const useGetPremiumInfo = (user_id: string) => {
  let activeChain: Chain | null = null;
  const contextValue = useContext(ViewContext);
  const { address: account } = useUserAccount();
  if (contextValue) {
    activeChain = contextValue.activeChain;
  }
  const config = RAMP_CONFIG;

  const calls = user_id ? [
    {
      address: config.RampPlanContract,
      abi: mRampPlanAbi,
      functionName: 'planIds',
      args: [user_id],
      chainId: activeChain?.id,
      map: `planIds`
    },
    {
      address: config.RampPlanContract,
      abi: mRampPlanAbi,
      functionName: 'uuidAddress',
      args: [user_id],
      chainId: activeChain?.id,
      map: `uuidAddress`
    }
  ] : [];

  if (account) {
    calls.push({
      address: config.MuchoBadgeManager,
      abi: MuchoBadgeAbi,
      functionName: 'activePlansForUser',
      args: [account],
      chainId: activeChain?.id,
      map: `activePlansForUser`
    })
  }

  let indexes: any = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  let response: IRampPremiumInfo;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    data.indexes = indexes;

    const premiumCandidate = Boolean(getDataString(data, "activePlansForUser").length > 0 && getDataString(data, "activePlansForUser").find(p => p.id == "1"));
    //console.log("premiumCandidate", premiumCandidate);

    if (getDataString(data, "planIds").length == 0) {
      return {
        isPremium: false,
        address: "",
        canHavePremium: premiumCandidate
      }
    }

    //console.log("planIds", getDataString(data, "planIds"));

    const isPremium = getDataString(data, "planIds").filter(f => { return config.PremiumPlans.indexOf(f) >= 0 }).length > 0;
    const canHavePremium = !isPremium && premiumCandidate;

    return {
      isPremium: isPremium,
      address: getDataString(data, "uuidAddress"),
      canHavePremium: canHavePremium
    };

  }

  return null;
};
