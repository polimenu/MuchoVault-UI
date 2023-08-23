import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { multiply } from '@Utils/NumString/stringArithmatics';
import MuchoVaultABI from '../Config/Abis/MuchoVault.json'
import { useAtom } from 'jotai';
import { toFixed } from '@Utils/NumString';
import { useContext } from 'react';
import { ViewContext } from '..';
import { V2USER_CONFIG } from '../Config/v2UserConfig';
import { v2ContractDataAtom } from '../v2AdminAtom';



export const useVaultInteractionCalls = (vaultId: number, decimals: number) => {
  const { activeChain } = useContext(ViewContext);
  const { writeCall } = useWriteCall(V2USER_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultABI);
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

  function depositCall(amount: string) {
    if (validations(amount)) return;
    console.log("Depositing", [vaultId, toFixed(multiply(amount, decimals), 0)])
    writeCall(callBack, "deposit", [vaultId, toFixed(multiply(amount, decimals), 0)]);
  }

  function withdrawCall(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, "withdraw", [vaultId, toFixed(multiply(amount, decimals), 0)]);
  }

  return {
    validations,
    depositCall,
    withdrawCall
  };
};