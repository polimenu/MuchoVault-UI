import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import MuchoBadgeManagerABI from '../Config/Abis/MuchoBadgeManager.json'
import MuchoNFTFetcherABI from '../Config/Abis/MuchoNFTFetcher.json'
import MuchoRewardRouterABI from '../Config/Abis/MuchoRewardRouter.json'
import MuchoNFTAbi from '../Config/Abis/MuchoNFT.json'
import MuchoPricingAbi from '../Config/Abis/MuchoPricing.json'
import { useAtom } from 'jotai';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import { DEPRECATED_IPlan, IPlanDetailed, writeBadgeAtom, IPlanPricingData } from '../badgeAtom';
import { useContext } from 'react';
import { BadgeContext } from '..';
import { useUserAccount } from '@Hooks/useUserAccount';
import { fromDateYYYYMMDDhhmmss } from '@Views/Common/Utils';


export const usePricingEditCalls = (pricing: IPlanPricingData) => {
  const { writeCall: writePricingCall } = useWriteCall(pricing.contract, MuchoPricingAbi);
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


  const updatePricingToken = (tokenAddress: string) => {
    writePricingCall(callBack, "setToken", [tokenAddress]);
  }
  const updatePriceIni = (price: number) => {
    writePricingCall(callBack, "setPriceRampIni", [price * 10 ** pricing.userPrice.decimals]);
  }
  const updatePriceEnd = (price: number) => {
    writePricingCall(callBack, "setPriceRampEnd", [price * 10 ** pricing.userPrice.decimals]);
  }
  const updateIni = (dt: string) => {
    writePricingCall(callBack, "setDateIni", [Math.floor(fromDateYYYYMMDDhhmmss(dt).getTime() / 1000)]);
  }
  const updateEnd = (dt: string) => {
    writePricingCall(callBack, "setDateEnd", [Math.floor(fromDateYYYYMMDDhhmmss(dt).getTime() / 1000)]);
  }
  const updateRampIni = (dt: string) => {
    writePricingCall(callBack, "setDateRampIni", [Math.floor(fromDateYYYYMMDDhhmmss(dt).getTime() / 1000)]);
  }
  const updateRampEnd = (dt: string) => {
    writePricingCall(callBack, "setDateRampEnd", [Math.floor(fromDateYYYYMMDDhhmmss(dt).getTime() / 1000)]);
  }
  const updateDiscountCall = (address: string, discType: number, disc: number) => {
    if (discType == 1) {
      disc = Math.floor(disc * 100)
    }
    else if (discType == 0) {
      disc = disc * 10 ** pricing.userPrice.decimals;
    }
    console.log("disc", address, discType, disc);
    writePricingCall(callBack, "setUserDiscount", [address, [discType, disc]]);
  }

  return {
    updatePricingToken,
    updatePriceIni,
    updatePriceEnd,
    updateIni,
    updateEnd,
    updateRampIni,
    updateRampEnd,
    updateDiscountCall
  };
};

export const usePlanEditCalls = (plan: DEPRECATED_IPlan) => {
  const { writeCall: writeNFTCall } = useWriteCall(plan.address, MuchoNFTAbi);
  const { writeCall: writeSubPricingCall } = useWriteCall(plan.subscriptionPricing.contract, MuchoPricingAbi);
  const { writeCall: writeRenPricingCall } = useWriteCall(plan.renewalPricing.contract, MuchoPricingAbi);
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


  const updateNameCall = (name: string) => {
    writeNFTCall(callBack, "setPlanName", [name]);
  }

  const updateDurationcall = (days: Number) => {
    writeNFTCall(callBack, "setDuration", [days * 24 * 60 * 60]);
  }

  return {
    updateNameCall,
    updateDurationcall,
  };
};

export const usePlanUserCalls = () => {
  const { activeChain } = useContext(BadgeContext);
  const { address: account } = useUserAccount();
  const { writeCall } = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoBadgeManager, MuchoBadgeManagerABI);
  const writeCallRR = useWriteCall(BADGE_CONFIG[activeChain?.id].MuchoRewardRouter, MuchoRewardRouterABI).writeCall;
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

export const usePlanEnableDisableCalls = (nftAddress) => {
  const { writeCall } = useWriteCall(nftAddress, MuchoNFTAbi);
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
    writeCall(callBack, "setEnabled", [false]);
  }

  function enablePlanCall(id: number) {
    writeCall(callBack, "setEnabled", [true]);
  }

  return {
    disablePlanCall,
    enablePlanCall
  };
};


export const useTokenIdActionCalls = (plan: IPlanDetailed) => {
  const nftAddress = plan.planAttributes.nftAddress;
  const { writeCall } = useWriteCall(nftAddress, MuchoNFTAbi);
  const [, setPageState] = useAtom(writeBadgeAtom);
  const { address: account } = useUserAccount();

  function callBack(res) {
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  function unsubCall(tokenId: number) {
    //console.log("Sending call");
    writeCall(callBack, "cancelSubscriptionTo", [tokenId]);
  }

  function subCall(address: string, metadata: any) {
    //console.log("Sending call");
    writeCall(callBack, "subscribeTo", [address, JSON.stringify(metadata)]);
  }

  function renewCall(tokenId: number) {
    //console.log("Sending call");
    writeCall(callBack, "renewTo", [tokenId]);
  }

  function changeExpirationCall(tokenId: number, dateExpiration: string) {
    //console.log("Sending call");
    const dtExp = fromDateYYYYMMDDhhmmss(dateExpiration + " 00:01:00");
    writeCall(callBack, "changeExpiration", [tokenId, dtExp.getTime() / 1000]);
  }

  function subBulkCall(address: string[], metadata: any[]) {
    writeCall(callBack, "bulkSubscribeTo", [address, metadata.map(m => JSON.stringify(m))]);
  }

  function transferCall(tokenId: number, address: string) {
    //console.log("Sending call");
    writeCall(callBack, "transferFrom", [account, address, tokenId]);
  }

  return {
    unsubCall,
    subCall,
    renewCall,
    changeExpirationCall,
    subBulkCall,
    transferCall
  };
};


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