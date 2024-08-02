import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { DEPRECATED_IPlan, IPlanDetailed, badgeAtom } from '../badgeAtom';
import { useTokenIdActionCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';
import Web3 from 'web3';
import { useToast } from '@Contexts/Toast';



export const SubModal = ({ mode }: { mode: string }) => {

  const [pageState] = useAtom(badgeAtom);
  const plan: IPlanDetailed = pageState.activeModal.plan;
  const { subCall, unsubCall, renewCall, subBulkCall } = useTokenIdActionCalls(plan);

  const modalConfig = {
    "subscribe": {
      call: subCall,
      title: "Subscribe",
      isBulk: false
    },
    "bulkSubscribe": {
      call: subBulkCall,
      title: "Bulk Subscribe",
      isBulk: true
    }
  }

  return (
    <SubSub plan={plan} call={modalConfig[mode].call} buttonTitle={modalConfig[mode].title} isBulk={modalConfig[mode].isBulk} />
  );

};

const SubSub = ({ call, buttonTitle, isBulk }: { call: any, buttonTitle: string, isBulk: boolean }) => {

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");

  const { state } = useGlobal();
  //const toastify = useToast();
  const clickHandler = () => {
    //const addrs = isBulk ? address.split("\n") : [address];
    //console.log("addr", addrs);
    /*for (var i in addrs) {
      if (!Web3.utils.isAddress(addrs[i])) {
        toastify({
          type: 'error',
          msg: `Please enter a valid address (${addrs[i]})`,
          id: 'invalidAddress',
        });
        return false;
      }
    }*/
    const metaData = { name, surname, email, discord }

    //console.log("Calling"); console.log(planId); console.log(subscriber); console.log(call);
    call(address, metaData);
  }


  return (
    <>
      <div className={isBulk ? "w-[40vw]" : ""}>
        <div className="text-f15 mb-5">{buttonTitle}</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Address</span>
            </div>
          }
          placeholder="0x..."
          bgClass={isBulk ? "!bg-1 h-[20vw]" : "!bg-1"}
          ipClass={isBulk ? "!text-f12 mt-1 h-full" : "mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={address}
          onChange={(val) => {
            setAddress(val);
          }}
        />
        <br />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Name</span>
            </div>
          }
          placeholder=""
          bgClass={isBulk ? "!bg-1 h-[20vw]" : "!bg-1"}
          ipClass={isBulk ? "!text-f12 mt-1 h-full" : "mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={name}
          onChange={(val) => {
            setName(val);
          }}
        />
        <br />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Last name</span>
            </div>
          }
          placeholder=""
          bgClass={isBulk ? "!bg-1 h-[20vw]" : "!bg-1"}
          ipClass={isBulk ? "!text-f12 mt-1 h-full" : "mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={surname}
          onChange={(val) => {
            setSurname(val);
          }}
        />
        <br />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>E-mail</span>
            </div>
          }
          placeholder=""
          bgClass={isBulk ? "!bg-1 h-[20vw]" : "!bg-1"}
          ipClass={isBulk ? "!text-f12 mt-1 h-full" : "mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={email}
          onChange={(val) => {
            setEmail(val);
          }}
        />
        <br />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Discord</span>
            </div>
          }
          placeholder=""
          bgClass={isBulk ? "!bg-1 h-[20vw]" : "!bg-1"}
          ipClass={isBulk ? "!text-f12 mt-1 h-full" : "mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={discord}
          onChange={(val) => {
            setDiscord(val);
          }}
        />
      </div>
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isDisabled={state.txnLoading > 1}
          isLoading={state.txnLoading === 1}
        >
          {buttonTitle}
        </BlueBtn>
      </div>
    </>
  );
};