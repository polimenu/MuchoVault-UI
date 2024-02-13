import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { multiply } from '@Utils/NumString/stringArithmatics';
import LauncherAbi from '../Config/Abis/mTokenLauncher.json'
import { useAtom } from 'jotai';
import { toFixed } from '@Utils/NumString';
import { useContext } from 'react';
import { ViewContext } from '..';
import { MINDEX_CONFIG } from '../Config/mIndexConfig';
import { IMuchoIndexDataPrice, indexAtom } from '../IndexAtom';



export const useLauncherInteractionCalls = (data: IMuchoIndexDataPrice) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(MINDEX_CONFIG[activeChain?.id].LauncherContract, LauncherAbi);
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
    //console.log("Depositing", [vaultId, toFixed(multiply(amount, decimals), 0)])
    writeCall(callBack, "buy", [data.priceTokenAddress, toFixed(multiply(amount, data.priceTokenDecimals), 0)]);
  }


  return {
    buyCall
  };
}