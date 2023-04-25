import ERC20ExtAbi from '../Config/Abis/ERC20Ext.json';
import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import { CONTRACTS } from '../Config/Address';
import { EARN_CONFIG } from '../Config/Pools';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import {
  divide,
} from '@Utils/NumString/stringArithmatics';

import { Chain, useContractReads } from 'wagmi';
import { EarnContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';


export const fromWei = (value: string, decimals: number = 18) => {
  return divide(value, decimals) ?? '0';
  // return Math.floor((value * 1e6) / 1e18) / 1e6;
};

export const useGetTokenomics = () => {
  //console.log("useGetTokenomics");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const earnContextValue = useContext(EarnContext);
  if (earnContextValue) {
    activeChain = earnContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const pool_config: (typeof EARN_CONFIG)[42161] = EARN_CONFIG[activeChain.id];

  const getUserSpecificCalls = () => {
    if (!activeChain || !pool_config) return [];
    let user_specific_data = [];

    for (var i = 0; i < pool_config.POOLS.length; i++) {

      //console.log(`pool${i}`);
      user_specific_data = user_specific_data.concat(
        [
          {
            address: pool_config.POOLS[i].token.address,
            abi: ERC20ExtAbi,
            functionName: 'balanceOf',
            args: [account],
            return: `pool${i}/tokenBalance`,
          },
          {
            address: pool_config.POOLS[i].mToken.address,
            abi: ERC20ExtAbi,
            functionName: 'balanceOf',
            args: [account],
            return: `pool${i}/mTokenBalance`,
          }
        ]
      );

    }

    //console.log("USR");
    //console.log(user_specific_data);

    return user_specific_data;
  };

  const getGenericCalls = () => {
    if (!activeChain || !pool_config) return [];

    let generic_call_data = [];

    for (var i = 0; i < pool_config.POOLS.length; i++) {

      generic_call_data = generic_call_data.concat(
        [{
          address: pool_config.MuchoVault,
          abi: MuchoVaultAbi,
          functionName: 'poolInfo',
          args: [i],
          return: `pool${i}/info`,
        },
        {
          address: pool_config.POOLS[i].mToken.address,
          abi: ERC20ExtAbi,
          functionName: 'totalSupply',
          return: `pool${i}/mTokenSupply`,
        },
        {
          address: pool_config.MuchoVault,
          abi: MuchoVaultAbi,
          functionName: 'totalUSDvault',
          args: [i],
          return: `pool${i}/totalUSD`,
        }
        ]
      );

    }

    generic_call_data = generic_call_data.concat([
      {
        address: pool_config.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'totalUSDvaults',
        return: `totalUSDvaults`,
      },
      {
        address: pool_config.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'GLPinVault',
        return: `GLPinVault`,
      },
      {
        address: pool_config.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'GLPbackingNeeded',
        return: `GLPbackingNeeded`,
      }
    ]);

    return generic_call_data;
  };


  const getcalls = () => {
    const userSpecificCalls = getUserSpecificCalls();

    if (!activeChain || !pool_config) return [];

    const generic_call_data = getGenericCalls();

    return generic_call_data.concat(account ? userSpecificCalls : []);
  };

  const calls = getcalls().map((call) => {
    return { ...call, chainId: activeChain.id };
  });

  console.log("CALL"); console.log({
    contracts: calls,
    watch: true,
  });

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  let response = {};

  if (data && data[0]) {

    const dataMapped = [];
    calls.forEach((call, i) => {
      dataMapped[call.return] = data[i];
    })

    let showInfo = account && ((account == "0xcc7322a3A115b05EAE4E99eC5728C0c7fD2BD269") || (account == "0x829C145cE54A7f8c9302CD728310fdD6950B3e16"));
    data = data.concat(new Array(getUserSpecificCalls().length).fill('0'));

    let earnObject = [];

    for (var i = 0; i < pool_config.POOLS.length; i++) {

      earnObject[`${pool_config.POOLS[i].token.symbol}PoolInfo`] = {
        APR: dataMapped[`pool${i}/info`].APR / 100,
        EarnRateSec: dataMapped[`pool${i}/info`].EarnRateSec,
        GDlptoken: dataMapped[`pool${i}/info`].GDlptoken,
        glpFees: dataMapped[`pool${i}/info`].glpFees / 1000,
        lastUpdate: dataMapped[`pool${i}/info`].lastUpdate,
        lpToken: dataMapped[`pool${i}/info`].lpToken,
        rewardStart: dataMapped[`pool${i}/info`].rewardStart,
        stakable: dataMapped[`pool${i}/info`].stakable,
        totalStaked: fromWei(dataMapped[`pool${i}/info`].totalStaked),
        totalStakedUSD: fromWei(dataMapped[`pool${i}/totalUSD`]),
        exchangeUSD: dataMapped[`pool${i}/info`].totalStaked > 0 ? dataMapped[`pool${i}/totalUSD`] / dataMapped[`pool${i}/info`].totalStaked : 0,
        vaultcap: fromWei(dataMapped[`pool${i}/info`].vaultcap),
        withdrawable: dataMapped[`pool${i}/info`].withdrawable,
        muchoTotalSupply: fromWei(dataMapped[`pool${i}/mTokenSupply`]),
        userAvailableInWallet: fromWei(dataMapped[`pool${i}/tokenBalance`], pool_config.POOLS[i].decimals),//
        userMuchoInWallet: fromWei(dataMapped[`pool${i}/mTokenBalance`]),
      };

    }

    earnObject['ProtocolInfo'] = showInfo ? {
      TVL: fromWei(dataMapped['totalUSDvaults']),
      GLP: fromWei(dataMapped['GLPinVault']),
      GLPNeeded: fromWei(dataMapped['GLPbackingNeeded']),
      GLPtoUSD: (dataMapped['GLPbackingNeeded'] > 0 ? (dataMapped['totalUSDvaults'] / dataMapped['GLPbackingNeeded']) : 0),
    } : null;

    // FORMATTING
    response = {
      earn: earnObject
    }

  }

  /*console.log("Formatting done!");
  console.log(response);*/

  return response ? response : { earn: null, vest: null };
};