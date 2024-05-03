import MuchoBadgeManagerAbi from '../Config/Abis/MuchoBadgeManager.json';
import { Chain, useContractRead } from 'wagmi';
import { useUserAccount } from '@Hooks/useUserAccount';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import { useContext } from 'react';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';



export const useGetUserHasNFT = (plans: number[], activeChain?: Chain) => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let call = {};
  //console.log("poolContextValue", poolContextValue);
  if (activeChain) {
    const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[activeChain.id];

    if (account) {
      call = {
        address: badge_config.MuchoBadgeManager,
        abi: MuchoBadgeManagerAbi,
        functionName: 'activePlansForUser',
        chainId: activeChain.id,
        args: [account],
        watch: true,
      }

    }
  }
  // const { state } = useGlobal();

  const { data } = useContractRead(call);

  //console.log("USER NFT Data", data, call);

  if (data && data[0]) {
    for (const p of data) {
      if (plans.indexOf(Number(p.id)) >= 0) {
        return true;
      }
    }
  }


  return false;

};