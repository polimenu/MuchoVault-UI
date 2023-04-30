import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { multiply } from '@Utils/NumString/stringArithmatics';
import MuchoBadgeManagerABI from '../Config/Abis/MuchoBadgeManager.json'
import { useAtom } from 'jotai';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import { writeBadgeAtom } from '../badgeAtom';
import { toFixed } from '@Utils/NumString';
import { useContext } from 'react';
import { BadgeContext } from '..';
import { IPrice } from '../badgeAtom';



export const usePlanEditCalls = () => {
  const { activeChain } = useContext(BadgeContext);
  const { writeCall } = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoBadgeManager, MuchoBadgeManagerABI);
  const toastify = useToast();
  const [, setPageState] = useAtom(writeBadgeAtom);

  function callBack(res) {
    //console.log("updatePlan:");
    //console.log(res);
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  function updatePlanCall(id: number, name: string, duration: number, subPrice: IPrice, renPrice: IPrice) {
    const req = [id, name, "", duration * 24 * 3600, { token: subPrice.contract, amount: Math.round(subPrice.amount * (10 ** subPrice.decimals)) },
      { token: renPrice.contract, amount: Math.round(renPrice.amount * (10 ** renPrice.decimals)) }, true];
    //console.log("updatePlan request:");
    //console.log(req);
    writeCall(callBack, "updatePlan", req);
  }

  function addPlanCall(name: string, duration: number, subPrice: IPrice, renPrice: IPrice) {
    const req = [name, "", duration * 24 * 3600, { token: subPrice.contract, amount: Math.round(subPrice.amount * (10 ** subPrice.decimals)) },
      { token: renPrice.contract, amount: Math.round(renPrice.amount * (10 ** renPrice.decimals)) }, true];
    //console.log("updatePlan request:");
    //console.log(req);
    writeCall(callBack, "addPlan", req);
  }

  return {
    updatePlanCall,
    addPlanCall
  };
};

export const usePlanUserCalls = () => {
  const { activeChain } = useContext(BadgeContext);
  const { writeCall } = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoBadgeManager, MuchoBadgeManagerABI);
  const toastify = useToast();
  const [, setPageState] = useAtom(writeBadgeAtom);

  function callBack(res) {
    //console.log("updatePlan:");
    //console.log(res);
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  function subscribeUserCall(id: number) {
    writeCall(callBack, "subscribe(uint256)", [id]);
  }

  function renewUserCall(id: number) {
    writeCall(callBack, "renew(uint256)", [id]);
  }

  return {
    subscribeUserCall,
    renewUserCall
  };

}

export const usePlanEnableDisableCalls = () => {
  const { activeChain } = useContext(BadgeContext);
  const { writeCall } = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoBadgeManager, MuchoBadgeManagerABI);
  const toastify = useToast();
  const [, setPageState] = useAtom(writeBadgeAtom);

  function callBack(res) {
    //console.log("updatePlan:");
    //console.log(res);
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  function disablePlanCall(id: number) {
    writeCall(callBack, "disablePlan", [id]);
  }

  function enablePlanCall(id: number) {
    writeCall(callBack, "enablePlan", [id]);
  }

  return {
    disablePlanCall,
    enablePlanCall
  };
};


export const usePlanSubUnsubCalls = () => {
  const { activeChain } = useContext(BadgeContext);
  const { writeCall } = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoBadgeManager, MuchoBadgeManagerABI);
  const toastify = useToast();
  const [, setPageState] = useAtom(writeBadgeAtom);

  function callBack(res) {
    //console.log("updatePlan:");
    //console.log(res);
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  function unsubCall(id: number, sub: string) {
    //console.log("Sending call");
    writeCall(callBack, "cancelSubscription", [id, sub]);
  }

  function subCall(id: number, sub: string) {
    //console.log("Sending call");
    writeCall(callBack, "subscribe(uint256,address)", [id, sub]);
  }

  function renewCall(id: number, sub: string) {
    //console.log("Sending call");
    writeCall(callBack, "renew(uint256,address)", [id, sub]);
  }

  return {
    unsubCall,
    subCall,
    renewCall
  };
};
