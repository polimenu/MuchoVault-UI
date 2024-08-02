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



export const EditModal = ({ create }: { create: boolean }) => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const plan = activeModal.plan;
  const { updatePlanCall, addPlanCall } = usePlanEditCalls(plan ? plan.id : 0);

  return (
    <Edit head={create ? "Add plan" : `Editing plan [${plan.id}] - ${plan.name}`} plan={create ? null : plan} call={create ? addPlanCall : updatePlanCall} />
  );

};

const Edit = ({ call, head, plan }: { call: any, head: string, plan: DEPRECATED_IPlan }) => {
  const defaultPrice = Number(1000);

  //const toastify = useToast();
  const { state } = useGlobal();


  const [name, setName] = useState(plan ? plan.name : "");
  const [duration, setDuration] = useState(plan ? plan.time : "");
  const [subIniPrice, setIniSubPrice] = useState(plan ? plan.subscriptionPricing.priceRampIni : defaultPrice);
  const [renIniPrice, setIniRenPrice] = useState(plan ? plan.renewalPricing.priceRampIni : defaultPrice);
  const [subEndPrice, setEndSubPrice] = useState(plan ? plan.subscriptionPricing.priceRampEnd : defaultPrice);
  const [renEndPrice, setEndRenPrice] = useState(plan ? plan.renewalPricing.priceRampEnd : defaultPrice);

  const [iniDate, setIniDate] = useState(plan ? plan.subscriptionPricing.dateIni.toISOString().replace("T", " ").replace("Z", "").substr(0, 19) : "");
  const [endDate, setEndDate] = useState(plan ? plan.subscriptionPricing.dateEnd.toISOString().replace("T", " ").replace("Z", "").substr(0, 19) : "");

  const [subRampIniDate, setSubRampIniDate] = useState(plan ? plan.subscriptionPricing.dateRampIni.toISOString().replace("T", " ").replace("Z", "").substr(0, 19) : "");
  const [renRampIniDate, setRenRampIniDate] = useState(plan ? plan.renewalPricing.dateRampIni.toISOString().replace("T", " ").replace("Z", "").substr(0, 19) : "");
  const [subRampEndDate, setSubRampEndDate] = useState(plan ? plan.subscriptionPricing.dateRampEnd.toISOString().replace("T", " ").replace("Z", "").substr(0, 19) : "");
  const [renRampEndDate, setRenRampEndDate] = useState(plan ? plan.renewalPricing.dateRampEnd.toISOString().replace("T", " ").replace("Z", "").substr(0, 19) : "");

  const [subToken, setSubToken] = useState(plan ? VALID_TOKENS[plan.subscriptionPricing.token] : { symbol: "", contract: "", decimals: 0 });
  const [renToken, setRenToken] = useState(plan ? VALID_TOKENS[plan.renewalPricing.token] : { symbol: "", contract: "", decimals: 0 });

  const clickHandler = () => {
    //if (validations(val)) return;
    if (plan)
      return call(plan, name, duration, subIniPrice, renIniPrice, subEndPrice, renEndPrice,
        iniDate, endDate,
        subRampIniDate, subRampEndDate, renRampIniDate, renRampEndDate,
        subToken, renToken);
    else
      return call(name, duration, subIniPrice, renIniPrice, subEndPrice, renEndPrice,
        iniDate, endDate,
        subRampIniDate, subRampEndDate, renRampIniDate, renRampEndDate,
        subToken, renToken);
  };

  const dropdownTokenItems = Object.values(VALID_TOKENS).map((t) => {
    return {
      name: t.symbol,
      displayName: t.symbol,
      contract: t.contract,
      decimals: t.decimals
    };
  });
  //console.log(dropdownTokenItems);

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
      <br />
      <div className='flex mb-5'>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Duration (days)</span>
            </div>
          }
          placeholder={plan ? plan.time : "365"}
          bgClass="!bg-1 max-w-[157px]"
          ipClass="mb-5"
          value={duration}
          onChange={(val) => {
            setDuration(val);
          }}
        />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Init</span>
            </div>
          }
          placeholder={"YYYY-MM-DD HH:MM:SS"}
          bgClass="!bg-1 ml-5"
          ipClass="mb-5"
          value={iniDate}
          onChange={(val) => {
            setIniDate(val);
          }}
        />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>End</span>
            </div>
          }
          placeholder={"YYYY-MM-DD HH:MM:SS"}
          bgClass="!bg-1 ml-5"
          ipClass="mb-5"
          value={endDate}
          onChange={(val) => {
            setEndDate(val);
          }}
        />
      </div>
      <div className='flex mb-5'>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Sub Price - Init Ramp</span>
            </div>
          }
          placeholder={"YYYY-MM-DD HH:MM:SS"}
          bgClass="!bg-1"
          ipClass="mb-5"
          value={subRampIniDate}
          onChange={(val) => {
            setSubRampIniDate(val);
          }}
        />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Sub Price - End Ramp</span>
            </div>
          }
          placeholder={"YYYY-MM-DD HH:MM:SS"}
          bgClass="!bg-1 ml-5"
          ipClass="mb-5"
          value={subRampEndDate}
          onChange={(val) => {
            setSubRampEndDate(val);
          }}
        />
      </div>
      <div className='flex mb-5'>
        <PriceField title='Sub price - Init' token={subToken} setToken={setSubToken}
          tokenItems={dropdownTokenItems} amountValue={subIniPrice} setPrice={setIniSubPrice} />
        <PriceField title='Sub price - End' token={undefined} setToken={undefined}
          tokenItems={undefined} amountValue={subEndPrice} setPrice={setEndSubPrice} />
      </div>
      <div className='flex mb-5'>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Ren Price - Init Ramp</span>
            </div>
          }
          placeholder={"YYYY-MM-DD HH:MM:SS"}
          bgClass="!bg-1"
          ipClass="mb-5"
          value={renRampIniDate}
          onChange={(val) => {
            setRenRampIniDate(val);
          }}
        />
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Ren Price - End Ramp</span>
            </div>
          }
          placeholder={"YYYY-MM-DD HH:MM:SS"}
          bgClass="!bg-1 ml-5"
          ipClass="mb-5"
          value={renRampEndDate}
          onChange={(val) => {
            setRenRampEndDate(val);
          }}
        />
      </div>
      <div className='flex mt-5'>
        <PriceField title='Ren price - Init' token={renToken} setToken={setRenToken}
          tokenItems={dropdownTokenItems} amountValue={renIniPrice} setPrice={setIniRenPrice} />
        <PriceField title='Ren price - End' token={undefined} setToken={undefined}
          tokenItems={undefined} amountValue={renEndPrice} setPrice={setEndRenPrice} />
      </div>
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


const PriceField = ({ title, token, setToken, tokenItems, amountValue, setPrice }:
  { title: string, token?: { contract: string, symbol: string, decimals: number }, setToken: any, tokenItems?: any[], amountValue: Number, setPrice: any }) => {
  return <BufferInput
    header={
      <div className="flex flex-row justify-between w-full text-3 text-f14 ">
        <span>{title}</span>
        <br />
        {token && <span className="flex flex-row items-center">
          <TokenDropdown activeToken={token.symbol} setVal={setToken} items={tokenItems} />
        </span>}
      </div>
    }
    numericValidations={{
      decimals: { val: 6 },
      min: { val: '0', error: 'Enter a poistive value' },
    }}
    placeholder={1000}
    bgClass="!bg-1 max-w-[250px] mr-[20px]"
    ipClass="mb-5"
    value={amountValue}
    onChange={(val) => {
      //const newPrice = { token: token, amount: Number(val), contract: token.contract, decimals: token.decimals };
      //console.log("Changing price value", val)
      setPrice(val);
    }}
  />
}
