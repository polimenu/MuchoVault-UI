import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlanDetailed, badgeAtom } from '../badgeAtom';
import { usePlanEditCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';



export const EditDurationModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const plan = activeModal.plan;
  const { updateDurationcall } = usePlanEditCalls(plan);

  return (
    <EditDuration head={`Editing plan [${plan.id}] - ${plan.planAttributes.planName}`} plan={plan} call={updateDurationcall} />
  );

};

const EditDuration = ({ call, head, plan }: { call: any, head: string, plan: IPlanDetailed }) => {

  //const toastify = useToast();
  const { state } = useGlobal();

  const [duration, setDuration] = useState(plan ? plan.planAttributes.duration : "");

  const clickHandler = () => {
    return call(duration);
  };

  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Duration (days)</span>
          </div>
        }
        placeholder={"99"}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={duration}
        onChange={(val) => {
          setDuration(val);
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