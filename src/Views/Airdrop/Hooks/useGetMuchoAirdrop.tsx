import TokenAbi from '../Config/Abis/mAirdrop.json';
import ManagerAbi from '../Config/Abis/mAirdropManager.json';
import { MAIDROP_CONFIG } from '../Config/mAirdropConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IMuchoAirdropManagerData } from '../AirdropAtom';
import { getDataNumber, getDataString } from './useCommonUtils';



export const useGetMuchoAirdrop = () => {
  //console.log("useGetPlans");
  let activeChain: Chain | null = null;
  const contextValue = useContext(ViewContext);
  if (contextValue) {
    activeChain = contextValue.activeChain;
  }
  // const { state } = useGlobal();
  const config: (typeof MAIDROP_CONFIG)[42161] = MAIDROP_CONFIG[activeChain.id];

  let calls = [
    {
      address: config.ManagerContract,
      abi: ManagerAbi,
      functionName: 'active',
      args: [],
      chainId: activeChain?.id,
    },

    {
      address: config.ManagerContract,
      abi: ManagerAbi,
      functionName: 'dateEnd',
      args: [],
      chainId: activeChain?.id,
    },

    {
      address: config.ManagerContract,
      abi: ManagerAbi,
      functionName: 'dateIni',
      args: [],
      chainId: activeChain?.id,
    },

    {
      address: config.ManagerContract,
      abi: ManagerAbi,
      functionName: 'mAirdropTokenPrice',
      args: [config.TokenPayment],
      chainId: activeChain?.id,
    },

    {
      address: config.ManagerContract,
      abi: ManagerAbi,
      functionName: 'mAirdrop',
      args: [],
      chainId: activeChain?.id,
    },

    {
      address: config.ManagerContract,
      abi: ManagerAbi,
      functionName: 'mAirdropDecimals',
      args: [],
      chainId: activeChain?.id,
    },

    {
      address: config.TokenContract,
      abi: TokenAbi,
      functionName: '_maxSupply',
      args: [],
      chainId: activeChain?.id,
    },

    {
      address: config.TokenContract,
      abi: TokenAbi,
      functionName: 'totalSupply',
      args: [],
      chainId: activeChain?.id,
    },
  ];


  const { address: account } = useUserAccount();

  if (account) {
    calls = calls.concat([
      {
        address: config.ManagerContract,
        abi: ManagerAbi,
        functionName: 'depositedUserToken',
        args: [account, config.TokenPayment],
        chainId: activeChain?.id,
      },

      {
        address: config.TokenContract,
        abi: TokenAbi,
        functionName: 'balanceOf',
        args: [account],
        chainId: activeChain?.id,
      },

      {
        address: config.TokenContract,
        abi: TokenAbi,
        functionName: 'balanceOf',
        args: [account],
        chainId: activeChain?.id,
        map: 'mAirdropUser'
      },

      {
        address: config.TokenPayment,
        abi: TokenAbi,
        functionName: 'balanceOf',
        args: [account],
        chainId: activeChain?.id,
        map: 'mAirdropTokenPriceUser'
      },


    ])
  }

  //console.log("Calls before index", calls);

  //add map attribute
  calls = calls.map(c => {
    if (!c.map) {
      c.map = c.functionName;
      for (var i in c.args) {
        c.map += "_" + c.args[i].toString();
      }
    }
    return c;
  })

  //console.log("Calls after index", calls);

  let indexes: any = {};
  calls.forEach((c, i) => { indexes[c.map] = i; });

  //console.log("Calls", calls);
  //console.log("indexes", indexes);

  let { data } = useContractReads({
    contracts: calls,
    watch: true,
  });
  data = getBNtoStringCopy(data);

  //console.log("Result contracts", data);

  let res: IMuchoAirdropManagerData;
  //return response;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    data.indexes = indexes;

    let endDate = new Date(0);
    endDate.setUTCSeconds(getDataNumber(data, 'dateEnd'));

    let iniDate = new Date(0);
    iniDate.setUTCSeconds(getDataNumber(data, 'dateIni'));

    res = {
      contract: config.ManagerContract,

      mAirdropContract: getDataString(data, 'mAirdrop'),
      mAirdropMaxSupply: Math.round(getDataNumber(data, '_maxSupply') / (10 ** getDataNumber(data, 'mAirdropDecimals'))),
      mAirdropCurrentSupply: getDataNumber(data, 'totalSupply') / (10 ** getDataNumber(data, 'mAirdropDecimals')),
      mAirdropDecimals: getDataNumber(data, 'mAirdropDecimals'),
      mAirdropInWallet: getDataNumber(data, 'mAirdropUser') / (10 ** getDataNumber(data, 'mAirdropDecimals')),
      userBalance: getDataNumber(data, `balanceOf_${account}`),

      dateIni: iniDate,
      dateEnd: endDate,
      active: getDataNumber(data, 'active'),

      price: getDataNumber(data, `mAirdropTokenPrice_${config.TokenPayment}`) / (10 ** config.TokenPaymentDecimals),
      priceTokenAddress: config.TokenPayment,
      priceTokenSymbol: config.TokenPaymentSymbol,
      priceTokenDecimals: config.TokenPaymentDecimals,
      priceTokenInWallet: getDataNumber(data, `mAirdropTokenPriceUser`) / (10 ** config.TokenPaymentDecimals),
    };

  }

  //console.log("Response RPC", res);

  return res ? res : null;
};