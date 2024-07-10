import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { badgeAtom } from '../badgeAtom';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { BadgeContext } from '../sale';
import { erc20ABI } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { usePlanUserCalls, useSalePlanUserCalls } from '../Hooks/usePlanWriteCalls';
import { t } from 'i18next';
import { BADGE_CONFIG } from '../Config/BadgeConfig';

export const SaleSubscribeUserModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const data = activeModal.saleData;
  const { subscribeUserCall } = useSalePlanUserCalls();
  const price = data.pricing.subscriptionPrice;
  const head = `Subscribirme a ${data.planAttributes.planName}`;
  const button = `Pagar ${Math.round(100 * price.amount) / 100} ${price.token} y Subscribirme`;

  console.log("price.contract", price.contract);
  const tokenContract: IContract = {
    abi: erc20ABI,
    contract: price.contract
  };
  return (
    <Subscribe
      planId={data.id}
      head={head}
      unit={price.token}
      tokenContract={tokenContract}
      call={subscribeUserCall}
      precision={2}
      decimals={price.decimals}
      amount={price.amount}
      button={button}
    />
  );
};


const Subscribe = ({ planId, head, unit, tokenContract, call, precision, decimals, amount, button }:
  { planId: string; head: string; unit: string; tokenContract: IContract; call: any; precision: number; decimals: number; amount: number; button: string }) => {
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[42161]; //Todo multichain

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  //console.log("DEPOSIT CALL:"); console.log(call);
  const { activeChain } = useContext(BadgeContext);
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    badge_config.MuchoNFTFetcher
  );
  //console.log("approve", approve);
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();

  //console.log("Decimals:"); console.log(decimals);
  const allowance = useGetAllowance(tokenContract.contract, decimals, badge_config.MuchoNFTFetcher, activeChain.id);
  //console.log("Allowance:"); console.log(allowance);

  const isApproved = gte(Number(allowance), amount || '1');

  const encrypt = (text: string) => {
    return text;
    //const cipher = createCipheriv(import.meta.env.ENCRYPTION_ALGO, Buffer.from(import.meta.env.ENCRYPTION_KEY), Buffer.from(import.meta.env.ENCRYPTION_IV));
    //return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  }

  const clickHandler = () => {
    const metadata = encrypt(JSON.stringify({ name: firstName, surname: lastName, email: email }));
    return call(planId, metadata);
  };

  // console.log("AAA", import.meta.env.ENCRYPTION_ALGO);


  return (
    <>
      <div>
        <div className="text-f16 mb-5">{head}</div>
        <div className='text-f15 mt-5'>Nombre:</div>
        <BufferInput placeholder={"Nombre"} bgClass="!bg-1" ipClass="mt-1" value={firstName} onChange={(val) => { setFirstName(val); }} />
        <div className='text-f15 mt-5'>Apellido (si tienes 2 apellidos, escribe ambos):</div>
        <BufferInput placeholder={"Apellidos"} bgClass="!bg-1" ipClass="mt-1" value={lastName} onChange={(val) => { setLastName(val); }} />
        <div className='text-f15 mt-5'>{t("ramp.E-mail")}:</div>
        <BufferInput placeholder={t("ramp.E-mail")} bgClass="!bg-1" ipClass="mt-1" value={email} onChange={(val) => { setEmail(val); }} />
      </div>
      <div className="flex whitespace-nowrap mt-5">
        {!isApproved && <BlueBtn
          onClick={() => {
            if (firstName.length > 2 && lastName.length > 2 && email.length > 2 && email.indexOf("@") > 0) {
              approve(toFixed((amount * 10 ** decimals + 1).toString(), 0), setApprovalState);
            }
            else {
              alert("Por favor rellena todos los campos");
            }
          }}
          className="mr-4 rounded"
          isDisabled={isApproved || state.txnLoading > 1}
          isLoading={state.txnLoading === 1 && approveState}
        >
          Autorizar Pago
        </BlueBtn>}
        {isApproved && <BlueBtn
          onClick={() => {
            if (firstName.length > 2 && lastName.length > 2 && email.length > 2 && email.indexOf("@") > 0) {
              clickHandler();
            }
            else {
              alert("Por favor rellena todos los campos");
            }
          }}
          className="rounded"
          isDisabled={state.txnLoading > 1 || !isApproved}
          isLoading={state.txnLoading === 1 && !approveState}
        >
          {button}
        </BlueBtn>}
      </div>
    </>
  );
};
