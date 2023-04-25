import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { BadgeContext } from '..';
import { IPlan, badgeAtom } from '../badgeAtom';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

export function PlanButtons({ plan }: { plan: IPlan }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(badgeAtom);
  const { activeChain } = useContext(BadgeContext);
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
          setPageState({ ...state, activeModal: { plan: plan, action: "edit" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Edit
      </BlueBtn>
    </div>
  );

}
