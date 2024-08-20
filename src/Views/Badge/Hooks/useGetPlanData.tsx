import FetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import NFTAbi from '../Config/Abis/MuchoNFT.json';
import PricingAbi from '../Config/Abis/MuchoPricing.json';
import { BADGE_CONFIG, VALID_TOKENS } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { Chain, useContractReads } from 'wagmi';
import { useContext, useEffect, useState } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getDataNumber, getDataString } from '@Views/Index/Hooks/useCommonUtils';
import { IPlanDetailed, IPrice } from '../badgeAtom';
import { IContractReadsCall } from '@Views/Common/CommonInterfaces';
import { BadgeContext } from '..';
import { NULL_ACCOUNT } from '@Views/Common/Utils';



export const useGetPlansDetailed = (planIds: number[]): IPlanDetailed[] => {
  let res: IPlanDetailed[] = [];
  const [plans, setPlans] = useState<IPlanDetailed[]>([]);

  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }

  const { address: account } = useUserAccount();

  //console.log("planIds", planIds);
  //console.log("Building calls with res", res);
  const calls = planIds.map((planId, i) => {

    const plan = plans.find(p => p.id == planId);

    return getPlanDetailedCalls(planId, plan, { account, chainId: activeChain.id });
  }).flat();


  //console.log("Calling calls", calls.length);
  let indexes: any = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });
  //console.log("··················CALLS···················", calls, indexes);
  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);


  if (data && data.length > 0) {
    data.indexes = indexes;
    res = planIds.map(planId => parsePlanDetailedFromContractData(data, planId));
  }


  useEffect(() => {
    setPlans(res);
  }, [JSON.stringify(res)])

  return res;
}

export const parsePlanDetailedFromContractData = (data: any, planId: number): IPlanDetailed => {
  const planAttributes = getDataString(data, `planAttributes_${planId}`);
  const tokenIdAttributes = getDataString(data, `tokenIdAttributes_${planId}`);
  //console.log("Parsing data", data);
  const res = {
    id: planId,
    planAttributes: {
      duration: planAttributes ? planAttributes.duration / (3600 * 24) : 0,
      enabled: planAttributes && planAttributes.enabled,
      nftAddress: getDataString(data, `nftById_${planId}`),
      planName: planAttributes ? planAttributes.planName : "",
      supply: getDataNumber(data, `totalSupply_${planId}`)
    },
    pricing: {
      contract: getDataString(data, `nftPricing_${planId}`),
      userPrice: parsePrice(getDataNumber(data, `subscriptionPrice_${planId}`), getDataString(data, `subToken_${planId}`)),
      publicPrice: parsePrice(getDataNumber(data, `subscriptionPublicPrice_${planId}`), getDataString(data, `subToken_${planId}`)),
      dateIni: new Date(getDataNumber(data, `subDateIni_${planId}`) * 1000),
      dateEnd: new Date(getDataNumber(data, `subDateEnd_${planId}`) * 1000),
      dateRampIni: new Date(getDataNumber(data, `subDateRampIni_${planId}`) * 1000),
      dateRampEnd: new Date(getDataNumber(data, `subDateRampEnd_${planId}`) * 1000),
      priceRampIni: getDataNumber(data, `subPriceRampIni_${planId}`),
      priceRampEnd: getDataNumber(data, `subPriceRampEnd_${planId}`)
    },
    renewalPricing: {
      contract: getDataString(data, `renNftPricing_${planId}`),
      userPrice: parsePrice(getDataNumber(data, `renewalPrice_${planId}`), getDataString(data, `renToken_${planId}`)),
      publicPrice: parsePrice(getDataNumber(data, `renewalPublicPrice_${planId}`), getDataString(data, `renToken_${planId}`)),
      dateIni: new Date(getDataNumber(data, `renDateIni_${planId}`) * 1000),
      dateEnd: new Date(getDataNumber(data, `renDateEnd_${planId}`) * 1000),
      dateRampIni: new Date(getDataNumber(data, `renDateRampIni_${planId}`) * 1000),
      dateRampEnd: new Date(getDataNumber(data, `renDateRampEnd_${planId}`) * 1000),
      priceRampIni: getDataNumber(data, `renPriceRampIni_${planId}`),
      priceRampEnd: getDataNumber(data, `renPriceRampEnd_${planId}`)
    },
    userBalance: getDataNumber(data, `activeBalanceOf_${planId}`),
    tokenIdAttributes: {
      remainingDays: tokenIdAttributes ? Math.round((tokenIdAttributes.expirationTime - (new Date()).getTime() / 1000) / (24 * 3600)) : 0,
      metaData: tokenIdAttributes ? tokenIdAttributes.metaData : "",
      tokenId: getDataNumber(data, `tokenOfOwnerByIndex_${planId}`),
      startTime: tokenIdAttributes ? new Date(tokenIdAttributes.startTime * 1000) : (new Date(0)),
      expirationTime: tokenIdAttributes ? new Date(tokenIdAttributes.expirationTime * 1000) : (new Date(0))
    }
  }

  //Apply decimals to prices
  res.pricing.priceRampIni /= 10 ** res.pricing.userPrice.decimals;
  res.pricing.priceRampEnd /= 10 ** res.pricing.userPrice.decimals;
  res.renewalPricing.priceRampIni /= 10 ** res.renewalPricing.userPrice.decimals;
  res.renewalPricing.priceRampEnd /= 10 ** res.renewalPricing.userPrice.decimals;

  return res;
}


