import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { IPlanDetailed, badgeAtom } from '../badgeAtom';
import { toFixed } from '@Utils/NumString';
import { gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { BadgeContext } from '..';
import { erc20ABI } from 'wagmi';
import { IContract } from 'src/Interfaces/interfaces';
import { useGetAllowance, useGetApprovalAmount } from '../../Common/Hooks/useAllowanceCall';
import { useSalePlanUserCalls } from '../Hooks/usePlanWriteCalls';
import { t } from 'i18next';
import { BADGE_CONFIG } from '../Config/BadgeConfig';
import { useGetPlansDetailed } from '../Hooks/useGetPlanData';
import { getEncryptedMetadata, useGetEncryptedMetadata } from '../Hooks/useGetEncryptedMetadata';

export const SaleSubscribeUserModal = () => {

  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;
  const [data] = useGetPlansDetailed([activeModal.planId]);
  const { subscribeUserCall } = useSalePlanUserCalls();
  if (!data)
    return <></>;
  const price = data.pricing.userPrice;
  const head = `Subscribirme a ${data.planAttributes.planName}`;
  const button = `Paso 2 de 2: Pagar ${Math.round(100 * price.amount) / 100} ${price.token} y Subscribirme`;

  //console.log("price.contract", price.contract);
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
  { planId: number; head: string; unit: string; tokenContract: IContract; call: any; precision: number; decimals: number; amount: number; button: string }) => {
  const badge_config: (typeof BADGE_CONFIG)[42161] = BADGE_CONFIG[42161]; //Todo multichain

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  //const [metadata, setMetadata] = useState('');
  //console.log("DEPOSIT CALL:"); console.log(call);
  let chainId = 42161;
  const badgeContextValue = useContext(BadgeContext);
  if (badgeContextValue) {
    chainId = badgeContextValue.activeChain.id;
  }
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    badge_config.MuchoNFTFetcher
  );
  //console.log("approve", approve);
  const [approveState, setApprovalState] = useState(false);
  const { state, dispatch } = useGlobal();

  //console.log("Decimals:"); console.log(decimals);
  const allowance = useGetAllowance(tokenContract.contract, decimals, badge_config.MuchoNFTFetcher, chainId);
  let allowanceAmount = amount;// + 3;
  //console.log("Allowance:"); console.log(allowance);

  //Special cases
  if (planId == 8 && amount < 100) {
    allowanceAmount += 1;
  }
  else if ((planId == 1 && amount < 5500) || (planId == 9 && amount < 4500)) {
    allowanceAmount += 10;
  }

  const isApproved = gte(Number(allowance), amount || '1');

  //const [encryptedMD] = useGetEncryptedMetadata(metadata);
  //console.log("encryptedMD", encryptedMD, metadata);


  const clickHandler = async () => {
    //setMetadata(JSON.stringify({ name: firstName, surname: lastName, email: email }));
    const md = JSON.stringify({ name: firstName, surname: lastName, email: email });
    const encryptedMD = await getEncryptedMetadata(md, dispatch);
    if (encryptedMD) {
      //console.log("encryptedMD", encryptedMD);
      return call(planId, encryptedMD);
    }
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
        <BlueBtn
          onClick={() => {
            if (firstName.length > 2 && lastName.length > 2 && email.length > 2 && email.indexOf("@") > 0) {
              approve(toFixed((allowanceAmount * 10 ** decimals).toString(), 0), setApprovalState);
            }
            else {
              alert("Por favor rellena todos los campos");
            }
          }}
          className="mt-5 rounded"
          isDisabled={isApproved || approveState || state.txnLoading > 1}
          isLoading={state.txnLoading === 1 && approveState}
        >
          {isApproved && " ✅"} Paso 1 de 2: Autorizar Gasto al Protocolo{allowanceAmount > amount ? "*" : ""}
        </BlueBtn>
      </div>
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
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
        </BlueBtn>
      </div>
      {allowanceAmount > amount && <div className="flex mt-5 text-f12">
        *En el primer paso pedimos autorización por {allowanceAmount - amount} USDC más de lo necesario, ya que cada segundo sube el precio. Se te cobrará lo correcto en el segundo paso.
      </div>}
    </>
  );
};
