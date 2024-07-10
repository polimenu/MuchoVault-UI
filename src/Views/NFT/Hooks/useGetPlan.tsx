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
import { useContext, useState } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IBadge, IPlan } from '../badgeAtom';

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
      {
        address: address,
        abi: NFTAbi,
        functionName: 'activeBalanceOf',
        args: [queryAccount],
        chainId: activeChain.id,
        map: "activeBalanceOf"
      }
    ]);
  }


  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });

  const parsePrice = (price: { amount: string, token: string }) => {
    const tokenData = VALID_TOKENS[price.token];
    //console.log("tokenData", tokenData);
    return {
      amount: Number(price.amount) / 10 ** tokenData.decimals,
      token: tokenData.symbol,
      contract: price.token,
      decimals: tokenData.decimals
    }
  }

  data = getBNtoStringCopy(data);
  //console.log("data", data);
  let res = null;
  if (data && data.length > 0) {
    res = {
      id: idNFT,
      planAttributes: {
        duration: data[0].duration / (3600 * 24),
        enabled: data[0].enabled,
        nftAddress: data[0].nftAddress,
        planName: data[0].planName
      },
      pricing: {
        subscriptionPrice: parsePrice(data[1]),
        subscriptionPublicPrice: parsePrice(data[2]),
        dateIni: new Date(data[3] * 1000),
        dateEnd: new Date(data[4] * 1000),
        dateRampIni: new Date(data[5] * 1000),
        dateRampEnd: new Date(data[6] * 1000)
      },
      userBalance: data[7]
    }
  }

  //Get token ID if user has
  const tokenIdCall = (res?.userBalance > 0) ? {
    address: address,
    abi: NFTAbi,
    functionName: 'tokenOfOwnerByIndex',
    args: [queryAccount, 0],
    chainId: activeChain.id,
    watch: true
  } : {};
  let { data: tokenId } = useContractRead(tokenIdCall);

  //Get token details if user has
  const tokenIdAttributesCall = (tokenId) ? {
    address: address,
    abi: NFTAbi,
    functionName: 'tokenIdAttributes',
    args: [tokenId],
    chainId: activeChain.id,
    watch: true
  } : {};
  let { data: tokenIdAttributes } = useContractRead(tokenIdAttributesCall);

  if (tokenIdAttributes) {
    tokenIdAttributes = getBNtoStringCopy(tokenIdAttributes);
    //console.log("tokenIdAttributes", tokenIdAttributes);
    res.tokenIdAttributes = {
      remainingDays: Math.round((tokenIdAttributes.expirationTime - (new Date()).getTime() / 1000) / (24 * 3600)),
      metaData: tokenIdAttributes.metaData,
      tokenId: tokenIdAttributes.tokenId,
      startDate: new Date(tokenIdAttributes.startTime * 1000),
      expirationDate: new Date(tokenIdAttributes.expirationTime * 1000)
    };
  }

  return res;
};