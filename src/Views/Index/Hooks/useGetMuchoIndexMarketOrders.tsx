import { Chain, useContractReads } from 'wagmi';
import { ViewContext } from '../market';
import { useContext } from 'react';
import { IMuchoIndexOrder } from '../IndexAtom';
import { useGlobal } from '@Contexts/Global';
import { MINDEX_CONFIG } from '../Config/mIndexConfig';
import QueueAbi from '../Config/Abis/MuchoIndexOrderQueue.json';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getBNtoStringCopy } from '@Utils/useReadCall';
import { getDataString } from './useCommonUtils';




export const useGetMuchoIndexMarketOrders = () => {
  //console.log("useGetPlans");
  let activeChain: Chain | null = null;
  const contextValue = useContext(ViewContext);
  if (contextValue) {
    activeChain = contextValue.activeChain;
  }

  //console.log("activeChain-------------", activeChain);

  const { state } = useGlobal();
  const config: (typeof MINDEX_CONFIG)[42161] = MINDEX_CONFIG[activeChain.id];

  let calls: { address: string, abi: any[], functionName: string, args: any[], chainId: number | undefined, map: any | null }[] = [];

  const { address: account } = useUserAccount();

  if (account) {
    calls = calls.concat([
      {
        address: config.BuyQueueContract,
        abi: QueueAbi,
        functionName: 'userOrders',
        args: [account],
        chainId: activeChain?.id,
        map: 'userOrdersBuy',
      },
      {
        address: config.SellQueueContract,
        abi: QueueAbi,
        functionName: 'userOrders',
        args: [account],
        chainId: activeChain?.id,
        map: 'userOrdersSell',
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

  let res: IMuchoIndexOrder[] = []

  if (data && data[0]) {
    //console.log("DATA!!", data);
    data.indexes = indexes;
    //console.log("DATA!!", data);
    //console.log("Distributions", getDataString(data, 'userAllAirdropRewards'));
    const ordBuy = getDataString(data, "userOrdersBuy");
    //console.log("ordBuy!!", ordBuy);
    const ordSell = getDataString(data, "userOrdersSell");

    const orderStatus = (ord: number): string => {
      if (ord == 0)
        return "PENDING";
      if (ord == 1)
        return "CANCELLED";
      return ord.toString();
    }

    const orderType = (t: number): string => {
      if (t == 0)
        return "BUY";
      if (t == 1)
        return "SELL";
      return t.toString();
    }

    if (ordBuy) {
      for (const o of ordBuy) {
        res.push({
          orderPosition: o["orderPosition"],
          orderType: orderType(o["orderType"]),
          orderStatus: orderStatus(o["orderStatus"]),
          remitant: o["remitant"],
          amount: o["amount"] / (10 ** config.DecimalsBuyToken),
          fee: o["fee"],
          date: o["date"],
          attempts: o["attempts"],
          lastAttempt: o["lastAttempt"]
        })
      }
    }

    if (ordSell) {
      for (const o of ordSell) {
        res.push({
          orderPosition: o["orderPosition"],
          orderType: orderType(o["orderType"]),
          orderStatus: orderStatus(o["orderStatus"]),
          remitant: o["remitant"],
          amount: o["amount"] / (10 ** config.DecimalsBuyToken),
          fee: o["fee"],
          date: o["date"],
          attempts: o["attempts"],
          lastAttempt: o["lastAttempt"]
        })
      }
    }

    //console.log("Res obtained", res);

  }

  return res ? res : null;
}