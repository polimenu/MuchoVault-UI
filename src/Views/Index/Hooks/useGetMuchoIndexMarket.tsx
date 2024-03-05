import TokenAbi from '../Config/Abis/mIndex.json';
import LauncherAbi from '../Config/Abis/mTokenLauncher.json';
import { MINDEX_CONFIG } from '../Config/mIndexConfig';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '..';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';
import { IMuchoTokenLauncherData, IMuchoTokenMarketData } from '../IndexAtom';
import { getDataNumber, getDataString } from './useCommonUtils';



export const useGetMuchoIndexMarket = () => {
  //console.log("useGetPlans");
  let activeChain: Chain | null = null;
  const contextValue = useContext(ViewContext);
  if (contextValue) {
    activeChain = contextValue.activeChain;
  }
  // const { state } = useGlobal();
  //const config: (typeof MINDEX_CONFIG)[42161] = MINDEX_CONFIG[activeChain.id];

  const res: IMuchoTokenMarketData = {
    contract: "0x0",
    mTokenContract: "0x0",
    mTokenCurrentSupply: 725732.46,
    mTokenDecimals: 6,
    userBalance: 1736.1264,
    active: true,
    price: {
      priceUSD: 1.03645,
      slippage: 0.003,
      buyTokenAddress: "0x0",
      buyTokenSymbol: "USDC",
      buyTokenDecimals: 6,
      buyTokenInWallet: 1034.455755,
      buyTokenPrice: 1.03639,
      sellTokenAddress: "0x0",
      sellTokenSymbol: "mUSDC",
      sellTokenDecimals: 6,
      sellTokenInWallet: 0,
      sellTokenPrice: 1.02831
    },
    initTs: 1707146290,
    initPriceUSD: 1,
    withdrawFeeUser: 0.15,
    depositFeeUser: 0,
    indexComposition: [
      { asset: "WBTC", percentage: 12.8 },
      { asset: "WETH", percentage: 13.9 },
      { asset: "SOL", percentage: 25.2 },
      { asset: "Stablecoin", percentage: 48.1 }
    ]
  }

  /*
    let calls = [
      {
        address: config.LauncherContract,
        abi: LauncherAbi,
        functionName: 'active',
        args: [],
        chainId: activeChain?.id,
      },
  
      {
        address: config.LauncherContract,
        abi: LauncherAbi,
        functionName: 'dateEnd',
        args: [],
        chainId: activeChain?.id,
      },
  
      {
        address: config.LauncherContract,
        abi: LauncherAbi,
        functionName: 'onlyNFTHolders',
        args: [],
        chainId: activeChain?.id,
      },
  
      {
        address: config.LauncherContract,
        abi: LauncherAbi,
        functionName: 'dateIni',
        args: [],
        chainId: activeChain?.id,
      },
  
      {
        address: config.LauncherContract,
        abi: LauncherAbi,
        functionName: 'mToken',
        args: [],
        chainId: activeChain?.id,
      },
  
      {
        address: config.LauncherContract,
        abi: LauncherAbi,
        functionName: 'mTokenDecimals',
        args: [],
        chainId: activeChain?.id,
      },
    ];
  
    if (config.TokenContract) {
      calls = calls.concat([
        {
          address: config.TokenContract,
          abi: TokenAbi,
          functionName: 'totalSupply',
          args: [],
          chainId: activeChain?.id,
        },]
      )
    }
  
  
    //add prices calls
    if (config.TokenContract) {
      calls = calls.concat(config.PaymentTokens.map(p => {
        return {
          address: config.LauncherContract,
          abi: LauncherAbi,
          functionName: 'mTokenPrice',
          args: [p.TokenPayment],
          chainId: activeChain?.id,
        };
      }));
    }
  
  
    const { address: account } = useUserAccount();
  
    if (account) {
      if (config.TokenContract) {
        calls = calls.concat([
          {
            address: config.TokenContract,
            abi: TokenAbi,
            functionName: 'balanceOf',
            args: [account],
            chainId: activeChain?.id,
          },
        ])
      }
  


  calls = calls.concat(config.PaymentTokens.map(p => {
    return {
      address: p.TokenPayment,
      abi: TokenAbi,
      functionName: 'balanceOf',
      args: [account],
      chainId: activeChain?.id,
      map: `tokenInWallet_${p.TokenPayment}`
    };
  }));

  //OldTokenContracts
  calls = calls.concat(config.OldTokenContracts.map(c => {
    return {
      address: c.contract,
      abi: TokenAbi,
      functionName: 'balanceOf',
      args: [account],
      chainId: activeChain?.id,
      map: `tokenInWallet_${c.contract}`
    };
  }));


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

let res: IMuchoTokenLauncherData;
//return response;

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
    contract: config.LauncherContract,
    isOnlyNft: Boolean(getDataString(data, 'onlyNFTHolders')),

    mTokenContract: config.TokenContract ? getDataString(data, 'mToken') : "",
    mTokenVersion: config.TokenContractVersion ?? "",
    mTokenCurrentSupply: config.TokenContract ? getDataNumber(data, 'totalSupply') / (10 ** getDataNumber(data, 'mTokenDecimals')) : 0,
    mTokenDecimals: config.TokenContract ? getDataNumber(data, 'mTokenDecimals') : 0,
    userBalance: config.TokenContract ? getDataNumber(data, `balanceOf_${account}`) / (10 ** getDataNumber(data, 'mTokenDecimals')) : 0,

    dateIni: iniDate,
    dateEnd: endDate,
    active: getDataNumber(data, 'active'),

    prices: config.PaymentTokens.map(p => {
      return {
        price: getDataNumber(data, `mTokenPrice_${p.TokenPayment}`) / (10 ** p.TokenPaymentDecimals),
        priceTokenAddress: p.TokenPayment,
        priceTokenSymbol: p.TokenPaymentSymbol,
        priceTokenDecimals: p.TokenPaymentDecimals,
        priceTokenInWallet: getDataNumber(data, `tokenInWallet_${p.TokenPayment}`) / (10 ** p.TokenPaymentDecimals),
      }
    }),
  };
*/

  return res ? res : null;
}