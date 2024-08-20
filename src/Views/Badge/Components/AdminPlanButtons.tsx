import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { BadgeContext } from '..';
import { IPlanDetailed, badgeAtom } from '../badgeAtom';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { usePlanEnableDisableCalls } from '../Hooks/usePlanWriteCalls';
import { NULL_ACCOUNT } from '@Views/Common/Utils';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7 ml-auto';


export function AdminPlanButtons({ plan }: { plan: IPlanDetailed }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(badgeAtom);
  const { activeChain } = useContext(BadgeContext);
  const { chain } = useNetwork();

  const { disablePlanCall, enablePlanCall } = usePlanEnableDisableCalls(plan.planAttributes.nftAddress);

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  return (<>
    <div className="flex gap-5 mt-5">

      <BlueBtn
        onClick={() =>
          plan.planAttributes.enabled ? disablePlanCall(plan.id) : enablePlanCall(plan.id)
        }
        className={btnClasses}
      >
        {plan.planAttributes.enabled ? "Disable" : "Enable"} Plan
      </BlueBtn>
      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "subscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Subscribe
      </BlueBtn>
      {plan.pricing && plan.pricing.contract && plan.pricing.contract != NULL_ACCOUNT && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { pricing: plan.pricing, action: "discount" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        User Subscriber Discount
      </BlueBtn>}
    </div>
    <div className="flex gap-5 mt-5">
      {plan.renewalPricing && plan.renewalPricing.contract && plan.renewalPricing.contract != NULL_ACCOUNT && <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { pricing: plan.renewalPricing, action: "discount" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        User Renewal Discount
      </BlueBtn>}

      <BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "tokenIdAction" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Token ID Actions
      </BlueBtn>

      {/*<BlueBtn
        onClick={() =>
          setPageState({ ...state, activeModal: { plan: plan, action: "bulkSubscribe" }, isModalOpen: true })
        }
        className={btnClasses}
      >
        Bulk sub to
      </BlueBtn>*/}
    </div ></>
  );

}