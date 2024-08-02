import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { DEPRECATED_IPlan, badgeAtom } from '../badgeAtom';
import { usePlanEditCalls } from '../Hooks/usePlanWriteCalls';
//import { EARN_CONFIG } from '../Config/Pools';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BadgeContext } from '..';
import { IContract } from 'src/Interfaces/interfaces';
import { TokenDropdown } from '@Views/Common/TokenDropdown';
import { VALID_TOKENS } from '../Config/BadgeConfig';



export const EditNameModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const plan = activeModal.plan;
  const { updateNameCall } = usePlanEditCalls(plan);

  return (
    <EditName head={`Editing plan [${plan.id}] - ${plan.name}`} plan={plan} call={updateNameCall} />
  );

};

const EditName = ({ call, head, plan }: { call: any, head: string, plan: DEPRECATED_IPlan }) => {

  //const toastify = useToast();
  const { state } = useGlobal();

  const [name, setName] = useState(plan ? plan.name : "");

  const clickHandler = () => {
    return call(name);
  };

  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Name</span>
          </div>
        }
        placeholder={plan ? plan.name : "Name"}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={name}
        onChange={(val) => {
          setName(val);
        }}
      />
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isDisabled={state.txnLoading > 1}
          isLoading={state.txnLoading === 1}
        >
          Save
        </BlueBtn>
      </div>
    </div>
  );
};