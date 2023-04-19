import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { multiply } from '@Utils/NumString/stringArithmatics';
import EarnRouterABI from '../Config/Abis/RewardRouterV2.json';
import VesterABI from '../Config/Abis/Vester.json';
import MuchoVaultABI from '../Config/Abis/MuchoVault.json'
import { EARN_CONFIG } from '../Config/Pools';
import { useAtom } from 'jotai';
import { writeEarnAtom } from '../earnAtom';
import { toFixed } from '@Utils/NumString';
import { useContext } from 'react';
import { EarnContext } from '..';



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

export const useGetApprovalAmount = (
  abi: any[],
  token_address: string,
  spender_address: string
  // user_amount?: string
) => {
  const { writeCall } = useWriteCall(token_address, abi);

  async function approve(amount, cb: (newState) => void) {
    cb(true);
    writeCall(
      (res) => {
        cb(false);
      },
      'approve',
      [spender_address, amount]
    );
  }


  return { approve };
};
