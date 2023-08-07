import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { ViewContext } from '..';
import { IActiveModal, v2ContractDataAtom } from '../v2AdminAtom';
import { useWriteCall } from '@Hooks/useWriteCall';
import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';

export const V2AdminSetModal = ({
  head
}: {
  head: string;
}) => {

  const [pageState] = useAtom(v2ContractDataAtom);
  const activeModal = pageState.activeModal;

  return (
    <SetValue head={head} params={activeModal} />
  );
};

const ValueHandler = ({ val, setVal, head, currentValue, unit }) => {
  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>New value</span>
          </div>
        }
        placeholder={currentValue}
        bgClass="!bg-1"
        ipClass="mt-1"
        value={val}
        onChange={(val) => {
          setVal(val);
        }}
        unit={unit}
      />
    </div>
  );
};

const SetValue = ({ head, params }: { head: string, params: IActiveModal }) => {
  //console.log("DEPOSIT CALL:"); console.log(call);
  const [val, setVal] = useState('');
  const { activeChain } = useContext(ViewContext);
  const [, setPageState] = useAtom(v2ContractDataAtom);
  const { state } = useGlobal();
  const { writeCall } = useWriteCall(V2ADMIN_CONFIG[activeChain?.id].MuchoVault.contract, MuchoVaultAbi);
  const toastify = useToast();
  //console.log("Contract", V2ADMIN_CONFIG[activeChain?.id].MuchoVault);
  //console.log("ABI", MuchoVaultAbi);


  const callBack = (res) => {
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }

  const clickHandler = () => {
    //console.log("Clickhandler", params.validations);
    const valid = params.validations(val);
    if (valid.error) {
      toastify(valid.toastifyMessage);
      return;
    }
    const args = [...params.args, valid.valueToSC];
    //console.log("Clickhandler fname", params.functionName);
    //console.log("Clickhandler args", args);
    return writeCall(callBack, params.functionName, args);
  };


  return (
    <>
      <ValueHandler
        head={head}
        val={val}
        setVal={setVal}
        currentValue={params.currentValue}
        unit={params.unit}
      />
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isLoading={state.txnLoading === 1}
        >
          Set
        </BlueBtn>
      </div>
    </>
  );
};

