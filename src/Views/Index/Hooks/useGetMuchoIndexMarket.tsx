import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '../market';
import { useContext } from 'react';
import { IMuchoTokenMarketData } from '../IndexAtom';
import { useGlobal } from '@Contexts/Global';
import { MINDEX_CONFIG } from '../Config/mIndexConfig';
import MarketAbi from '../Config/Abis/mIndexMarket.json';
import IndexAbi from '../Config/Abis/mIndex.json';
import ERC20Abi from '../Config/Abis/ERC20Ext.json';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { getDataNumber, getDataString } from './useCommonUtils';




export const useGetMuchoIndexMarket = () => {
  //console.log("useGetPlans");
  let activeChain: Chain | null = null;
  const contextValue = useContext(ViewContext);
  if (contextValue) {
    activeChain = contextValue.activeChain;
  }

  const { state } = useGlobal();
  const config: (typeof MINDEX_CONFIG)[42161] = MINDEX_CONFIG[activeChain.id];

  let calls: { address: string, abi: any[], functionName: string, args: any[], chainId: number | undefined, map: any | null }[] = [
    {
      address: config.MarketContract,
      abi: MarketAbi,
      functionName: 'enabled',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
    {
      address: config.MarketContract,
      abi: MarketAbi,
      functionName: 'SLIPPAGE',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
    {
      address: config.MarketContract,
      abi: MarketAbi,
      functionName: 'mToken',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
    {
      address: config.TokenContract,
      abi: IndexAbi,
      functionName: 'decimals',
      args: [],
      chainId: activeChain?.id,
      map: 'mTokenDecimals'
    },
    {
      address: config.MarketContract,
      abi: MarketAbi,
      functionName: 'buyToken',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
    {
      address: config.MarketContract,
      abi: MarketAbi,
      functionName: 'sellToken',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
    {
      address: config.MarketContract,
      abi: MarketAbi,
      functionName: 'withdrawFee',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
    {
      address: config.MarketContract,
      abi: MarketAbi,
      functionName: 'depositFee',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
    {
      address: config.TokenContract,
      abi: IndexAbi,
      functionName: 'totalSupply',
      args: [],
      chainId: activeChain?.id,
      map: null
    },
  ];

  const { address: account } = useUserAccount();

  if (account) {
    calls = calls.concat([
      {
        address: config.MarketContract,
        abi: MarketAbi,
        functionName: 'withdrawFeeUser',
        args: [account],
        chainId: activeChain?.id,
        map: null
      },
      {
        address: config.MarketContract,
        abi: MarketAbi,
        functionName: 'depositFeeUser',
        args: [account],
        chainId: activeChain?.id,
        map: null
      },
      {
        address: config.TokenContract,
        abi: IndexAbi,
        functionName: 'balanceOf',
        args: [account],
        chainId: activeChain?.id,
        map: null
      },

      {
        address: config.BuyToken,
        abi: ERC20Abi,
        functionName: 'balanceOf',
        args: [account],
        chainId: activeChain?.id,
        map: 'balanceBuy'
      },
      {
        address: config.BuyToken,
        abi: ERC20Abi,
        functionName: 'decimals',
        args: [account],
        chainId: activeChain?.id,
        map: 'decimalsBuy'
      },
      {
        address: config.BuyToken,
        abi: ERC20Abi,
        functionName: 'symbol',
        args: [account],
        chainId: activeChain?.id,
        map: 'symbolBuy'
      },

      {
        address: config.SellToken,
        abi: ERC20Abi,
        functionName: 'balanceOf',
        args: [account],
        chainId: activeChain?.id,
        map: 'balanceSell'
      },
      {
        address: config.SellToken,
        abi: ERC20Abi,
        functionName: 'decimals',
        args: [account],
        chainId: activeChain?.id,
        map: 'decimalsSell'
      },
      {
        address: config.SellToken,
        abi: ERC20Abi,
        functionName: 'symbol',
        args: [account],
        chainId: activeChain?.id,
        map: 'symbolSell'
      },
    ])
  }

  //console.log("Calls before index", calls);

  //add map attribute
  calls = calls.map(c => {
    if (!c.map) {
      c.map = c.functionName;
      for (var i in c.args) {
        if (c.args[i])
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

  let res: IMuchoTokenMarketData = {
    contract: "0x0",
    mTokenContract: "0x0",
    mTokenCurrentSupply: 0,
    mTokenDecimals: 0,
    userBalance: 0,
    active: false,
    withdrawFeeUser: 0,
    depositFeeUser: 0,
    slippage: 0,
    buyTokenInWallet: 0,
    buyTokenSymbol: "",
  }

  if (data && data[0]) {
    //console.log("DATA!!", data);
    data.indexes = indexes;
    //console.log("DATA!!", data);
    //console.log("Distributions", getDataString(data, 'userAllAirdropRewards'));

    let endDate = new Date(0);
    if (config.TokenContract)
      endDate.setUTCSeconds(getDataNumber(data, 'dateEnd'));

    let iniDate = new Date(0);
    if (config.TokenContract)
      iniDate.setUTCSeconds(getDataNumber(data, 'dateIni'));

    res = {
      contract: config.MarketContract,
      mTokenContract: getDataString(data, "mToken"),
      mTokenCurrentSupply: Math.round(getDataNumber(data, "totalSupply") / (10 ** getDataNumber(data, "mTokenDecimals"))),
      mTokenDecimals: getDataNumber(data, "mTokenDecimals"),
      userBalance: getDataNumber(data, "balanceOf"),
      active: Boolean(getDataString(data, "enabled")),
      withdrawFeeUser: account ? getDataNumber(data, "withdrawFeeUser") : getDataNumber(data, "withdrawFee"),
      depositFeeUser: account ? getDataNumber(data, "depositFeeUser") : getDataNumber(data, "depositFee"),
      slippage: getDataNumber(data, "SLIPPAGE") / 10000,
      buyTokenInWallet: account ? getDataNumber(data, "balanceBuy") / (10 ** getDataNumber(data, "decimalsBuy")) : 0,
      buyTokenSymbol: getDataString(data, "symbolBuy")
    };

    console.log("Res obtained", res);

  }

  return res ? res : null;
}