const parsePrice = (price: { amount: string, token: string }, priceToken: string): IPrice => {
  if (!price) {
    const res = {
      amount: 0,
      token: VALID_TOKENS[priceToken] ? VALID_TOKENS[priceToken].symbol : "USDC",
      contract: VALID_TOKENS[priceToken] ? VALID_TOKENS[priceToken].contract : "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: VALID_TOKENS[priceToken] ? VALID_TOKENS[priceToken].decimals : 6
    }
    //console.log("RETURNING GENERIC PRICING TOKEN", priceToken, res);
    return res;
  }
  const tokenData = VALID_TOKENS[price.token];
  //console.log("tokenData", tokenData);
  return {
    amount: Number(price.amount) / 10 ** tokenData.decimals,
    token: tokenData.symbol,
    contract: price.token,
    decimals: tokenData.decimals
  }
}

export const getPlanDetailedCalls = (planId: number, plan: IPlanDetailed | undefined,
  callAttributes: { account?: string, chainId: number }): IContractReadsCall[] => {

  const { account } = callAttributes;
  const NOW = new Date();

  let calls: IContractReadsCall[] = PlanIdCalls(planId, account, callAttributes.chainId);

  if (plan) {

    if (plan.planAttributes && plan.planAttributes.nftAddress) {
      calls = calls.concat(PlanAttributesCalls(planId, callAttributes.chainId, plan.planAttributes.nftAddress));

      if (account) {
        calls = calls.concat(AccountCalls(plan.planAttributes.nftAddress, account, planId, callAttributes.chainId));

        if (plan.userBalance > 0) {
          calls = calls.concat(GetTokenIdCalls(plan.planAttributes.nftAddress, account, planId, callAttributes.chainId));
        }
      }

      if (plan.tokenIdAttributes && plan.tokenIdAttributes.tokenId > 0) {
        calls = calls.concat(TokenAttributesCalls(plan.planAttributes.nftAddress, callAttributes.chainId, planId, plan.tokenIdAttributes.tokenId));
      }
    }

    if (plan.pricing && plan.pricing.contract && plan.pricing.contract != NULL_ACCOUNT) {


      calls = calls.concat(PricingCalls(plan.pricing.contract, callAttributes.chainId, planId, "sub"));

      if (account && plan.pricing.dateEnd > NOW && plan.pricing.dateIni <= NOW) {
        console.log("Looking for subscription price", planId, plan.pricing.dateIni, plan.pricing.dateEnd, NOW)
        calls = calls.concat(PriceCalls(planId, callAttributes.chainId, account, "subscription"));
      }
    }

    if (plan.renewalPricing && plan.renewalPricing.contract && plan.renewalPricing.contract != NULL_ACCOUNT) {
      calls = calls.concat(PricingCalls(plan.renewalPricing.contract, callAttributes.chainId, planId, "ren"));
      if (account && plan.renewalPricing.dateEnd > NOW && plan.renewalPricing.dateIni <= NOW) {
        calls = calls.concat(PriceCalls(planId, callAttributes.chainId, account, "renewal"));
      }
    }


  }

  return calls;
}


