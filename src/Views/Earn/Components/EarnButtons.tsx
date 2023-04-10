import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { EarnContext } from '..';
import { IPoolInfo, earnAtom, readEarnData } from '../earnAtom';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

export function EarnButtons({ poolInfo, primaryToken, vaultId, decimals, precision }: { poolInfo: IPoolInfo, primaryToken: string, vaultId: number, decimals: number, precision: number }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(earnAtom);
  const { activeChain } = useContext(EarnContext);
  const { chain } = useNetwork();

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  return (
    <div className="flex gap-5">
      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { poolInfo, primaryToken, vaultId, decimals, deposit: true, precision }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Deposit
      </BlueBtn>
      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { poolInfo, primaryToken, vaultId, decimals, deposit: false, precision }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Withdraw
      </BlueBtn>
    </div>
  );

}
