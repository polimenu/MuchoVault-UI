import MuchoNFTFetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import MuchoNFTAbi from '../Config/Abis/MuchoNFT.json';
import MuchoPricingAbi from '../Config/Abis/MuchoPricing.json';
import { BADGE_CONFIG, BLACKLISTED_NFT, VALID_TOKENS } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractReads } from 'wagmi';
import { BadgeContext } from '..';
import { useContext, useEffect, useState } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IBadge, IPlan } from '../badgeAtom';
import { getDataString } from '@Views/Index/Hooks/useCommonUtils';
import { getDataNumber } from '@Views/Index/Hooks/useCommonUtils';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetPlans = (admin: boolean) => {
  let response: IBadge = {};
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];
  const [plans, setPlans] = useState<IPlan[]>([]);

  const calls = [];

  const allPlansCall = {
    address: badge_config.MuchoNFTFetcher,
    abi: MuchoNFTFetcherAbi,
    functionName: 'allPlans',
    chainId: activeChain.id,
    map: 'allPlans'
  }
  calls.push(allPlansCall);

  //Active plans for user
  if (account) {
    calls.push({
      address: badge_config.MuchoNFTFetcher,
      abi: MuchoNFTFetcherAbi,
      functionName: 'activePlansForUser',
      chainId: activeChain.id,
      args: [account],
      map: 'activePlansForUser',
    });
  }

  //Calls by PLAN ID:
  if (plans && plans.length > 0) {

    let planIdCalls = [];
    //Supply
    planIdCalls = planIdCalls.concat(plans.map(p => {
      return {
        address: p.address,
        abi: MuchoNFTAbi,
        functionName: 'totalSupply',
        chainId: activeChain.id,
        map: `totalSupply_${p.id}`
      }
    }));

    //Pricings address (subscription)
    planIdCalls = planIdCalls.concat(plans.map(p => {
      return {
        address: badge_config.MuchoNFTFetcher,
        abi: MuchoNFTFetcherAbi,
        functionName: 'nftPricing',
        chainId: activeChain.id,
        args: [p.id],
        map: `nftSubPricing_${p.id}`
      }
    }));

    //Pricings address (renewal)
    planIdCalls = planIdCalls.concat(plans.map(p => {
      return {
        address: badge_config.MuchoNFTFetcher,
        abi: MuchoNFTFetcherAbi,
        functionName: 'nftRenewalPricing',
        chainId: activeChain.id,
        args: [p.id],
        map: `nftRenPricing_${p.id}`
      }
    }));

    /*---------------------------------------------------*/

    //Pricings data
    const PRICING_FIELDS = ['dateIni', 'dateEnd', 'dateRampIni', 'dateRampEnd', 'priceRampIni', 'priceRampEnd', 'token'];

    //Subscription
    planIdCalls = planIdCalls.concat(plans.map(p => {
      if (!p.subscriptionPricing.contract || p.subscriptionPricing.contract === "0x0000000000000000000000000000000000000000") {
        return undefined;
      }
      return PRICING_FIELDS.map(c => {
        return {
          address: p.subscriptionPricing.contract,
          abi: MuchoPricingAbi,
          functionName: c,
          chainId: activeChain.id,
          map: `subPricing_${c}_${p.id}`
        }
      });
    }).flat());

    //Renewal
    planIdCalls = planIdCalls.concat(plans.map(p => {
      if (!p.subscriptionPricing.contract || p.subscriptionPricing.contract === "0x0000000000000000000000000000000000000000") {
        return undefined;
      }
      return PRICING_FIELDS.map(c => {
        return {
          address: p.renewalPricing.contract,
          abi: MuchoPricingAbi,
          functionName: c,
          chainId: activeChain.id,
          map: `renPricing_${c}_${p.id}`
        }
      });
    }).flat());

    /*---------------------------------------------------------------------------*/
    //Price data
    const priceAccount = account ?? "0x0000000000000000000000000000000000000000";

    //Subscription:
    planIdCalls = planIdCalls.concat(plans.map(n => {
      if (!n.subscriptionPricing.contract || n.subscriptionPricing.contract === "0x0000000000000000000000000000000000000000") {
        return undefined;
      }
      return {
        address: badge_config.MuchoNFTFetcher,
        abi: MuchoNFTFetcherAbi,
        functionName: 'subscriptionPrice',
        chainId: activeChain.id,
        args: [n.id, priceAccount],
        map: `subscriptionPrice_${n.id}`
      }
    }));

    //Renewal:
    planIdCalls = planIdCalls.concat(plans.map(n => {
      if (!n.renewalPricing.contract || n.renewalPricing.contract === "0x0000000000000000000000000000000000000000") {
        return undefined;
      }
      return {
        address: badge_config.MuchoNFTFetcher,
        abi: MuchoNFTFetcherAbi,
        functionName: 'renewalPrice',
        chainId: activeChain.id,
        args: [n.id, priceAccount],
        map: `renewalPrice_${n.id}`
      }
    }));

    /*---------------------------------------------------------------------------*/

    planIdCalls.forEach(pc => {
      if (pc) {
        calls.push(pc)
      }
    });
  }

  //console.log("Calls", calls);
  let indexes: any = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });
  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);
  //console.log("Result plans", data);



  if (data && data[0]) {
    data.indexes = indexes;
    //console.log("test"); console.log(tokenMap(tokens[0]));
    //console.log("DATA!", data);

    let resObject: IBadge = {};
    resObject.plans = [];

    const planList = getDataString(data, 'allPlans').filter(p => admin || BLACKLISTED_NFT.indexOf(Number(p.id)) < 0);
    //console.log("plans", plans);

    for (const plan of planList) {

      const activePlans = getDataString(data, 'activePlansForUser');
      const activeSubscription = Boolean(activePlans && (activePlans.filter(p => p.id == plan.id).length > 0));
      const subToken = getDataString(data, `subPricing_token_${plan.id}`) == "" ? "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" : getDataString(data, `subPricing_token_${plan.id}`); //default USDT
      //console.log("subToken", subToken);
      const renToken = getDataString(data, `renPricing_token_${plan.id}`) == "" ? "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" : getDataString(data, `renPricing_token_${plan.id}`); //default USDT
      //console.log("renToken", subToken);

      //console.log("PUSHING PLAN!");
      resObject.plans.push({
        address: plan.nftAddress,
        id: plan.id,
        name: plan.planName,
        uri: "",
        subscribers: getDataNumber(data, `totalSupply_${plan.id}`),
        subscriptionPrice: {
          token: VALID_TOKENS[subToken].symbol,
          amount: getDataString(data, `subscriptionPrice_${plan.id}`).amount / 10 ** VALID_TOKENS[subToken].decimals,
          contract: subToken,
          decimals: VALID_TOKENS[subToken].decimals,
        },
        renewalPrice: {
          token: VALID_TOKENS[renToken].symbol,
          amount: getDataString(data, `renewalPrice_${plan.id}`).amount / 10 ** VALID_TOKENS[renToken].decimals,
          contract: renToken,
          decimals: VALID_TOKENS[renToken].decimals,
        },
        time: plan.duration / (24 * 3600),
        exists: true,
        enabled: plan.enabled,
        status: plan.enabled ? "Enabled" : "Disabled",
        isActiveForCurrentUser: activeSubscription,
        subscriptionPricing: {
          contract: getDataString(data, `nftSubPricing_${plan.id}`),
          dateIni: new Date(1000 * getDataNumber(data, `subPricing_dateIni_${plan.id}`)),
          dateEnd: new Date(1000 * getDataNumber(data, `subPricing_dateEnd_${plan.id}`)),
          dateRampIni: new Date(1000 * getDataNumber(data, `subPricing_dateRampIni_${plan.id}`)),
          dateRampEnd: new Date(1000 * getDataNumber(data, `subPricing_dateRampEnd_${plan.id}`)),
          priceRampIni: getDataNumber(data, `subPricing_priceRampIni_${plan.id}`) / 10 ** VALID_TOKENS[subToken].decimals,
          priceRampEnd: getDataNumber(data, `subPricing_priceRampEnd_${plan.id}`) / 10 ** VALID_TOKENS[subToken].decimals,
          token: subToken,
          tokenDecimals: VALID_TOKENS[subToken].symbol,
          tokenSymbol: VALID_TOKENS[subToken].decimals
        },
        renewalPricing: {
          contract: getDataString(data, `nftRenPricing_${plan.id}`),
          dateIni: new Date(1000 * getDataNumber(data, `renPricing_dateIni_${plan.id}`)),
          dateEnd: new Date(1000 * getDataNumber(data, `renPricing_dateEnd_${plan.id}`)),
          dateRampIni: new Date(1000 * getDataNumber(data, `renPricing_dateRampIni_${plan.id}`)),
          dateRampEnd: new Date(1000 * getDataNumber(data, `renPricing_dateRampEnd_${plan.id}`)),
          priceRampIni: getDataNumber(data, `renPricing_priceRampIni_${plan.id}`) / 10 ** VALID_TOKENS[renToken].decimals,
          priceRampEnd: getDataNumber(data, `renPricing_priceRampEnd_${plan.id}`) / 10 ** VALID_TOKENS[renToken].decimals,
          token: renToken,
          tokenDecimals: VALID_TOKENS[renToken].symbol,
          tokenSymbol: VALID_TOKENS[renToken].decimals
        }
      });
    }

    //console.log("resObject", resObject);

    // FORMATTING
    response = resObject;
  }

  //Hash: plan ID's + subcription pricing contracts + renewal pricing contracts
  const planIdsHash = (response.plans) ? response.plans.map(p => p.id).sort().join("#") : "";
  const subPricingCtHash = (response.plans) ? response.plans.map(p => p.subscriptionPricing.contract).sort().join("#") : "";
  const renPricingCtHash = (response.plans) ? response.plans.map(p => p.renewalPricing.contract).sort().join("#") : "";
  const hash = [planIdsHash, subPricingCtHash, renPricingCtHash].join("#");
  //console.log("hash", hash);

  useEffect(() => {
    //console.log("**********************************************Trying to set plans with hash", hash);
    if (hash && hash != "##" && response && response.plans) {
      //console.log("**********************************************Setting plans with hash", hash);
      setPlans(response.plans);
    }
  }, [hash])


  //console.log("******response", response);
  return response ? response : { plans: null };
};