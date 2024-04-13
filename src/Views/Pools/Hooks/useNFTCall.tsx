import MuchoBadgeManagerAbi from '../Config/Abis/MuchoBadgeManager.json';
import { Chain, useContractRead } from 'wagmi';
import { useUserAccount } from '@Hooks/useUserAccount';
import { POOLS_BADGE_CONFIG } from '../Config/PoolsBadgeConfig';
import { useContext } from 'react';
import { PoolsContext } from '..';

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';



export const useGetUserHasNFT = (plans: number[]) => {
  //console.log("useGetPlans");
  const { address: account } = useUserAccount();
  let activeChain: Chain | null = null;
  const poolContextValue = useContext(PoolsContext);
  let call = {};
  //console.log("poolContextValue", poolContextValue);
  if (poolContextValue) {
    activeChain = poolContextValue.activeChain;
    const badge_config: (typeof POOLS_BADGE_CONFIG)[42161] = POOLS_BADGE_CONFIG[activeChain.id];

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

  //console.log("Data", data);

  if (data && data[0]) {
    for (const p of data) {
      if (plans.indexOf(Number(p.id)) >= 0) {
        return true;
      }
    }
  }


  return false;

};