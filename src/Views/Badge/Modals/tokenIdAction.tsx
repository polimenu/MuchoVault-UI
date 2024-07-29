import { useAtom } from 'jotai';
import { useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlan, badgeAtom } from '../badgeAtom';
import { useTokenIdActionCalls } from '../Hooks/usePlanWriteCalls';
import { useGlobal } from '@Contexts/Global';
import { useGetTokenIdAttributes } from '../Hooks/useGetTokenIdAttributes';
import { Display } from '@Views/Common/Tooltips/Display';
import { dateFormat } from '@Views/Common/Utils';
import { formatDate } from '@Views/Ramp/Utils';



export const TokenIdActionModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const plan: IPlan = pageState.activeModal.plan;
  const { unsubCall, renewCall, changeExpirationCall } = useTokenIdActionCalls(plan.address);
  const [ExpirationField, expiration, showExpirationField, setShowExpirationField] = expirationField();

  const actions = [
    {
      call: unsubCall,
      title: "Unsubscribe",
      field: undefined,
      variable: undefined,
      showField: undefined,
      setShowField: undefined,
    },
    {
      call: renewCall,
      title: "Renew",
      field: undefined,
      variable: undefined,
      showField: undefined,
      setShowField: undefined,
    },
    {
      call: changeExpirationCall,
      title: "Change Expiration",
      field: ExpirationField,
      variable: expiration,
      showField: showExpirationField,
      setShowField: setShowExpirationField,
    }
  ]

  return (
    <TokenIdAction plan={plan} actions={actions} />
  );

};

const expirationField = () => {
  const [expiration, setExpiration] = useState('');
  const [display, setDisplay] = useState(false);
  return [<div key="expirationField">{display && <BufferInput
    header={
      <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
        <span>New Expiration (YYYY-MM-DD)</span>
      </div>
    }
    placeholder="YYYY-MM-DD"
    bgClass={"!bg-1"}
    ipClass={"mt-1"}
    //inputType={isBulk ? "textarea" : null}
    value={expiration}
    onChange={(val) => {
      setExpiration(val);
    }}
  />}</div>, expiration, display, setDisplay];
}

const TokenIdAction = ({ actions, plan }: { actions: { call: any, title: string, field?: Element, showField: boolean, setShowField: any, variable: any }[], plan: IPlan }) => {

  const [tokenId, setTokenId] = useState(0);
  const [tokenIdAttributes] = useGetTokenIdAttributes(plan.address, tokenId);
  //console.log("CHANGE tokenIdAttributes", tokenIdAttributes);
  const { state } = useGlobal();

  const today = new Date();
  const renewDate = (new Date()).setDate(today.getDate() + Number(plan.time));
  //console.log("renewDate", formatDate(renewDate));

  return (
    <>
      <div>
        <div className="text-f15 mb-5">Token ID Actions</div>
        <BufferInput
          header={
            <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
              <span>Token Id</span>
            </div>
          }
          placeholder="0"
          bgClass={"!bg-1"}
          ipClass={"mt-1"}
          //inputType={isBulk ? "textarea" : null}
          value={tokenId}
          onChange={(val) => {
            setTokenId(val);
          }}
        />
      </div>
      {tokenIdAttributes && <div className='text-f15 mb-5 mt-5'>
        <Display data={tokenIdAttributes?.tokenId.toString()} label={"Token ID: "} />
        <Display data={tokenIdAttributes?.metaData.name} label={"Name: "} />
        <Display data={tokenIdAttributes?.metaData.surname} label={"Surname: "} />
        <Display data={tokenIdAttributes?.metaData.email} label={"Email: "} />
        <Display data={tokenIdAttributes?.metaData.discord} label={"Discord: "} />
        <Display data={dateFormat(tokenIdAttributes?.startTime)} label={"Start time: "} />
        <Display data={dateFormat(tokenIdAttributes?.expirationTime)} label={"Expiration time: "} />
      </div>}
      {tokenId > 0 && tokenIdAttributes && <>
        <div className="flex whitespace-nowrap mt-5">
          {actions.map(act => {

            const clickHandler = () => {
              //console.log("act", act);
              //console.log("act.field", act.field);
              //console.log("act.showField", act.showField);
              if (act.field && !act.showField) {
                //console.log("showing field");
                act.setShowField(true);
              }
              else if (!act.field) {
                //console.log("calling action with no field");
                act.call(tokenId);
              }
              else {
                //console.log("calling action with field", act.variable);
                act.call(tokenId, act.variable);
              }
            }
            return <BlueBtn
              key={"btn_act_" + act.title}
              onClick={clickHandler}
              className="rounded pl-5 pr-5 mr-5 ml-5"
              isDisabled={state.txnLoading > 1}
              isLoading={state.txnLoading === 1}
            >
              {act.title}
            </BlueBtn>;

          })
          }
        </div>
        <div className="flex whitespace-nowrap mt-5">
          {actions.map(act => act.field)}
        </div>
        <div className='text-f14 mt-5 block'>
          <strong>Unsubscribe</strong> burns user's NFT <br />
          <strong>Renew</strong> sets expiration of user to <i>Today + NFT duration</i> ({formatDate(renewDate)})<br />
          <strong>Change Expiration</strong> changes user's expiration to a custom one<br />
        </div>
      </>}
    </>
  );
};