import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import MuchoNFTABI from '../Config/Abis/MuchoNFT.json'
import MuchoNFTFetcherABI from '../Config/Abis/MuchoNFTFetcher.json'
import { useAtom } from 'jotai';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import { writeBadgeAtom } from '../badgeAtom';
import { useContext } from 'react';
import { BadgeContext } from '..';
import { IPrice } from '../badgeAtom';
import { useUserAccount } from '@Hooks/useUserAccount';



export const usePlanEditCalls = (nftAddress: string) => {
  const { writeCall } = useWriteCall(nftAddress, MuchoNFTABI);
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

  function updatePlanCall(name: string, duration: number, subPrice: IPrice, renPrice: IPrice) {
    const req = [name, "", duration * 24 * 3600, { token: subPrice.contract, amount: Math.round(subPrice.amount * (10 ** subPrice.decimals)) },
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

export const usePlanUserCalls = (nftAddress: string) => {
  const { writeCall } = useWriteCall(nftAddress, MuchoNFTABI);
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

  function subscribeUserCall() {
    writeCall(callBack, "subscribe(uint256)", []);
  }

  function renewUserCall() {
    writeCall(callBack, "renew(uint256)", []);
  }

  return {
    subscribeUserCall,
    renewUserCall
  };

}

export const useSalePlanUserCalls = () => {
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[42161]; //Todo multichain

  const { writeCall } = useWriteCall(badge_config.MuchoNFTFetcher, MuchoNFTFetcherABI);
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

  function subscribeUserCall(idNFT: string, metadata: string) {
    writeCall(callBack, "subscribe", [idNFT, metadata]);
  }


  return {
    subscribeUserCall
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
  const { writeCall: writeCallWrapper } = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoBadgeWrapper, MuchoBadgeWrapperABI);
  const { writeCall } = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoBadgeManager, MuchoBadgeManagerABI);
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

  function subCall(id: number, sub: string, cBack: any) {
    //console.log("Sending call");
    const cb = (cBack ? cBack : callBack);
    writeCallWrapper(callBack, "subscribe(uint256,address)", [id, sub]);
  }

  function renewCall(id: number, sub: string) {
    //console.log("Sending call");
    writeCallWrapper(callBack, "renew(uint256,address)", [id, sub]);
  }

  function subBulkCall(id: number, subs: string[]) {
    writeCallWrapper(callBack, "bulkSubscribe", [id, subs]);
  }

  return {
    unsubCall,
    subCall,
    renewCall,
    subBulkCall
  };
};
