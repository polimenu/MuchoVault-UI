import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { badgeAtom } from '../badgeAtom';
import { usePlanDeployCall, } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';



export const DeployNFTModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const { deployNFTCall } = usePlanDeployCall();

  return (
    <DeployNFT head={`Deploy new NFT`} call={deployNFTCall} />
  );

};

const DeployNFT = ({ call, head }: { call: any, head: string }) => {

  //const toastify = useToast();
  const { state } = useGlobal();

  const [duration, setDuration] = useState("");
  const [nftName, setNFTName] = useState("");
  const [planName, setPlanName] = useState("");
  const [symbol, setSymbol] = useState("");

  const clickHandler = () => {
    return call(nftName, symbol, planName, duration);
  };

  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>NFT Name</span>
          </div>
        }
        placeholder={"MuchoNFT Membership"}
        bgClass="!bg-1 mb-5"
        ipClass="mt-1"
        value={nftName}
        onChange={(val) => {
          setNFTName(val);
        }}
      />
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>NFT Symbol</span>
          </div>
        }
        placeholder={"MUCHOMB"}
        bgClass="!bg-1 mb-5"
        ipClass="mt-1"
        value={symbol}
        onChange={(val) => {
          setSymbol(val);
        }}
      />
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Plan Name</span>
          </div>
        }
        placeholder={"Membresía + NFT"}
        bgClass="!bg-1 mb-5"
        ipClass="mt-1"
        value={planName}
        onChange={(val) => {
          setPlanName(val);
        }}
      />
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