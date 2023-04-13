import ERC20ExtAbi from '../Config/Abis/ERC20Ext.json';
import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import { CONTRACTS } from '../Config/Address';
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
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const earnContextValue = useContext(EarnContext);
  if (earnContextValue) {
    activeChain = earnContextValue.activeChain;
  }
  // const { state } = useGlobal();
  const contracts: (typeof CONTRACTS)[42161] = CONTRACTS[activeChain?.id];

  const getUserSpecificCalls = () => {
    if (!activeChain || !contracts) return [];
    const user_specific_data = {
      userUSDCinWallet: {
        address: contracts.USDC,
        abi: ERC20ExtAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      userMuchoUSDCinWallet: {
        address: contracts.muchoUSDC,
        abi: ERC20ExtAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      userAllowedUSDC: {
        address: contracts.USDC,
        abi: ERC20ExtAbi,
        functionName: 'allowance',
        args: [account, contracts.MuchoVault],
      },
      userWETHinWallet: {
        address: contracts.WETH,
        abi: ERC20ExtAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      userMuchoETHinWallet: {
        address: contracts.muchoETH,
        abi: ERC20ExtAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      userAllowedWETH: {
        address: contracts.WETH,
        abi: ERC20ExtAbi,
        functionName: 'allowance',
        args: [account, contracts.MuchoVault],
      },
      userWBTCinWallet: {
        address: contracts.WBTC,
        abi: ERC20ExtAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      userMuchoBTCinWallet: {
        address: contracts.muchoBTC,
        abi: ERC20ExtAbi,
        functionName: 'balanceOf',
        args: [account],
      },
      userAllowedWBTC: {
        address: contracts.WBTC,
        abi: ERC20ExtAbi,
        functionName: 'allowance',
        args: [account, contracts.MuchoVault],
      }
    };
    return Object.keys(user_specific_data).map(function (key) {
      return user_specific_data[key];
    });
  };
  const getcalls = () => {
    const userSpecificCalls = getUserSpecificCalls();
    if (!activeChain || !contracts) return [];

    const generic_call_data = {
      USDCPoolInfo: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'poolInfo',
        args: [0],
      },
      muchoUSDCTotalSupply: {
        address: contracts.muchoUSDC,
        abi: ERC20ExtAbi,
        functionName: 'totalSupply',
      },
      WETHPoolInfo: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'poolInfo',
        args: [1],
      },
      muchoETHTotalSupply: {
        address: contracts.muchoETH,
        abi: ERC20ExtAbi,
        functionName: 'totalSupply',
      },
      WBTCPoolInfo: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'poolInfo',
        args: [2],
      },
      muchoBTCTotalSupply: {
        address: contracts.muchoBTC,
        abi: ERC20ExtAbi,
        functionName: 'totalSupply',
      },

      USDCPoolDepositedUSD: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'totalUSDvault',
        args: [0],
      },
      WETHPoolDepositedUSD: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'totalUSDvault',
        args: [1],
      },
      WBTCPoolDepositedUSD: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'totalUSDvault',
        args: [2],
      },
      TVL: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'totalUSDvaults'
      },
      GLPinVault: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'GLPinVault'
      },
      GLPbackingNeeded: {
        address: contracts.MuchoVault,
        abi: MuchoVaultAbi,
        functionName: 'GLPbackingNeeded'
      }
    };

    return Object.keys(generic_call_data)
      .map(function (key) {
        return generic_call_data[key];
      })
      .concat(account ? userSpecificCalls : []);
  };

  const calls = getcalls().map((call) => {
    return { ...call, chainId: activeChain.id };
  });

  /*console.log("Calls");
  console.log(calls);*/


  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });

  /*console.log("Data read");
  console.log(data);*/

  data = getBNtoStringCopy(data);

  let response = {};

  if (data && data[0]) {

    data = data.concat(new Array(getUserSpecificCalls().length).fill('0'));

    //console.log("Formatting");
    //console.log(data);

    // FORMATTING
    response = {
      earn: {
        USDCPoolInfo: {
          APR: data[0].APR / 100,
          EarnRateSec: data[0].EarnRateSec,
          GDlptoken: data[0].GDlptoken,
          glpFees: data[0].glpFees / 1000,
          lastUpdate: data[0].lastUpdate,
          lpToken: data[0].lpToken,
          rewardStart: data[0].rewardStart,
          stakable: data[0].stakable,
          totalStaked: fromWei(data[0].totalStaked),
          totalStakedUSD: fromWei(data[6]),
          exchangeUSD: data[0].totalStaked > 0 ? data[6] / data[0].totalStaked : 0,
          vaultcap: fromWei(data[0].vaultcap),
          withdrawable: data[0].withdrawable,
          muchoTotalSupply: fromWei(data[1]),
          userAvailableInWallet: fromWei(data[12], 6),//
          userMuchoInWallet: fromWei(data[13]),
          userAllowed: fromWei(data[14], 6),
        },
        WETHPoolInfo: {
          APR: data[2].APR / 100,
          EarnRateSec: data[2].EarnRateSec,
          GDlptoken: data[2].GDlptoken,
          glpFees: data[2].glpFees / 1000,
          lastUpdate: data[2].lastUpdate,
          lpToken: data[2].lpToken,
          rewardStart: data[2].rewardStart,
          stakable: data[2].stakable,
          totalStaked: fromWei(data[2].totalStaked),
          totalStakedUSD: fromWei(data[7]),
          exchangeUSD: data[2].totalStaked > 0 ? data[7] / data[2].totalStaked : 0,
          vaultcap: fromWei(data[2].vaultcap),
          withdrawable: data[2].withdrawable,
          muchoTotalSupply: fromWei(data[3]),
          userAvailableInWallet: fromWei(data[15], 18),//
          userMuchoInWallet: fromWei(data[16]),
          userAllowed: fromWei(data[17], 18),
        },
        WBTCPoolInfo: {
          APR: data[4].APR / 100,
          EarnRateSec: data[4].EarnRateSec,
          GDlptoken: data[4].GDlptoken,
          glpFees: data[4].glpFees / 1000,
          lastUpdate: data[4].lastUpdate,
          lpToken: data[4].lpToken,
          rewardStart: data[4].rewardStart,
          stakable: data[4].stakable,
          totalStaked: fromWei(data[4].totalStaked),
          totalStakedUSD: fromWei(data[8]),
          exchangeUSD: data[4].totalStaked > 0 ? data[8] / data[4].totalStaked : 0,
          vaultcap: fromWei(data[4].vaultcap),
          withdrawable: data[4].withdrawable,
          muchoTotalSupply: fromWei(data[5]),
          userAvailableInWallet: fromWei(data[18], 8),//
          userMuchoInWallet: fromWei(data[19]),
          userAllowed: fromWei(data[20], 8),
        },
        ProtocolInfo: {
          TVL: fromWei(data[9]),
          GLP: fromWei(data[10]),
          GLPNeeded: fromWei(data[11]),
          GLPtoUSD: (data[11] > 0 ? (data[9] / data[11]) : 0),
        }
      }
    }

  }

  //console.log("Formatting done!");
  //console.log(response);

  return response ? response : { earn: null, vest: null };
};