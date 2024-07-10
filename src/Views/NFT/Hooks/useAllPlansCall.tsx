import FetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import ERC20ExtAbi from '../Config/Abis/ERC20Ext.json';
import { BADGE_CONFIG, BLACKLISTED_NFT, VALID_TOKENS } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractReads } from 'wagmi';
import { BadgeContext } from '..';
import { useContext, useState } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IBadge, IPlan } from '../badgeAtom';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetPlans = (admin: boolean) => {
  let res: IBadge = null;
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }
  console.log("activeChain", activeChain);
  // const { state } = useGlobal();
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];

  const allPlansCall = {
    address: badge_config.MuchoNFTFetcher,
    abi: FetcherAbi,
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


  if (data && data[0]) {

    const tokenMap = VALID_TOKENS;
    //console.log("test"); console.log(tokenMap(tokens[0]));
    // console.log("DATA!", data);

    let resObject: IBadge = {};
    resObject.plans = [];

    const plans = data[0].filter(p => BLACKLISTED_NFT.indexOf(p.nftAddress) < 0);

    for (const plan of plans) {
      //console.log("Checking plan ", plan);
      const subTk = tokenMap[plan.subscriptionPrice.token];
      const renTk = tokenMap[plan.renewalPrice.token];

      //console.log(data[1].filter(p => p.id == plan.id));
      const enabledSubscription = plan.enabled;

      if (admin || enabledSubscription) {
        resObject.plans.push({
          id: plan.nftAddress,
          name: plan.planName,
          uri: "",
          subscribers: 0,
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
          time: plan.duration / (24 * 3600),
          exists: true,
          enabled: plan.enabled,
          status: plan.enabled ? "Enabled" : "Disabled",
          activeSubscribers: 0,
          isActiveForCurrentUser: false, //ToDo
          isExpiredForCurrentUser: false,
        });
      }
    }


    // FORMATTING
    res = resObject;


  }

  //console.log("Formatting done!");
  //console.log(response);

  return res;
};