import MuchoHubAbi from '../Config/Abis/MuchoHub.json';
import MuchoProtocolGmxAbi from '../Config/Abis/MuchoProtocolGmx.json';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IMuchoHubData, IMuchoVaultData, IToken } from '../v2AdminAtom';
import { getDataNumber, getDataString, getERC20Token, getERC20TokenCalls } from './useCommonUtils';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};


export const useGetMuchoHubV2Data = () => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const v2AdminConfig: (typeof V2ADMIN_CONFIG)[42161] = V2ADMIN_CONFIG[activeChain.id];

  let tokenCalls = [];
  v2AdminConfig.TokenDictionary.forEach(t => tokenCalls = tokenCalls.concat(getERC20TokenCalls(t)));

  let calls = [
    {
      address: v2AdminConfig.MuchoHub.contract,
      abi: MuchoHubAbi,
      functionName: 'protocols',
      chainId: activeChain?.id,
      map: 'protocols',
    },
  ];

  calls = calls.concat(tokenCalls);

  v2AdminConfig.ProtocolDictionary.forEach(p => calls.push(
    {
      address: p,
      abi: MuchoProtocolGmxAbi,
      functionName: 'protocolName',
      chainId: activeChain?.id,
      map: `protocolName_${p}`
    }
  ));

  v2AdminConfig.MuchoHub.tokens.forEach(t => {
    calls.concat([
      {
        address: v2AdminConfig.MuchoHub.contract,
        abi: MuchoHubAbi,
        functionName: 'getTotalStaked',
        chainId: activeChain?.id,
        args: [t],
        map: `getTotalStaked_${t}`,
      },
      {
        address: v2AdminConfig.MuchoHub.contract,
        abi: MuchoHubAbi,
        functionName: 'getTotalNotInvested',
        chainId: activeChain?.id,
        args: [t],
        map: `getTotalNotInvested_${t}`,
      },
      {
        address: v2AdminConfig.MuchoHub.contract,
        abi: MuchoHubAbi,
        functionName: 'getTokenDefaults',
        chainId: activeChain?.id,
        args: [t],
        map: `getTokenDefaults_${t}`,
      },
      {
        address: v2AdminConfig.MuchoHub.contract,
        abi: MuchoHubAbi,
        functionName: 'getCurrentInvestment',
        chainId: activeChain?.id,
        args: [t],
        map: `getCurrentInvestment_${t}`,
      }
    ]);
  })

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

  let responseMH: IMuchoHubData;
  //return response;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    data.indexes = indexes;

    responseMH = {
      protocols: getDataString(data, 'protocols').map(p => {
        return { name: getDataString(data, `protocolName_${p}`), address: p }
      }),
      contract: v2AdminConfig.MuchoHub.contract,
      tokensInfo: v2AdminConfig.MuchoHub.tokens.map(t => {
        const tk: IToken = getERC20Token(data, t);
        return {
          token: tk,
          totalStaked: getDataNumber(data, `getTotalStaked_${t}`) / (10 ** tk.decimals),
          totalNotInvested: getDataNumber(data, `getTotalNotInvested_${t}`) / (10 ** tk.decimals),
          defaultInvestment: getDataString(data, `getTokenDefaults_${t}`) ? getDataString(data, `getTokenDefaults_${t}`).map(d => {
            return {
              protocol: d.protocol,
              percentage: d.percentage / 100
            }
          }) : null,
          currentInvestment: getDataNumber(data, `getCurrentInvestment_${t}`) ? getDataNumber(data, `getCurrentInvestment_${t}`).map(d => {
            return {
              protocol: d.protocol,
              amount: d.amount / (10 ** tk.decimals)
            }
          }) : null,
        }
      })
    }

  }

  //console.log("Response RPC", response);

  return responseMH ? responseMH : null;
};
