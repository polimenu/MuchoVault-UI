import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { BadgeContext } from '..';
import { IPlan, badgeAtom } from '../badgeAtom';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { usePlanEnableDisableCalls } from '../Hooks/usePlanWriteCalls';
import { useTranslation } from 'react-i18next';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';


export function PlanButtons({ plan }: { plan: IPlan }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(badgeAtom);
  const { activeChain } = useContext(BadgeContext);
  const { chain } = useNetwork();
  const { t } = useTranslation();

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  return (
    <div className={`${btnClasses} flex gap-5`}>
      {!plan.isActiveForCurrentUser && !plan.isExpiredForCurrentUser && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "subscribeUser" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        {t("badge.Subscribe")}
      </BlueBtn>}

      {plan.isExpiredForCurrentUser && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "renewUser" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        {t("badge.Renew")}
      </BlueBtn>}
    </div >
  );

}

export function PlanAdminButtons({ plan }: { plan: IPlan }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(badgeAtom);
  const { activeChain } = useContext(BadgeContext);
  const { chain } = useNetwork();

  const { disablePlanCall, enablePlanCall } = usePlanEnableDisableCalls(plan.id);

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  return (<>
    <div className="flex gap-5">
      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "edit" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Edit
      </BlueBtn>

      <BlueBtn
        onClick={() =>
          plan.enabled ? disablePlanCall(plan.id) : enablePlanCall(plan.id)
        }
        className={btnClasses}
      >
        {plan.enabled ? "Disable" : "Enable"}
      </BlueBtn>
    </div>
    <div className="flex gap-5 mt-5">
      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "subscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Sub to
      </BlueBtn>

      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "bulkSubscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Bulk sub to
      </BlueBtn>

      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "unsubscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Unsub to
      </BlueBtn>

      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "renew" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Renew to
      </BlueBtn>
    </div ></>
  );

}


export function AddPlanButton() {

  const [state, setPageState] = useAtom(badgeAtom);
  const { address: account } = useUserAccount();
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
          setPageState({ ...state, activeModal: { action: "add" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Add new plan
      </BlueBtn>

    </div>
  );
}