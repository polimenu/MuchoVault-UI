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
import { getERC20Token } from './useCommonUtils';

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

  let calls = [
    {
      address: v2AdminConfig.MuchoHub.contract,
      abi: MuchoHubAbi,
      functionName: 'protocols',
      chainId: activeChain?.id,
      map: 'protocols',
    },
  ];

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
  const getData = (call: string) => { return data[indexes[call]] ? data[indexes[call]] : ""; }
  //return response;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    const protocolNames: IDic = getProtocolNameState(getData('protocols'));

    responseMH = {
      protocols: getData('protocols').map(p => {
        return { name: protocolNames[p], address: p }
      }),
      contract: v2AdminConfig.MuchoHub.contract,
      tokensInfo: v2AdminConfig.MuchoHub.tokens.map(t => {
        const tk: IToken = getERC20Token(t);
        return {
          token: tk,
          totalStaked: getData(`getTotalStaked_${t}`) / (10 ** tk.decimals),
          totalNotInvested: getData(`getTotalNotInvested_${t}`) / (10 ** tk.decimals),
          defaultInvestment: getData(`getTokenDefaults_${t}`) ? getData(`getTokenDefaults_${t}`).map(d => {
            return {
              protocol: d.protocol,
              percentage: d.percentage / 100
            }
          }) : null,
          currentInvestment: getData(`getCurrentInvestment_${t}`) ? getData(`getCurrentInvestment_${t}`).map(d => {
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

const getProtocolNameState = (protocolAddress: string[]) => {
  //console.log("getProtocolNameState", protocolAddress);
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  // const { state } = useGlobal();

  const protocolInfoCalls = protocolAddress.map(p => {
    return {
      address: p,
      abi: MuchoProtocolGmxAbi,
      functionName: 'protocolName',
      chainId: activeChain?.id,
      map: `protocolName_${p}`
    }
  });

  let indexes = {};
  protocolInfoCalls.forEach((c, i) => { indexes[c.map] = i; });

  //console.log("Calls", calls);
  //console.log("indexes", indexes);

  let ret: IDic[] = [];

  let { data } = useContractReads({
    contracts: protocolInfoCalls,
    watch: false,
  });
  data = getBNtoStringCopy(data);
  if (data) {
    const getData = (call: string) => { return data[indexes[call]] ? data[indexes[call]] : ""; }
    protocolAddress.forEach(p => {
      ret[p] = getData(`protocolName_${p}`);
    })
  }
  else {
    const abc = "ABCDEFGHIJKLMNOPQRSTUV";
    let i = 0;
    protocolAddress.forEach(p => {
      ret[p] = abc.substring(i, i + 1);
      i++;
    })
  }

  return ret;
}

interface IDic { [key: string]: string };