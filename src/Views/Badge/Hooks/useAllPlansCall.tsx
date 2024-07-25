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
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IBadge } from '../badgeAtom';

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
    abi: MuchoNFTFetcherAbi,
    functionName: 'allPlans',
    chainId: activeChain.id,
  }

  let calls = [allPlansCall];
  const nftIds = [];

  if (account) {
    calls = calls.concat([{
      address: badge_config.MuchoNFTFetcher,
      abi: MuchoNFTFetcherAbi,
      functionName: 'activePlansForUser',
      chainId: activeChain.id,
      args: [account],
    }]);

  }

  //console.log("Calls"); console.log(calls);

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result plans", data);

  let response = {};

  if (data && data[0]) {

    //console.log("test"); console.log(tokenMap(tokens[0]));
    //console.log("DATA!", data);

    let resObject: IBadge = {};
    resObject.plans = [];

    const plans = data[0].filter(p => BLACKLISTED_NFT.indexOf(Number(p.id)) < 0);

    for (const plan of plans) {
      nftIds.push(plan.id);

      //console.log("Checking plan " + plans);
      //console.log(data[1].filter(p => p.id == plan.id));
      //console.log(data[2].filter(p => p.id == plan.id));
      const activeSubscription = Boolean(data[1] && (data[1].filter(p => p.id == plan.id).length > 0));
      const enabledSubscription = plan.enabled;

      if (admin || enabledSubscription) {
        resObject.plans.push({
          address: plan.nftAddress,
          id: plan.id,
          name: plan.planName,
          uri: "",
          subscribers: 0,
          subscriptionPrice: {
            token: "",
            amount: 0,
            contract: "",
            decimals: 0
          },
          renewalPrice: {
            token: "",
            amount: 0,
            contract: "",
            decimals: 0
          },
          time: plan.duration / (24 * 3600),
          exists: true,
          enabled: plan.enabled,
          status: plan.enabled ? "Enabled" : "Disabled",
          isActiveForCurrentUser: activeSubscription,
          subscriptionPricing: {
            contract: "",
            dateIni: new Date(),
            dateEnd: new Date(),
            dateRampIni: new Date(),
            dateRampEnd: new Date(),
            priceRampIni: 0,
            priceRampEnd: 0,
            token: "",
            tokenDecimals: 0,
            tokenSymbol: ""
          },
          renewalPricing: {
            contract: "",
            dateIni: new Date(),
            dateEnd: new Date(),
            dateRampIni: new Date(),
            dateRampEnd: new Date(),
            priceRampIni: 0,
            priceRampEnd: 0,
            token: "",
            tokenDecimals: 0,
            tokenSymbol: ""
          }
        });
      }
    }

    //console.log("nftIds", nftIds);

    // FORMATTING
    response = resObject;


  }

  //Supply
  const supplyCalls = response.plans ? response.plans.map(p => {
    return {
      address: p.address,
      abi: MuchoNFTAbi,
      functionName: 'totalSupply',
      chainId: activeChain.id,
    }
  }) : [];
  let { data: supplyData } = useContractReads({
    contracts: supplyCalls,
    watch: true,
  });
  supplyData = getBNtoStringCopy(supplyData);
  if (supplyData && supplyData[0]) {
    for (const i in supplyData) {
      response.plans[i].subscribers = supplyData[i];
    }
  }

  //Pricings address
  const subPricingCalls = response.plans ? response.plans.map(p => {
    return {
      address: badge_config.MuchoNFTFetcher,
      abi: MuchoNFTFetcherAbi,
      functionName: 'nftPricing',
      chainId: activeChain.id,
      args: [p.id]
    }
  }) : [];
  const { data: subPricingData } = useContractReads({
    contracts: subPricingCalls,
    watch: true,
  });
  //console.log("subPricingData", subPricingData);
  if (subPricingData && subPricingData[0]) {
    for (const i in subPricingData) {
      response.plans[i].subscriptionPricing.contract = subPricingData[i];
    }
  }

  const renPricingCalls = response.plans ? response.plans.map(p => {
    return {
      address: badge_config.MuchoNFTFetcher,
      abi: MuchoNFTFetcherAbi,
      functionName: 'nftRenewalPricing',
      chainId: activeChain.id,
      args: [p.id]
    }
  }) : [];
  const { data: renPricingData } = useContractReads({
    contracts: renPricingCalls,
    watch: true,
  });
  if (renPricingData && renPricingData[0]) {
    for (const i in renPricingData) {
      response.plans[i].renewalPricing.contract = renPricingData[i];
    }
  }

  //Pricings data
  const PRICING_FIELDS = ['dateIni', 'dateEnd', 'dateRampIni', 'dateRampEnd', 'priceRampIni', 'priceRampEnd', 'token'];
  const subPricingDataCalls = response.plans ? response.plans.map(p => {
    if (!p.subscriptionPricing.contract || p.subscriptionPricing.contract === "0x0000000000000000000000000000000000000000") {
      return {};
    }
    return PRICING_FIELDS.map(c => {
      return {
        address: p.subscriptionPricing.contract,
        abi: MuchoPricingAbi,
        functionName: c,
        chainId: activeChain.id,
      }
    });
  }).flat() : [];
  const { data: subPricingFullData } = useContractReads({
    contracts: subPricingDataCalls,
    watch: true,
  });
  //console.log("subPricingData", subPricingData);
  if (subPricingFullData && subPricingFullData[0]) {
    for (const i in subPricingFullData) {
      const field = PRICING_FIELDS[Number(i) % PRICING_FIELDS.length];
      response.plans[Math.floor(i / PRICING_FIELDS.length)].subscriptionPricing[field] = field.indexOf("date") >= 0 ? new Date(1000 * subPricingFullData[i]) : subPricingFullData[i];
    }

    //token symbol and decimals
    for (const p of response.plans) {
      if (p.subscriptionPricing.token) {
        p.subscriptionPricing.tokenSymbol = VALID_TOKENS[p.subscriptionPricing.token].symbol;
        p.subscriptionPricing.tokenDecimals = VALID_TOKENS[p.subscriptionPricing.token].decimals;
        p.subscriptionPricing.priceRampIni = Number(p.subscriptionPricing.priceRampIni) / 10 ** p.subscriptionPricing.tokenDecimals;
        p.subscriptionPricing.priceRampEnd = Number(p.subscriptionPricing.priceRampEnd) / 10 ** p.subscriptionPricing.tokenDecimals;
      }
    }
  }

  const renPricingDataCalls = response.plans ? response.plans.map(p => {
    if (!p.renewalPricing.contract || p.renewalPricing.contract === "0x0000000000000000000000000000000000000000") {
      return {};
    }
    return PRICING_FIELDS.map(c => {
      return {
        address: p.renewalPricing.contract,
        abi: MuchoPricingAbi,
        functionName: c,
        chainId: activeChain.id,
      }
    });
  }).flat() : [];
  const { data: renPricingFullData } = useContractReads({
    contracts: renPricingDataCalls,
    watch: true,
  });
  //console.log("renPricingData", renPricingData);
  if (renPricingFullData && renPricingFullData[0]) {
    for (const i in renPricingFullData) {
      const field = PRICING_FIELDS[Number(i) % PRICING_FIELDS.length];
      response.plans[Math.floor(i / PRICING_FIELDS.length)].renewalPricing[field] = field.indexOf("date") >= 0 ? new Date(1000 * renPricingFullData[i]) : renPricingFullData[i];
    }

    //token symbol and decimals
    for (const p of response.plans) {
      if (p.renewalPricing.token) {
        p.renewalPricing.tokenSymbol = VALID_TOKENS[p.renewalPricing.token].symbol;
        p.renewalPricing.tokenDecimals = VALID_TOKENS[p.renewalPricing.token].decimals;
        p.renewalPricing.priceRampIni = Number(p.renewalPricing.priceRampIni) / 10 ** p.renewalPricing.tokenDecimals;
        p.renewalPricing.priceRampEnd = Number(p.renewalPricing.priceRampEnd) / 10 ** p.renewalPricing.tokenDecimals;
      }
    }
  }


  //Price data
  const priceAccount = account ?? "0x0000000000000000000000000000000000000000";
  const subPriceCalls = nftIds ? nftIds.map(n => {
    return {
      address: badge_config.MuchoNFTFetcher,
      abi: MuchoNFTFetcherAbi,
      functionName: 'subscriptionPrice',
      chainId: activeChain.id,
      args: [n, priceAccount],
    }
  }) : [];

  let { data: subPriceData } = useContractReads({
    contracts: subPriceCalls,
    watch: true,
  });
  subPriceData = getBNtoStringCopy(subPriceData);
  //console.log("subPricingData", subPricingData);
  if (subPriceData && subPriceData[0]) {
    for (const iPri in subPriceData) {
      const amount = subPriceData[iPri].amount;
      const decimals = VALID_TOKENS[subPriceData[iPri].token].decimals;
      response.plans[iPri].subscriptionPrice = {
        token: VALID_TOKENS[subPriceData[iPri].token].symbol,
        amount: amount / 10 ** decimals,
        contract: VALID_TOKENS[subPriceData[iPri].token].contract,
        decimals: decimals
      }
    }

    //console.log("-------Plans after subs pricing------", plans);
  }

  const renPriceCalls = nftIds ? nftIds.map(n => {
    return {
      address: badge_config.MuchoNFTFetcher,
      abi: MuchoNFTFetcherAbi,
      functionName: 'renewalPrice',
      chainId: activeChain.id,
      args: [n, priceAccount],
    }
  }) : [];

  let { data: renPriceData } = useContractReads({
    contracts: renPriceCalls,
    watch: true,
  });
  renPriceData = getBNtoStringCopy(renPriceData);
  //console.log("renPricingData", renPricingData);
  if (renPriceData && renPriceData[0]) {
    for (const iPri in renPriceData) {
      const amount = renPriceData[iPri].amount;
      const decimals = VALID_TOKENS[renPriceData[iPri].token].decimals;
      response.plans[iPri].renewalPrice = {
        token: VALID_TOKENS[renPriceData[iPri].token].symbol,
        amount: amount / 10 ** decimals,
        contract: VALID_TOKENS[renPriceData[iPri].token].contract,
        decimals: decimals
      }
    }

    //console.log("-------Plans after rens pricing------", plans);
  }

  //console.log("Formatting done!");
  //console.log("******response", response);

  return response ? response : { plans: null };
};