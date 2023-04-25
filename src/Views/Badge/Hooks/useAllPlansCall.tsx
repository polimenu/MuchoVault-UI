import MuchoBadgeManagerAbi from '../Config/Abis/MuchoBadgeManager.json';
import ERC20ExtAbi from '../Config/Abis/ERC20Ext.json';
import { BADGE_CONFIG } from '../Config/Plans';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractRead, useContractReads } from 'wagmi';
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

export const useGetPlans = () => {
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
    address: badge_config.MuchoBadgeManager,
    abi: MuchoBadgeManagerAbi,
    functionName: 'allPlans',
    chainId: activeChain.id,
    watch: true,
  }

  let { data } = useContractRead(allPlansCall);
  data = getBNtoStringCopy(data);

  //console.log("Result plans"); console.log(data);

  let response = {};

  if (data && data[0]) {

    let tokens: string[] = [];
    data.forEach((p) => {
      if (tokens.indexOf(p.subscriptionPrice.token) < 0)
        tokens.push(p.subscriptionPrice.token);

      if (tokens.indexOf(p.renewalPrice.token) < 0)
        tokens.push(p.renewalPrice.token);
    });

    const tokenCalls = tokens.map(t => {
      return {
        address: t,
        abi: ERC20ExtAbi,
        functionName: 'decimals',
        chainId: activeChain.id,
      }
    }).concat(
      tokens.map(t => {
        return {
          address: t,
          abi: ERC20ExtAbi,
          functionName: 'symbol',
          chainId: activeChain.id,
        }
      })
    );

    let tokensData = useContractReads({
      contracts: tokenCalls,
      watch: false,
    }).data;

    //console.log("Tokens data");
    //console.log(tokensData);

    if (tokensData) {

      const tokenMap = (tk: string) => {
        const i = tokens.indexOf(tk);
        return {
          decimals: tokensData[i],
          symbol: tokensData[tokens.length + i],
        }
      }

      //console.log("test"); console.log(tokenMap(tokens[0]));

      //let showInfo = account && ((account == "0xcc7322a3A115b05EAE4E99eC5728C0c7fD2BD269") || (account == "0x829C145cE54A7f8c9302CD728310fdD6950B3e16"));



      let resObject: IBadge = {};
      resObject.plans = [];

      for (var i = 0; i < data.length; i++) {
        const subTk = tokenMap(data[i].subscriptionPrice.token);
        const renTk = tokenMap(data[i].renewalPrice.token);

        resObject.plans.push({
          id: data[i].id,
          name: data[i].name,
          uri: data[i].uri,
          subscribers: data[i].subscribers,
          subscriptionPrice: {
            token: subTk.symbol,
            amount: data[i].subscriptionPrice.amount / (10 ** subTk.decimals),
            contract: data[i].subscriptionPrice.token,
            decimals: subTk.decimals
          },
          renewalPrice: {
            token: renTk.symbol,
            amount: data[i].renewalPrice.amount / (10 ** renTk.decimals),
            contract: data[i].renewalPrice.token,
            decimals: renTk.decimals
          },
          time: data[i].time / (24 * 3600),
          exists: data[i].exists,
          enabled: data[i].enabled
        });
      }


      // FORMATTING
      response = resObject;
    }

  }

  //console.log("Formatting done!");
  //console.log(response);

  return response ? response : { plans: null };
};