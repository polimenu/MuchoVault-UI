import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { multiply } from '@Utils/NumString/stringArithmatics';
import MuchoVaultABI from '../Config/Abis/MuchoVault.json';
import OneInchRouterABI from '../Config/Abis/OneInchRouter.json';
import MuchoVaultV2ABI from '../../V2User/Config/Abis/MuchoVault.json';
import ERC20Abi from '../../V2User/Config/Abis/ERC20Ext.json';
import { EARN_CONFIG } from '../Config/Pools';
import { useAtom } from 'jotai';
import { writeEarnAtom } from '../earnAtom';
import { toFixed } from '@Utils/NumString';
import { useContext } from 'react';
import { EarnContext } from '..';
import { V2USER_CONFIG } from '@Views/V2User/Config/v2UserConfig';
import { ethers } from 'ethers';


export const useMigrateCalls = (vaultId: number, decimals: number, tokenV1: string, tokenV2: string, amountV1: number,
  muchoExchange: number, setMessage: any, message: any, tokenV1Symbol: string, tokenV2Symbol: string) => {

  const oneInchRouter = "0x1111111254eeb25477b68fb85ed929f73a960582";
  const poolsUSDC = ethers.BigNumber.from("57896044618658097711785492505155552572300217634473549675956596850192752458047");

  const { activeChain } = useContext(EarnContext);
  const { writeCall } = useWriteCall(EARN_CONFIG[activeChain?.id].MuchoVault, MuchoVaultABI);
  const writeCallV2 = useWriteCall(V2USER_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultV2ABI).writeCall;
  const writeCallTV1 = useWriteCall(tokenV1, ERC20Abi).writeCall;
  const writeCallTV2 = useWriteCall(tokenV2, ERC20Abi).writeCall;
  const writeCallOneInch = useWriteCall(oneInchRouter, OneInchRouterABI).writeCall;

  const toastify = useToast();
  const [, setPageState] = useAtom(writeEarnAtom);

  function lastCallBack(res) {
    if (res.payload) {
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
    }
    else {
      addMessage(<>Error!</>);
    }
  }

  const amountM = amountV1.toString();
  let amount = (amountV1 * muchoExchange).toString();
  const amountMin = (amountV1 * muchoExchange * 0.999).toString();

  //console.log("Amounts", amountM, amount, amountMin);

  const addMessage = (msg: any) => {
    message = <>{message}&nbsp;{msg}</>;
    setMessage(message);
  }

  function withdrawCall() {
    message = <>Withdrawing {amount} {tokenV1Symbol} from V1 Vault...</>;
    setMessage(message);
    const nextCall = (tokenV1 == tokenV2) ? approveV2Call : approveSwapCall;

    writeCall(nextCall, "leave", [toFixed(multiply(amountM, 18), 0), vaultId]);
  }

  //ethers.BigNumber.from(
  //"0x8e295789c9465487074a65b1ae9ce0351172393f"

  function approveSwapCall(res) {
    if (res.payload) {
      addMessage(<>OK! <br />Approving swap from {tokenV1Symbol} to {tokenV2Symbol}...</>);
      writeCallTV1(swapCall, "approve", [oneInchRouter, toFixed(multiply(amount, decimals), 0)]);
    }
    else {
      addMessage(<>Error!</>);
    }
  }

  function swapCall(res) {
    if (res.payload) {
      addMessage(<>OK! <br />Swapping from {tokenV1Symbol} to {tokenV2Symbol}...</>);
      const args = [toFixed(multiply(amount, decimals), 0), toFixed(multiply(amountMin, decimals), 0), [poolsUSDC]];
      //console.log("swap args", args);
      writeCallOneInch(approveV2Call, "uniswapV3Swap", args, { value: 0 });
    }
    else {
      addMessage(<>Error!</>);
    }
  }

  function approveV2Call(res) {
    if (res.payload) {
      console.log("Last res", res);
      amount = getAmountToDeposit(res.payload.res) / 10 ** decimals;
      addMessage(<>OK! <br />Approving V2 deposit...</>);
      writeCallTV2(depositV2Call, "approve", [V2USER_CONFIG[activeChain?.id].MuchoHub.contract, toFixed(multiply(amount, decimals), 0)]);
    }
    else {
      addMessage(<>Error!</>);
    }
  }

  function depositV2Call(res) {

    if (res.payload) {
      addMessage(<>OK! <br />Depositing {amount} {tokenV2Symbol} into V2 vault...</>);
      writeCallV2(lastCallBack, "deposit", [vaultId, toFixed(multiply(amount, decimals), 0)]);
    }
    else {
      addMessage(<>Error!</>);
    }
  }


  return {
    withdrawCall
  };
};

function getAmountToDeposit(res) {
  const userAddress = res.from.replace("0x", "0x000000000000000000000000");
  const erc20transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  console.log("Looking for transaction to", erc20transfer, userAddress, res);

  //sum all transfers of tokenv2 to user
  if (res.logs) {
    let amount = ethers.BigNumber.from("0");
    for (var i = 0; i < res.logs.length; i++) {
      const log = res.logs[i];
      if (log.topics && log.topics[0] == erc20transfer && log.topics[2].toUpperCase() == userAddress.toUpperCase()) {
        console.log("found!", log.data);
        amount = amount.add(log.data);
      }
    }

    console.log("Final amount", amount);
    return amount;
  }
  else
    return 0;
}

export const useEarnWriteCalls = (vaultId: number, decimals: number) => {
  const { activeChain } = useContext(EarnContext);
  const { writeCall } = useWriteCall(EARN_CONFIG[activeChain?.id].MuchoVault, MuchoVaultABI);
  const toastify = useToast();
  const [, setPageState] = useAtom(writeEarnAtom);

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

  function depositCall(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, "enter", [toFixed(multiply(amount, decimals), 0), vaultId]);
  }

  function withdrawCall(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, "leave", [toFixed(multiply(amount, 18), 0), vaultId]);
  }

  return {
    validations,
    depositCall,
    withdrawCall
  };
};