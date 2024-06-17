import FetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import ERC20ExtAbi from '../Config/Abis/ERC20Ext.json';
import { BADGE_CONFIG, BLACKLISTED_NFT, VALID_TOKENS } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractReads } from 'wagmi';
import { BadgeContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IBadge, IPlan } from '../badgeAtom';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetPlans = (admin: boolean) => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];

  const allPlansCall = {
    address: badge_config.MuchoNFTFetcher,
    abi: FetcherAbi,
    functionName: 'allPlans',
    chainId: activeChain.id,
  }

  let calls = [allPlansCall];

  /*if (account) {
    calls = calls.concat([{
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: 'activePlansForUser',
      chainId: activeChain.id,
      args: [account],
    }]);

  }*/

  //console.log("Calls"); console.log(calls);

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  console.log("Result plans"); console.log(data);

  let response = {};

  if (data && data[0]) {

    const tokenMap = VALID_TOKENS;
    //console.log("test"); console.log(tokenMap(tokens[0]));
    console.log("DATA!", data);

    let resObject: IBadge = {};
    resObject.plans = [];

    const plans = data[0].filter(p => BLACKLISTED_NFT.indexOf(Number(p.id)) < 0);

    for (const plan of plans) {
      console.log("Checking plan ", plan);
      const subTk = tokenMap[plan.subscriptionPrice.token];
      const renTk = tokenMap[plan.renewalPrice.token];

      //console.log(data[1].filter(p => p.id == plan.id));
      const enabledSubscription = plan.enabled;

      if (admin || enabledSubscription) {
        resObject.plans.push({
          id: plan.id,
          name: plan.name,
          uri: plan.uri,
          subscribers: plan.subscribers,
          subscriptionPrice: {
            token: subTk.symbol,
            amount: plan.subscriptionPrice.amount / (10 ** subTk.decimals),
            contract: plan.subscriptionPrice.token,
            decimals: subTk.decimals
          },
          renewalPrice: {
            token: renTk.symbol,
            amount: plan.renewalPrice.amount / (10 ** renTk.decimals),
            contract: plan.renewalPrice.token,
            decimals: renTk.decimals
          },
          time: plan.time / (24 * 3600),
          exists: plan.exists,
          enabled: plan.enabled,
          status: plan.enabled ? "Enabled" : "Disabled",
          activeSubscribers: plan.activeSubscribers,
          isActiveForCurrentUser: false, //ToDo
          isExpiredForCurrentUser: false,
        });
      }
    }


    // FORMATTING
    response = resObject;


  }

  //console.log("Formatting done!");
  //console.log(response);

  return response ? response : { plans: null };
};