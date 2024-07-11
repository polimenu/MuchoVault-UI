import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { BadgeContext } from '../sale';
import { IPlan, badgeAtom } from '../badgeAtom';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { usePlanEnableDisableCalls } from '../Hooks/usePlanWriteCalls';
import { t } from 'i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';

const CLOSED_PLANS = [1, 5];

export function SalePlanButtons({ data }: { data: any }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(badgeAtom);
  const { activeChain } = useContext(BadgeContext);
  const { chain } = useNetwork();

  //console.log("*******DRAWING PLAN BUTTONS*****", plan.id, CLOSED_PLANS, CLOSED_PLANS.find(p => p == plan.id));

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  return (
    <div className={`${btnClasses} flex gap-5 m-auto`}>
      {data.userBalance == 0 && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { saleData: data, action: "saleSubscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        {data.planAttributes.planName == "NFT Baby Scout" ? "Inscribirme a la formación Baby Scout Verano 2024" :
          data.planAttributes.planName == "NFT Membresía" ? "Inscribirme para tener acceso a TODAS las formaciones" : ""}
      </BlueBtn>}
      {data.userBalance > 0 && <BlueBtn
        onClick={() => { }}
        isDisabled={true}
        className={btnClasses}
      >
        ¡Enhorabuena, ya estás suscrito!
      </BlueBtn>}
    </div >
  );

}
