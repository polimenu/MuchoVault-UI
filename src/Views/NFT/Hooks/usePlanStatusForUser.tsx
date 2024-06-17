import NFTAbi from '../Config/Abis/MuchoNFT.json';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { Chain, useContractReads } from 'wagmi';
import { BadgeContext } from '..';
import { useContext, useEffect } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IPlan } from '../badgeAtom';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';

export const useSetNFTAttributesForUser = (plans: IPlan[]) => {
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }

  //useEffect(() => {
  //if (account && plans && plans.length > 0 && activeChain) {
  useSetNFTBalancesForUser(plans, account, activeChain.id);
  useSetNFTTokenIdsForUser(plans, account, activeChain.id);
  useSetNFTStatusForUser(plans, account, activeChain.id);
  useSetNFTRemainingDaysForUser(plans, account, activeChain.id);
  //}
  //}
  //  , [account, ...plans.map(p => p.id), activeChain.id]);
}

const useSetNFTBalancesForUser = (plans: IPlan[], account: string, chainId: number) => {

  let balanceCalls = [];
  //if (!account || !plans || plans.length == 0)
  //  return;

  if (account) {
    for (const plan of plans) {
      balanceCalls = balanceCalls.concat([{
        address: plan.id,
        abi: NFTAbi,
        functionName: 'balanceOf',
        chainId: chainId,
        args: [account],
      }]);
    }
  }

  //console.log("Calls"); console.log(calls);

  let { data } = useContractReads({
    contracts: balanceCalls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result plans"); console.log(data);
  if (data && data[0]) {
    //console.log("test"); console.log(tokenMap(tokens[0]));
    //console.log("DATA!!!!", data);
    let index = 0;

    for (const plan of plans) {
      //console.log("Checking balance of plan ", data[0][index], plan);
      plan.balanceForCurrentUser = Number(data[index++]);
    }
  }
};


const useSetNFTTokenIdsForUser = (plans: IPlan[], account: string, chainId: number) => {
  let calls = [];
  const balancePlans = plans.filter(p => p.balanceForCurrentUser > 0);

  if (account) {
    for (const plan of balancePlans) {
      calls = calls.concat([{
        address: plan.id,
        abi: NFTAbi,
        functionName: 'tokenOfOwnerByIndex',
        chainId: chainId,
        args: [account, 0],
      }]);
    }
  }

  //console.log("Calls"); console.log(calls);
  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result plans"); console.log(data);
  if (data && data[0]) {
    //console.log("test"); console.log(tokenMap(tokens[0]));
    //console.log("DATA!!!!!!", data);
    let index = 0;

    for (const plan of balancePlans) {
      //console.log("Checking tokenId plan ", data[index], plan);
      plan.tokenIdForCurrentUser = Number(data[index++]);
    }

    plans = plans.map(p => {
      const bPlan = balancePlans.find(bp => bp.id == p.id);
      return bPlan ? bPlan : p;
    });
  }
};



const useSetNFTStatusForUser = (plans: IPlan[], account: string, chainId: number) => {
  //console.log("useGetPlans");
  let calls = [];
  const balancePlans = plans.filter(p => p.tokenIdForCurrentUser > 0);

  if (account) {
    for (const plan of balancePlans) {
      calls = calls.concat([{
        address: plan.id,
        abi: NFTAbi,
        functionName: 'activeToken',
        chainId: chainId,
        args: [plan.tokenIdForCurrentUser],
      }]);
    }
  }

  //console.log("Calls"); console.log(calls);
  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result plans"); console.log(data);
  if (data && data[0]) {
    //console.log("test"); console.log(tokenMap(tokens[0]));
    //console.log("DATA!!!!!!!!!", data);
    let index = 0;

    for (const plan of balancePlans) {
      //console.log("Checking active tokenId ", data[index], plan);
      plan.isActiveForCurrentUser = data[index++];
      plan.isExpiredForCurrentUser = !plan.isActiveForCurrentUser;
    }

    plans = plans.map(p => {
      const bPlan = balancePlans.find(bp => bp.id == p.id);
      return bPlan ? bPlan : p;
    });
  }
};


const useSetNFTRemainingDaysForUser = (plans: IPlan[], account: string, chainId: number) => {
  //console.log("useGetPlans");
  let calls = [];
  const balancePlans = plans.filter(p => p.tokenIdForCurrentUser > 0);

  if (account) {
    for (const plan of balancePlans) {
      calls = calls.concat([{
        address: plan.id,
        abi: NFTAbi,
        functionName: 'tokenIdAttributes',
        chainId: chainId,
        args: [plan.tokenIdForCurrentUser],
      }]);
    }
  }

  //console.log("Calls"); console.log(calls);
  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result plans"); console.log(data);
  if (data && data[0]) {
    //console.log("test"); console.log(tokenMap(tokens[0]));
    //console.log("DATA!!!!!!!!!", data);
    let index = 0;

    for (const plan of balancePlans) {
      //console.log("Checking active tokenId ", data[index], plan);
      plan.remainingDaysForCurrentUser = Math.round((data[index].expirationTime - (new Date()).getTime() / 1000) / (24 * 3600));
      index++;
    }

    plans = plans.map(p => {
      const bPlan = balancePlans.find(bp => bp.id == p.id);
      return bPlan ? bPlan : p;
    });
  }
};