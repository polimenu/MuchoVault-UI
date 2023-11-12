import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { multiply } from '@Utils/NumString/stringArithmatics';
import AirdopManagerAbi from '../Config/Abis/mAirdropManager.json'
import { useAtom } from 'jotai';
import { toFixed } from '@Utils/NumString';
import { useContext } from 'react';
import { ViewContext } from '..';
import { MAIDROP_CONFIG } from '../Config/mAirdropConfig';
import { IMuchoAirdropDataPrice, IMuchoAirdropManagerData, v2ContractDataAtom } from '../AirdropAtom';



export const useAirdropInteractionCalls = (data: IMuchoAirdropDataPrice) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(MAIDROP_CONFIG[activeChain?.id].ManagerContract, AirdopManagerAbi);
  //console.log("Write contract", V2USER_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultABI)
  const toastify = useToast();
  const [, setPageState] = useAtom(v2ContractDataAtom);

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
    writeCall(callBack, "deposit", [data.priceTokenAddress, toFixed(multiply(amount, data.priceTokenDecimals), 0)]);
  }


  return {
    buyCall
  };
}