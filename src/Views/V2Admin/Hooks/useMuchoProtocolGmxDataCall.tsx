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
import { getERC20Token } from './useCommonUtils';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetMuchoProtocolGmxData = () => {
  const { address: account } = useUserAccount();
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

  const muchoGmxContractCalls = ['EsGMX', 'fsGLP', 'WETH', 'glpRouter', 'glpRewardRouter',
    'poolGLP', 'glpVault', 'muchoRewardRouter', 'priceFeed'].map(f => {
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


  const calls = [...muchoGmxParameterCalls, ...muchoGmxContractCalls, muchoGmxTokensCall];
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
  const getData = (call: string) => { return data[indexes[call]] ? data[indexes[call]] : ""; }
  //return response;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    //console.log("Index", indexes);
    const initNoVaults = v2AdminConfig.MuchoVault.vaults.length;

    responseMP = {
      contract: v2AdminConfig.MuchoProtocolGmx.contract,
      protocolName: getData('protocolName'),
      protocolDescription: getData('protocolDescription'),

      glpApr: getData('glpApr') / 100,
      glpWethMintFee: getData('glpWethMintFee') / 100,
      slippage: getData('slippage') / 100,
      earningsAddress: getData('earningsAddress'),
      claimEsGmx: Boolean(getData('claimEsGmx')),

      minNotInvestedPercentage: getData('minNotInvestedPercentage') / 100,
      desiredNotInvestedPercentage: getData('desiredNotInvestedPercentage') / 100,
      minBasisPointsMove: getData('minBasisPointsMove') / 100,
      maxRefreshWeightLapse: getData('maxRefreshWeightLapse') / 3600,
      manualModeWeights: Boolean(getData('manualModeWeights')),
      rewardSplit: {
        ownerPercentage: getData('rewardSplit').ownerPercentage / 100,
        NftPercentage: getData('rewardSplit').NftPercentage / 100,
      },
      compoundProtocol: getData('compoundProtocol'),

      contracts: {
        EsGMX: getData('EsGMX'),
        fsGLP: getData('fsGLP'),
        WETH: getData('WETH'),
        glpRouter: getData('glpRouter'),
        glpRewardRouter: getData('glpRewardRouter'),
        poolGLP: getData('poolGLP'),
        glpVault: getData('glpVault'),
        muchoRewardRouter: getData('muchoRewardRouter'),
        priceFeed: getData('priceFeed'),
      },

      tokenInfo: getTokensInfo(getData('getTokens')),
    };



  }

  //console.log("Response RPC", responseMP);
  return responseMP ? responseMP : null;
};

const getTokensInfo = (tokens: string[]) => {
  if (!tokens)
    return null;

  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  const v2AdminConfig: (typeof V2ADMIN_CONFIG)[42161] = V2ADMIN_CONFIG[activeChain.id];
  let calls = [];
  tokens.forEach(t => {
    calls = calls.concat(
      ['getSecondaryTokens', 'getTokenStaked', 'getTokenInvested', 'getTokenNotInvested', 'getTokenWeight'].map(f => {
        return {
          address: v2AdminConfig.MuchoProtocolGmx.contract,
          abi: MuchoProtocolGmxAbi,
          functionName: f,
          args: [t],
          chainId: activeChain?.id,
          map: `${f}_${t}`
        }
      })
    );

    calls.push({
      address: t,
      abi: ERC20Abi,
      functionName: 'symbol',
      chainId: activeChain?.id,
      map: `symbol_${t}`,
    });

    calls.push({
      address: t,
      abi: ERC20Abi,
      functionName: 'decimals',
      chainId: activeChain?.id,
      map: `decimals_${t}`,
    });
  });

  let indexes = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });
  const getData = (call: string) => { return data[indexes[call]] ? data[indexes[call]] : ""; }

  let { data } = useContractReads({
    contracts: calls,
    watch: false,
  });
  data = getBNtoStringCopy(data);

  //console.log("Tokens data", data);
  //console.log("Tokens index", indexes);

  if (data && data[0]) {
    return tokens.map(t => {
      const secT = getSecondaryTokens(getData(`getSecondaryTokens_${t}`));

      return {
        token: { name: getData(`symbol_${t}`), contract: t, decimals: getData(`decimals_${t}`) },
        secondaryTokens: secT,
        staked: getData(`getTokenStaked_${t}`),
        invested: getData(`getTokenInvested_${t}`),
        notInvested: getData(`getTokenNotInvested_${t}`),
        desiredWeight: getData(`getTokenWeight_${t}`) / 100,
      }
    });
  }

}

const getSecondaryTokens = (tokenList: string[]) => {
  //console.log("getSecondaryTokens", tokenList);
  if (tokenList.length == 0)
    return [];

  return tokenList.map(t => getERC20Token(t));
}