const PricingCalls = (address: string, chainId: number, planId: number, type: "sub" | "ren") => {

  return [
    {
      address: address,
      abi: PricingAbi,
      functionName: 'dateIni',
      args: [],
      chainId: chainId,
      map: `${type}DateIni_${planId}`
    },
    {
      address: address,
      abi: PricingAbi,
      functionName: 'dateEnd',
      args: [],
      chainId: chainId,
      map: `${type}DateEnd_${planId}`
    },
    {
      address: address,
      abi: PricingAbi,
      functionName: 'dateRampIni',
      args: [],
      chainId: chainId,
      map: `${type}DateRampIni_${planId}`
    },
    {
      address: address,
      abi: PricingAbi,
      functionName: 'dateRampEnd',
      args: [],
      chainId: chainId,
      map: `${type}DateRampEnd_${planId}`
    },
    {
      address: address,
      abi: PricingAbi,
      functionName: 'priceRampIni',
      args: [],
      chainId: chainId,
      map: `${type}PriceRampIni_${planId}`
    },
    {
      address: address,
      abi: PricingAbi,
      functionName: 'priceRampEnd',
      args: [],
      chainId: chainId,
      map: `${type}PriceRampEnd_${planId}`
    },
    {
      address: address,
      abi: PricingAbi,
      functionName: 'token',
      args: [],
      chainId: chainId,
      map: `${type}Token_${planId}`
    },
  ];
}

const PlanIdCalls = (planId: number, account: string | undefined, chainId: number) => {
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[chainId];

  return [
    {
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: `nftById`,
      args: [planId],
      chainId: chainId,
      map: `nftById_${planId}`,
    },
    {
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: `nftPricing`,
      args: [planId],
      chainId: chainId,
      map: `nftPricing_${planId}`,
    },
    {
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: `nftRenewalPricing`,
      args: [planId],
      chainId: chainId,
      map: `renNftPricing_${planId}`,
    },
  ];
}

const PriceCalls = (planId: number, chainId: number, account: string, type: "renewal" | "subscription") => {
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[chainId];
  const queryAccount = account ?? NULL_ACCOUNT;

  return [
    {
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: `${type}Price`,
      args: [planId, queryAccount],
      chainId: chainId,
      map: `${type}Price_${planId}`
    },
    {
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: `${type}Price`,
      args: [planId, NULL_ACCOUNT],
      chainId: chainId,
      map: `${type}PublicPrice_${planId}`
    },
  ]
}

const PlanAttributesCalls = (planId: number, chainId: number, nftAddress: string) => {
  return [
    {
      address: nftAddress,
      abi: NFTAbi,
      functionName: 'planAttributes',
      args: [],
      chainId: chainId,
      map: `planAttributes_${planId}`
    },
    {
      address: nftAddress,
      abi: NFTAbi,
      functionName: 'totalSupply',
      args: [],
      chainId: chainId,
      map: `totalSupply_${planId}`
    }
  ]
}

const AccountCalls = (nftAddress: string, account: string, planId: number, chainId: number) => {

  return [{
    address: nftAddress,
    abi: NFTAbi,
    functionName: 'activeBalanceOf',
    args: [account],
    chainId: chainId,
    map: `activeBalanceOf_${planId}`
  }];
}

const GetTokenIdCalls = (nftAddress: string, account: string, planId: number, chainId: number) => {

  return [{
    address: nftAddress,
    abi: NFTAbi,
    functionName: 'tokenOfOwnerByIndex',
    args: [account, 0],
    chainId: chainId,
    map: `tokenOfOwnerByIndex_${planId}`,
  }];
}

const TokenAttributesCalls = (nftAddress: string, chainId: number, planId: number, tokenId: number) => {

  return [{
    address: nftAddress,
    abi: NFTAbi,
    functionName: 'tokenIdAttributes',
    args: [tokenId],
    chainId: chainId,
    map: `tokenIdAttributes_${planId}`,
  }]
}