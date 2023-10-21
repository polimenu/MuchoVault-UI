import MuchoProtocolGmxAbi from '../Config/Abis/MuchoProtocolGmx.json';
import ERC20Abi from '../Config/Abis/ERC20Ext.json';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IMuchoProtocolGmxData, IMuchoVaultData } from '../v2AdminAtom';
import { imTokenWallet } from '@rainbow-me/rainbowkit/dist/wallets/walletConnectors';
import { getDataNumber, getDataString, getERC20Token, getERC20TokenCalls } from './useCommonUtils';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetMuchoProtocolGmxData = () => {
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const v2AdminConfig: (typeof V2ADMIN_CONFIG)[42161] = V2ADMIN_CONFIG[activeChain.id];


  const muchoGmxParameterCalls = ['protocolName', 'protocolDescription', 'glpApr', 'glpWethMintFee'
    , 'slippage', 'earningsAddress', 'claimEsGmx', 'minNotInvestedPercentage'
    , 'desiredNotInvestedPercentage', 'minBasisPointsMove', 'maxRefreshWeightLapse'
    , 'manualModeWeights', 'rewardSplit', 'compoundProtocol'].map(f => {
      return {
        address: v2AdminConfig.MuchoProtocolGmx.contract,
        abi: MuchoProtocolGmxAbi,
        functionName: f,
        chainId: activeChain?.id,
        map: f
      }
    });


  let tokenCalls = [];
  v2AdminConfig.TokenDictionary.forEach(t => tokenCalls = tokenCalls.concat(getERC20TokenCalls(t)));

  let mainTokenCalls = []
  v2AdminConfig.MuchoProtocolGmx.tokens.forEach(t => {
    mainTokenCalls = mainTokenCalls.concat(['getSecondaryTokens', 'getTokenStaked', 'getTokenInvested', 'getTokenNotInvested', 'getTokenWeight', 'glpWeight'].map(f => {
      return {
        address: v2AdminConfig.MuchoProtocolGmx.contract,
        abi: MuchoProtocolGmxAbi,
        functionName: f,
        args: [t],
        chainId: activeChain?.id,
        map: `${f}_${t}`
      }
    }));
  }
  );

  const muchoGmxContractCalls = ['EsGMX', 'fsGLP', 'WETH', 'glpRouter', 'glpRewardRouter',
    'poolGLP', 'glpVault', 'muchoRewardRouter', 'priceFeed', 'getTotalUSD', 'getTotalUSDBacked'].map(f => {
      return {
        address: v2AdminConfig.MuchoProtocolGmx.contract,
        abi: MuchoProtocolGmxAbi,
        functionName: f,
        chainId: activeChain?.id,
        map: f
      }
    });

  const muchoGmxTokensCall = {
    address: v2AdminConfig.MuchoProtocolGmx.contract,
    abi: MuchoProtocolGmxAbi,
    functionName: 'getTokens',
    chainId: activeChain?.id,
    map: 'getTokens',
  }


  const calls = [...tokenCalls, ...mainTokenCalls, ...muchoGmxParameterCalls, ...muchoGmxContractCalls, muchoGmxTokensCall];
  let indexes = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });

  //console.log("Calls", calls);
  //console.log("indexes", indexes);

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result contracts", data);

  let responseMP: IMuchoProtocolGmxData;
  //return response;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    //console.log("Index", indexes);
    data.indexes = indexes;

    responseMP = {
      contract: v2AdminConfig.MuchoProtocolGmx.contract,
      protocolName: getDataString(data, 'protocolName'),
      protocolDescription: getDataString(data, 'protocolDescription'),

      totalUSDStaked: getDataNumber(data, 'getTotalUSD') / 10 ** 18,
      totalUSDBacked: getDataNumber(data, 'getTotalUSDBacked') / 10 ** 18,

      glpApr: getDataNumber(data, 'glpApr') / 100,
      glpWethMintFee: getDataNumber(data, 'glpWethMintFee') / 100,
      slippage: getDataNumber(data, 'slippage') / 1000,
      earningsAddress: getDataString(data, 'earningsAddress'),
      claimEsGmx: Boolean(getDataString(data, 'claimEsGmx')),

      minNotInvestedPercentage: getDataNumber(data, 'minNotInvestedPercentage') / 100,
      desiredNotInvestedPercentage: getDataNumber(data, 'desiredNotInvestedPercentage') / 100,
      minBasisPointsMove: getDataNumber(data, 'minBasisPointsMove') / 100,
      maxRefreshWeightLapse: getDataNumber(data, 'maxRefreshWeightLapse') / 3600,
      manualModeWeights: Boolean(getDataString(data, 'manualModeWeights')),
      rewardSplit: {
        ownerPercentage: getDataString(data, 'rewardSplit').ownerPercentage / 100,
        NftPercentage: getDataString(data, 'rewardSplit').NftPercentage / 100,
      },
      compoundProtocol: getDataString(data, 'compoundProtocol'),

      contracts: {
        EsGMX: getDataString(data, 'EsGMX'),
        fsGLP: getDataString(data, 'fsGLP'),
        WETH: getDataString(data, 'WETH'),
        glpRouter: getDataString(data, 'glpRouter'),
        glpRewardRouter: getDataString(data, 'glpRewardRouter'),
        poolGLP: getDataString(data, 'poolGLP'),
        glpVault: getDataString(data, 'glpVault'),
        muchoRewardRouter: getDataString(data, 'muchoRewardRouter'),
        priceFeed: getDataString(data, 'priceFeed'),
      },

      tokenInfo: getTokensInfo(data, getDataString(data, 'getTokens')),
    };



  }

  //console.log("Response RPC", responseMP);
  return responseMP ? responseMP : null;
};

const getTokensInfo = (data: any, tokens: string[]) => {

  return tokens.map(t => {
    const secT = getSecondaryTokens(data, getDataString(data, `getSecondaryTokens_${t}`));

    return {
      token: { name: getDataString(data, `symbol_${t}`), contract: t, decimals: getDataNumber(data, `decimals_${t}`) },
      secondaryTokens: secT,
      staked: getDataNumber(data, `getTokenStaked_${t}`) / 10 ** getDataNumber(data, `decimals_${t}`),
      invested: getDataNumber(data, `getTokenInvested_${t}`) / 10 ** getDataNumber(data, `decimals_${t}`),
      notInvested: getDataNumber(data, `getTokenNotInvested_${t}`) / 10 ** getDataNumber(data, `decimals_${t}`),
      investedWeight: getDataNumber(data, `getTokenWeight_${t}`) / 100,
      desiredWeight: getDataNumber(data, `glpWeight_${t}`) / 100,
    }
  });

}

const getSecondaryTokens = (data: any, tokenList: string[]) => {
  //console.log("getSecondaryTokens", tokenList);
  if (tokenList.length == 0)
    return [];

  return tokenList.map(t => getERC20Token(data, t));
}