import FetcherAbi from '../Config/Abis/MuchoNFTFetcher.json';
import NFTAbi from '../Config/Abis/MuchoNFT.json';
import PricingAbi from '../Config/Abis/MuchoPricing.json';
import ERC20ExtAbi from '../Config/Abis/ERC20Ext.json';
import { BADGE_CONFIG, BLACKLISTED_NFT, VALID_TOKENS } from '../Config/BadgeConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractRead, useContractReads } from 'wagmi';
import { BadgeContext } from '../sale';
import { useContext, useEffect, useState } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IBadge, IPlan } from '../badgeAtom';
import { getDataNumber, getDataString } from '@Views/Index/Hooks/useCommonUtils';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetNFTAddressesById = (idNFT: number) => {
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];

  const calls = [
    {
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: 'nftById',
      args: [idNFT],
      chainId: activeChain.id,
    },
    {
      address: badge_config.MuchoNFTFetcher,
      abi: FetcherAbi,
      functionName: 'nftPricing',
      args: [idNFT],
      chainId: activeChain.id,
      map: "nftPricing"
    }
  ];

  let { data } = useContractReads({ contracts: calls, watch: true });

  //console.log("dataContract", data);
  if (data) {
    return { nftAddress: data[0], pricingAddress: data[1] };
  }

  return { nftAddress: null, pricingAddress: null };
}

export const useGetNFTPlanForSalePage = (address: string, idNFT: number, pricingAddress: string) => {
  const NULL_ACCOUNT = "0x0000000000000000000000000000000000000000";
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    activeChain = badgeContextValue.activeChain;
  }
  //console.log("activeChain", activeChain);
  //console.log("address", address);
  //console.log("abi", NFTAbi);
  // const { state } = useGlobal();
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];
  const queryAccount = account ?? NULL_ACCOUNT;
  const [tokenId, setTokenId] = useState(0);
  const [balance, setBalance] = useState(0);
  //console.log("queryAccount", queryAccount);

  let calls = [];
  if (address && pricingAddress) {
    calls = calls.concat([
      {
        address: address,
        abi: NFTAbi,
        functionName: 'planAttributes',
        args: [],
        chainId: activeChain.id,
        map: "planAttributes"
      },
      {
        address: badge_config.MuchoNFTFetcher,
        abi: FetcherAbi,
        functionName: 'subscriptionPrice',
        args: [idNFT, queryAccount],
        chainId: activeChain.id,
        map: "subscriptionPrice"
      },
      {
        address: badge_config.MuchoNFTFetcher,
        abi: FetcherAbi,
        functionName: 'subscriptionPrice',
        args: [idNFT, NULL_ACCOUNT],
        chainId: activeChain.id,
        map: "subscriptionPublicPrice"
      },
      {
        address: badge_config.MuchoNFTFetcher,
        abi: FetcherAbi,
        functionName: 'renewalPrice',
        args: [idNFT, queryAccount],
        chainId: activeChain.id,
        map: "renewalPrice"
      },
      {
        address: badge_config.MuchoNFTFetcher,
        abi: FetcherAbi,
        functionName: 'renewalPrice',
        args: [idNFT, NULL_ACCOUNT],
        chainId: activeChain.id,
        map: "renewalPublicPrice"
      },
      {
        address: pricingAddress,
        abi: PricingAbi,
        functionName: 'dateIni',
        args: [],
        chainId: activeChain.id,
        map: "dateIni"
      },
      {
        address: pricingAddress,
        abi: PricingAbi,
        functionName: 'dateEnd',
        args: [],
        chainId: activeChain.id,
        map: "dateEnd"
      },
      {
        address: pricingAddress,
        abi: PricingAbi,
        functionName: 'dateRampIni',
        args: [],
        chainId: activeChain.id,
        map: "dateRampIni"
      },
      {
        address: pricingAddress,
        abi: PricingAbi,
        functionName: 'dateRampEnd',
        args: [],
        chainId: activeChain.id,
        map: "dateRampEnd"
      },

    ]);

    if (account) {
      calls.push({
        address: address,
        abi: NFTAbi,
        functionName: 'activeBalanceOf',
        args: [queryAccount],
        chainId: activeChain.id,
        map: "activeBalanceOf"
      });
    }

    //Get token ID if user has
    if (balance > 0) {
      calls.push({
        address: address,
        abi: NFTAbi,
        functionName: 'tokenOfOwnerByIndex',
        args: [queryAccount, 0],
        chainId: activeChain.id,
        map: 'tokenOfOwnerByIndex',
      });
    }

    //Get token details if user has
    if (tokenId > 0) {
      calls.push({
        address: address,
        abi: NFTAbi,
        functionName: 'tokenIdAttributes',
        args: [tokenId],
        chainId: activeChain.id,
        map: 'tokenIdAttributes',
      });
    }

  }


  let indexes: any = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });
  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });

  data = getBNtoStringCopy(data);
  //console.log("calls", calls);
  //console.log("data", data);
  let res = null;
  if (data && data.length > 5) {
    data.indexes = indexes;
    const planAttributes = getDataString(data, "planAttributes");
    const tokenIdAttributes = getDataString(data, 'tokenIdAttributes');
    res = {
      id: idNFT,
      planAttributes: {
        duration: planAttributes.duration / (3600 * 24),
        enabled: planAttributes.enabled,
        nftAddress: planAttributes.nftAddress,
        planName: planAttributes.planName
      },
      pricing: {
        subscriptionPrice: parsePrice(getDataNumber(data, "subscriptionPrice")),
        subscriptionPublicPrice: parsePrice(getDataNumber(data, "subscriptionPublicPrice")),
        renewalPrice: parsePrice(getDataNumber(data, "renewalPrice")),
        renewalPublicPrice: parsePrice(getDataNumber(data, "renewalPublicPrice")),
        dateIni: new Date(getDataNumber(data, "dateIni") * 1000),
        dateEnd: new Date(getDataNumber(data, "dateEnd") * 1000),
        dateRampIni: new Date(getDataNumber(data, "dateRampIni") * 1000),
        dateRampEnd: new Date(getDataNumber(data, "dateRampEnd") * 1000)
      },
      userBalance: getDataNumber(data, "activeBalanceOf"),
      tokenIdAttributes: {
        remainingDays: tokenIdAttributes ? Math.round((tokenIdAttributes.expirationTime - (new Date()).getTime() / 1000) / (24 * 3600)) : 0,
        metaData: tokenIdAttributes ? tokenIdAttributes.metaData : "",
        tokenId: getDataNumber(data, "tokenOfOwnerByIndex"),
        startDate: tokenIdAttributes ? new Date(tokenIdAttributes.startTime * 1000) : (new Date(0)),
        expirationDate: tokenIdAttributes ? new Date(tokenIdAttributes.expirationTime * 1000) : (new Date(0))
      }
    }
  }

  useEffect(() => {
    if (res && res.userBalance && res.userBalance > 0) {
      setBalance(res.userBalance);
    }
  }, [res ? res.userBalance : null])

  useEffect(() => {
    if (res && res.tokenIdAttributes && res && res.tokenIdAttributes.tokenId > 0) {
      setTokenId(res.tokenIdAttributes.tokenId);
    }
  }, [res && res.tokenIdAttributes ? res.tokenIdAttributes.tokenId : null])

  return res;
}


const parsePrice = (price: { amount: string, token: string }) => {
  if (!price) {
    return {
      amount: 10000,
      token: "USDC",
      contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6
    }
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