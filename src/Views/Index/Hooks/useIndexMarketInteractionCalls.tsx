import { useContext } from "react";
import { ViewContext } from "../market";
import { useWriteCall } from "@Hooks/useWriteCall";
import { IMuchoTokenMarketData, indexAtom } from "../IndexAtom";
import MuchoIndexMarketABI from '../Config/Abis/MuchoIndexMarket.json'
import { useToast } from "@Contexts/Toast";
import { useAtom } from "jotai";
import { toFixed } from "@Utils/NumString";
import { multiply } from "@Utils/NumString/stringArithmatics";




export const useIndexMarketInteractionCalls = (data: IMuchoTokenMarketData) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(data.contract, MuchoIndexMarketABI);
  //console.log("Write contract", V2USER_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultABI)
  const toastify = useToast();
  const [, setPageState] = useAtom(indexAtom);

  function callBack(res) {
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  function validations(amount) {
    if (!amount || amount === '0' || amount === '') {
      toastify({
        type: 'error',
        msg: 'Please enter a positive number.',
        id: 'invalidNumber',
      });
      return true;
    }
  }

  function buyCall(amount: string) {
    if (validations(amount)) return;
    console.log("Buying", [toFixed(multiply(amount, data.buyTokenDecimals), 0)])
    writeCall(callBack, "buyOrder", [toFixed(multiply(amount, data.buyTokenDecimals), 0)]);
  }

  function sellCall(amount: string) {
    if (validations(amount)) return;
    console.log("Selling", [toFixed(multiply(amount, data.mTokenDecimals), 0)])
    writeCall(callBack, "sellOrder", [toFixed(multiply(amount, data.mTokenDecimals), 0)]);
  }

  function cancelBuyCall(id: number) {
    console.log("Cancelling buy", [id])
    writeCall(callBack, "cancelBuyOrder", [id]);
  }

  function cancelSellCall(id: number) {
    console.log("Cancelling sell", [id])
    writeCall(callBack, "cancelSellOrder", [id]);
  }

  return {
    validations,
    buyCall,
    sellCall,
    cancelBuyCall,
    cancelSellCall
  };
};