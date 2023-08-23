import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { V2AdminContract, ViewContext } from '..';
import { IActiveModal, v2ContractDataAtom } from '../v2AdminAtom';
import { useWriteCall } from '@Hooks/useWriteCall';
import MuchoVaultAbi from '../Config/Abis/MuchoVault.json';
import MuchoHubAbi from '../Config/Abis/MuchoHub.json';
import MuchoGmxAbi from '../Config/Abis/MuchoProtocolGmx.json';
import { V2ADMIN_CONFIG } from '../Config/v2AdminConfig';

export const V2AdminSetModal = ({
  head
}: {
  head: string;
}) => {

  const [pageState] = useAtom(v2ContractDataAtom);
  const activeModal = pageState.activeModal;
  const { activeChain } = useContext(ViewContext);


  let contract = V2ADMIN_CONFIG[activeChain?.id].MuchoVault.contract;
  let abi = MuchoVaultAbi;
  switch (activeModal.contract) {
    case V2AdminContract.MuchoHub:
      contract = V2ADMIN_CONFIG[activeChain?.id].MuchoHub.contract;
      abi = MuchoHubAbi;
      break;

    case V2AdminContract.MuchoProtocolGmx:
      contract = V2ADMIN_CONFIG[activeChain?.id].MuchoProtocolGmx.contract;
      abi = MuchoGmxAbi;
      break;

  }

  //Special modals
  switch (activeModal.functionName) {
    case "moveInvestment":
      return <MoveInvestmentModal head={head} params={activeModal} />

  }

  return (
    <SetValue head={head} params={activeModal} contract={contract} abi={abi} />
  );
};

const ValueHandler = ({ val, setVal, head, currentValue, unit, name = "New value" }) => {
  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>{name}</span>
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

const SetValue = ({ head, params, contract, abi }: { head: string, params: IActiveModal, contract: string, abi: any }) => {
  //console.log("DEPOSIT CALL:"); console.log(call);
  const [val, setVal] = useState('');
  const [, setPageState] = useAtom(v2ContractDataAtom);
  const { state } = useGlobal();
  const { writeCall } = useWriteCall(contract, abi);
  const toastify = useToast();
  //console.log("Contract", contract);
  //console.log("ABI", abi);


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

const MoveInvestmentModal = ({ head, params }: { head: string, params: IActiveModal }) => {
  //console.log("DEPOSIT CALL:"); console.log(call);
  const [valTk, setValTk] = useState('');
  const [valAm, setValAm] = useState('');
  const [valSrc, setValSrc] = useState('');
  const [valDest, setValDest] = useState('');
  const { activeChain } = useContext(ViewContext);
  const [, setPageState] = useAtom(v2ContractDataAtom);
  const { state } = useGlobal();
  const { writeCall } = useWriteCall(V2ADMIN_CONFIG[activeChain?.id].MuchoHub.contract, MuchoHubAbi);
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
    const valid = params.validations([valTk, valAm, valSrc, valDest]);
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
        head={"Move Investment"}
        val={valTk}
        setVal={setValTk}
        currentValue={params.currentValue}
        unit={params.unit}
        name="Token"
      />
      <ValueHandler
        head={""}
        val={valAm}
        setVal={setValAm}
        currentValue={params.currentValue}
        unit={params.unit}
        name="Amount"
      />
      <ValueHandler
        head={""}
        val={valSrc}
        setVal={setValSrc}
        currentValue={params.currentValue}
        unit={params.unit}
        name="Prot. Source"
      />
      <ValueHandler
        head={""}
        val={valDest}
        setVal={setValDest}
        currentValue={params.currentValue}
        unit={params.unit}
        name="Prot. Destination"
      />
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isLoading={state.txnLoading === 1}
        >
          Move Investment
        </BlueBtn>
      </div>
    </>
  );
};

