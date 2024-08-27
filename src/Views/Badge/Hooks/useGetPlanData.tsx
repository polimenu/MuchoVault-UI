import MuchoNFTReaderAbi from '../Config/Abis/MuchoNFTReader.json';
import { BADGE_CONFIG, VALID_TOKENS } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { Chain, useContractRead } from 'wagmi';
import { useContext, useState } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IPlanDetailed, IPrice } from '../badgeAtom';
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
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];
  const queryAddress = account ? account : NULL_ACCOUNT;

  const call = {
    address: badge_config.MuchoNFTReader,
    abi: MuchoNFTReaderAbi,
    functionName: 'detailedNftsById',
    args: [planIds, queryAddress],
    chainId: activeChain.id,
    watch: true,
    map: `detailedNftsById`,
  }

  let { data } = useContractRead(call);

  if (data && data.length > 0) {
    //data.indexes = indexes;
    data = getBNtoStringCopy(data);
    //console.log("DATAR**************", data);
    res = planIds.map((planId, i) => parsePlanDetailedFromContractData(data[i], planId));
  }

  return res;
}

export const parsePlanDetailedFromContractData = (data: any, planId: number): IPlanDetailed => {
  const planAttributes = data.planAttributes;
  const tokenIdAttributes = data.tokenIdAttributes
  const subscriptionPrice = data.subscriptionPrice
  const renewalPrice = data.renewalPrice
  const subscriptionPublicPrice = data.subscriptionPublicPrice
  const renewalPublicPrice = data.renewalPublicPrice
  const subscriptionPricing = data.subscriptionPricingAttributes
  const renewalPricing = data.renewalPricingAttributes
  //console.log("Parsing data", data);
  const res = {
    id: planId,
    planAttributes: {
      duration: planAttributes ? planAttributes.duration / (3600 * 24) : 0,
      enabled: planAttributes && planAttributes.enabled,
      nftAddress: data.nft,
      planName: planAttributes ? planAttributes.planName : "",
      supply: data.totalSupply
    },
    pricing: {
      contract: data.subPricing,
      userPrice: parsePrice(subscriptionPrice, subscriptionPrice.token),
      publicPrice: parsePrice(subscriptionPublicPrice, subscriptionPublicPrice.token),
      dateIni: new Date(subscriptionPricing.dateIni * 1000),
      dateEnd: new Date(subscriptionPricing.dateEnd * 1000),
      dateRampIni: new Date(subscriptionPricing.dateRampIni * 1000),
      dateRampEnd: new Date(subscriptionPricing.dateRampEnd * 1000),
      priceRampIni: subscriptionPricing.priceRampIni,
      priceRampEnd: subscriptionPricing.priceRampEnd
    },
    renewalPricing: {
      contract: data.renPricing,
      userPrice: parsePrice(renewalPrice, renewalPrice.token),
      publicPrice: parsePrice(renewalPublicPrice, renewalPublicPrice.token),
      dateIni: new Date(renewalPricing.dateIni * 1000),
      dateEnd: new Date(renewalPricing.dateEnd * 1000),
      dateRampIni: new Date(renewalPricing.dateRampIni * 1000),
      dateRampEnd: new Date(renewalPricing.dateRampEnd * 1000),
      priceRampIni: renewalPricing.priceRampIni,
      priceRampEnd: renewalPricing.priceRampEnd
    },
    userBalance: data.userBalance,
    tokenIdAttributes: {
      remainingDays: tokenIdAttributes ? Math.round((tokenIdAttributes.expirationTime - (new Date()).getTime() / 1000) / (24 * 3600)) : 0,
      metaData: tokenIdAttributes ? tokenIdAttributes.metaData : "",
      tokenId: data.tokenId,
      startTime: tokenIdAttributes ? new Date(tokenIdAttributes.startTime * 1000) : (new Date(0)),
      expirationTime: tokenIdAttributes ? new Date(tokenIdAttributes.expirationTime * 1000) : (new Date(0))
    }
  }

  //Apply decimals to prices
  res.pricing.priceRampIni /= 10 ** res.pricing.userPrice.decimals;
  res.pricing.priceRampEnd /= 10 ** res.pricing.userPrice.decimals;
  res.renewalPricing.priceRampIni /= 10 ** res.renewalPricing.userPrice.decimals;
  res.renewalPricing.priceRampEnd /= 10 ** res.renewalPricing.userPrice.decimals;

  //console.log("**********RES**********", res);
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
  const tokenData = getTokenData(price.token);
  //console.log("tokenData", tokenData);
  return {
    amount: Number(price.amount) / 10 ** tokenData.decimals,
    token: tokenData.symbol,
    contract: price.token,
    decimals: tokenData.decimals
  }
}

const getTokenData = (address: string) => {
  const tokenData = VALID_TOKENS[address];
  if (!tokenData) {
    return {
      contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      symbol: "USDC",
      decimals: 6
    }
  }
  return tokenData;
}