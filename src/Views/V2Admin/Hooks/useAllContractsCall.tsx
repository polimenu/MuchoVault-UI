import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractRead, useContractReads } from 'wagmi';
import { ViewContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IMuchoVaultData, IMuchoVaultParametersInfo, IV2ContractData, IVaultInfo } from '../v2AdminAtom';
import { ethers } from 'ethers';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetV2Contracts = () => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const v2AdminContextValue = useContext(ViewContext);
  if (v2AdminContextValue) {
    activeChain = v2AdminContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const v2AdminConfig: (typeof V2ADMIN_CONFIG)[42161] = V2ADMIN_CONFIG[activeChain.id];

  const vaultInfoCalls = v2AdminConfig.MuchoVault.vaults.map(v => {
    return {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'getVaultInfo',
      args: [v.id],
      chainId: activeChain?.id,
    }
  });

  const muchoVaultParameterCalls = [
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'bpSwapMuchoTokensFee',
      chainId: activeChain?.id,
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'earningsAddress',
      chainId: activeChain?.id,
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'muchoHub',
      chainId: activeChain?.id,
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'priceFeed',
      chainId: activeChain?.id,
    },
    {
      address: v2AdminConfig.MuchoVault.contract,
      abi: MuchoVaultAbi,
      functionName: 'badgeManager',
      chainId: activeChain?.id,
    },
  ]

  let calls = [...vaultInfoCalls, ...muchoVaultParameterCalls];

  //console.log("Calls", calls);

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result contracts", data);

  let response: IMuchoVaultData;
  //return response;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    const initNoVaults = v2AdminConfig.MuchoVault.vaults.length;

    response = {
      contract: v2AdminConfig.MuchoVault.contract,
      vaultsInfo: v2AdminConfig.MuchoVault.vaults.map((v, i) => {
        const vId = i;
        return {
          id: v.id,
          depositToken: { name: v.depositTokenName, contract: data[vId].depositToken },
          muchoToken: { name: v.muchoTokenName, contract: data[vId].muchoToken },
          decimals: v.decimals,
          totalStaked: data[vId].totalStaked / (10 ** v.decimals),
          lastUpdate: Date(data[vId].lastUpdate),
          stakable: data[vId].stakable,
          depositFee: data[vId].depositFee / 100,
          withdrawFee: data[vId].withdrawFee / 100,
          maxCap: data[vId].maxCap / (10 ** v.decimals),
          maxDepositUser: data[vId].maxDepositUser / (10 ** v.decimals),
        }
      }),
      parametersInfo: { swapFee: data[initNoVaults] / 100, earningsAddress: data[initNoVaults + 1] },
      contractsInfo: { muchoHub: data[initNoVaults + 2], priceFeed: data[initNoVaults + 3], badgeManager: data[initNoVaults + 4] },
    };

  }

  //console.log("Response RPC", response);

  return response ? response : null;
};