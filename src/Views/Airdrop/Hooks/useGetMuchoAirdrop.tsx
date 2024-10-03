import TokenAbi from '../Config/Abis/mAirdrop.json';
import ManagerAbi from '../Config/Abis/mAirdropManager.json';
import RewardRouterAbi from '../Config/Abis/mAirdropRewardRouter.json';
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
  ];

  if (config.TokenContract) {
    calls = calls.concat([{
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
    },]
    )
  }

  //OldTokenContracts
  calls = calls.concat(config.OldTokenContracts.map(c => {
    return {
      address: c.contract,
      abi: TokenAbi,
      functionName: '_maxSupply',
      args: [],
      chainId: activeChain?.id,
      map: `maxSupply_${c.contract}`
    };
  }
  )
  );

  calls = calls.concat(config.OldTokenContracts.map(c => {
    return {
      address: c.contract,
      abi: TokenAbi,
      functionName: 'totalSupply',
      args: [],
      chainId: activeChain?.id,
      map: `totalSupply_${c.contract}`
    };
  }
  )
  );


  //add prices calls
  if (config.TokenContract) {
    calls = calls.concat(config.PaymentTokens.map(p => {
      return {
        address: config.ManagerContract,
        abi: ManagerAbi,
        functionName: 'mAirdropTokenPrice',
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

    /*calls = calls.concat(config.PaymentTokens.map(p => {
      return {
        address: config.ManagerContract,
        abi: ManagerAbi,
        functionName: 'depositedUserToken',
        args: [account, p.TokenPayment],
        chainId: activeChain?.id,
      };
    }));*/

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


    //Own airdrop rewards
    calls.push({
      address: config.RewardRouterContract,
      abi: RewardRouterAbi,
      functionName: 'userAllAirdropRewards',
      args: [account],
      chainId: activeChain?.id,
      map: `userAllAirdropRewards`
    });

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

  let res: IMuchoAirdropManagerData;
  //return response;

  if (data && data[0]) {
    //console.log("DATA!!", data);
    data.indexes = indexes;
    //console.log("Distributions", getDataString(data, 'userAllAirdropRewards'));

    let endDate = new Date(0);
    if (config.TokenContract)
      endDate.setUTCSeconds(getDataNumber(data, 'dateEnd'));

    let iniDate = new Date(0);
    if (config.TokenContract)
      iniDate.setUTCSeconds(getDataNumber(data, 'dateIni'));

    const dist = getDataString(data, 'userAllAirdropRewards');

    res = {
      contract: config.ManagerContract,

      mAirdropContract: config.TokenContract ? getDataString(data, 'mAirdrop') : "",
      mAirdropVersion: config.TokenContractVersion ?? "",
      mAirdropMaxSupply: config.TokenContract ? Math.round(getDataNumber(data, '_maxSupply') / (10 ** getDataNumber(data, 'mAirdropDecimals'))) : 0,
      mAirdropCurrentSupply: config.TokenContract ? getDataNumber(data, 'totalSupply') / (10 ** getDataNumber(data, 'mAirdropDecimals')) : 0,
      mAirdropDecimals: config.TokenContract ? getDataNumber(data, 'mAirdropDecimals') : 0,
      mAirdropInWallet: config.TokenContract ? getDataNumber(data, 'mAirdropUser') / (10 ** getDataNumber(data, 'mAirdropDecimals')) : 0,
      userBalance: config.TokenContract ? getDataNumber(data, `balanceOf_${account}`) / (10 ** getDataNumber(data, 'mAirdropDecimals')) : 0,

      dateIni: iniDate,
      dateEnd: endDate,
      active: getDataNumber(data, 'active'),

      prices: config.PaymentTokens.map(p => {
        return {
          price: getDataNumber(data, `mAirdropTokenPrice_${p.TokenPayment}`) / (10 ** p.TokenPaymentDecimals),
          priceTokenAddress: p.TokenPayment,
          priceTokenSymbol: p.TokenPaymentSymbol,
          priceTokenDecimals: p.TokenPaymentDecimals,
          priceTokenInWallet: getDataNumber(data, `tokenInWallet_${p.TokenPayment}`) / (10 ** p.TokenPaymentDecimals),
        }
      }),

      oldTokens: config.OldTokenContracts.map(c => {
        return {
          maxSupply: Math.round(getDataNumber(data, `maxSupply_${c.contract}`) / (10 ** getDataNumber(data, 'mAirdropDecimals'))),
          totalSupply: getDataNumber(data, `totalSupply_${c.contract}`) / (10 ** getDataNumber(data, 'mAirdropDecimals')),
          userBalance: getDataNumber(data, `tokenInWallet_${c.contract}`) / (10 ** getDataNumber(data, 'mAirdropDecimals')),
          version: c.version,
        }
      }),


      distributions: (dist && dist.length > 0) ? dist.filter(d => config.RewardBlacklist.indexOf(d.airdropId) < 0).map(d => {
        let expDate = Number(d.expirationDate);
        //Ñapa
        if ([7, 8].indexOf(Number(d.airdropId)) >= 0) {
          expDate += 90 * 24 * 60 * 60;
        }
        return {
          id: d.airdropId,
          token: d.token,
          name: d.name,
          totalTokens: d.normalAmount / 10 ** d.decimals + d.bonusAmount / 10 ** d.decimals,
          userTokensByMAirdrop: d.normalAmount / 10 ** d.decimals,
          userTokensByNFT: d.bonusAmount / 10 ** d.decimals,
          expirationDate: (new Date(expDate * 1000)),
          precision: 2,
        }

      }) : []
    };

  }

  //console.log("Response RPC", res);

  return res ? res : null;
};