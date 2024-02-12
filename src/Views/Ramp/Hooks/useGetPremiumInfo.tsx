import mRampPlanAbi from '../Config/Abis/mRampPlan.json';
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

    if (getDataString(data, "planIds").length == 0) {
      return {
        isPremium: false,
        address: ""
      }
    }

    //console.log("planIds", getDataString(data, "planIds"));

    return {
      isPremium: getDataString(data, "planIds").filter(f => { return config.PremiumPlans.indexOf(f) >= 0 }).length > 0,
      address: getDataString(data, "uuidAddress")
    };

  }

  return null;
};
