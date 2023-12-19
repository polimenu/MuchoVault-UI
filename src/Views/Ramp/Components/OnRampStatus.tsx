import { ReactNode, useContext, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { Section } from '@Views/Common/Card/Section';
import TransactionTable from './TransactionTable';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Common/Card/Card';
import { TableAligner } from '@Views/Common/TableAligner';
import { Skeleton } from '@mui/material';
import { useAtom } from 'jotai';
import { IRampBankAccount, IRampData, IRampTokenPreference, IRampTransaction, IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { addressSummary } from '@Views/Common/Utils';
import { useRampSumsubToken } from '../Hooks/kyc';
import { RAMP_CONFIG } from '../Config/rampConfig';
import { networkBeautify, tokenBeautify } from '../Utils';
import { useGlobal } from '@Contexts/Global';
import { useLogout } from '../Hooks/login';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { useUserAccount } from '@Hooks/useUserAccount';
import { ViewContext } from '..';
import { useNetwork } from 'wagmi';
import { t } from 'i18next';
import { useGetRampTransactions } from '../Hooks/user';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampStatus = () => {
  const [rampData] = useAtom(rampDataAtom);

  //console.log("OnRampStatus loading", rampData);

  return <div>
    <UserDetailsSection userDetails={rampData.userDetails} />
    <OnOffRampSection rampData={rampData} />
    <OnRampTransactions />
  </div>;

  return <></>;
}

const OnOffRampSection = ({ rampData }: { rampData: IRampData }) => {

  return <Section
    Heading={<div className={topStyles}>{t("ramp.On & Off Ramp")}</div>}
    subHeading={
      <div className={descStyles}>
        {t("ramp.Move from FIAT to Crypto, or counterwise")}
      </div>
    }
    Cards={
      [
        <OnRampCard tokenPreferences={rampData.tokenPreferences} userDetails={rampData.userDetails} />,
        <OffRampCard bankAccounts={rampData.bankAccounts} userDetails={rampData.userDetails} />,

      ]
    }
  />;
}

const UserDetailsSection = ({ userDetails }: { userDetails?: IRampUserDetails }) => {

  return <Section
    Heading={<div className={topStyles}>{t("ramp.User details and KYC status")}</div>}
    subHeading={
      <div className={descStyles}>

      </div>
    }
    Cards={
      [
        <UserDetailsCard userDetails={userDetails} />,
        <KYCCard userDetails={userDetails} />,

      ]
    }
  />;
}


const wrapperClasses = 'flex justify-end flex-wrap';
const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';

const UserDetailsCard = ({ userDetails }: { userDetails: IRampUserDetails }) => {

  if (!userDetails) {
    return <Skeleton
      key="userDetailsCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }

  let parsedAddress = "";
  if (userDetails.address) {
    if (userDetails.address.address_line_1)
      parsedAddress = `${userDetails.address.address_line_1} ${userDetails.address.address_line_2}. ${userDetails.address.post_code} ${userDetails.address.city} (${userDetails.address.country})`;
    else if (userDetails.address.post_code || userDetails.address)
      parsedAddress = `${userDetails.address.post_code} ${userDetails.address.city} (${userDetails.address.country})`;
    else
      parsedAddress = userDetails.address.country;
  }



  return <Card
    top={
      <div className="flex">
        <div className="text-1 text-f16 w-full">{t("ramp.User Details")}</div>
        <div className="text-f12 underline pointer" onClick={() => { useLogout(); }} dangerouslySetInnerHTML={
          { __html: t("ramp.Logout", { interpolation: { escapeValue: false } }) }
        }></div>
      </div>
    }


    middle={<>{userDetails &&
      <TableAligner
        keysName={
          // ["Name", "Last name", "E-mail", "Date of birth", "Address", "Postal Code", "City", "Country"]
          [t("ramp.Name"), t("ramp.E-mail"), t("ramp.Date of birth"), t("ramp.Address")]
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.first_name + " " + userDetails.last_name}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.email}
            />
          </div>
          ,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.date_of_birth ? userDetails.date_of_birth : ""}
            />
          </div>
          ,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={parsedAddress}
            />
          </div>
          ,


        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />}


    </>}

  />;
}


const KYCCard = ({ userDetails }: { userDetails?: IRampUserDetails }) => {
  const [rampState, setRampState] = useAtom(rampAtom);
  const [getToken, setGetToken] = useState(false);
  const [token] = useRampSumsubToken(getToken);
  const { state } = useGlobal();

  if (!userDetails) {
    return <Skeleton
      key="userDetailsCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }

  const toFinishKYC = ["PENDING_KYC_DATA", "SOFT_KYC_FAILED"].indexOf(userDetails?.status) >= 0

  return <Card
    top={
      <>{t("ramp.KYC Status")}: <span
        className={"!justify-end " + (userDetails.status == "FULL_USER" ? " green" : " red")}
      >{t(userDetails.kyc_status.status)}</span></>
    }


    middle={<>
      <div className={keyClasses}>
        {t(userDetails.kyc_status.explanation)}
      </div>
    </>}

    bottom={(userDetails.canCreateKYC || toFinishKYC) && <>
      {userDetails.canCreateKYC && <BlueBtn
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "KYC" }) }}>{t("ramp.Start KYC")}</BlueBtn>}
      {toFinishKYC && <BlueBtn
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1} onClick={() => { setGetToken(true); }}>{t("ramp.Finish KYC")}</BlueBtn>}
    </>}
  />;
}


//ToDo soft code currency
const OnRampCard = ({ tokenPreferences, userDetails }: { tokenPreferences?: IRampTokenPreference[], userDetails?: IRampUserDetails }) => {
  const [rampState, setRampState] = useAtom(rampAtom);
  const { state } = useGlobal();
  const editIconClass = 'w-[1vw] h-[1vw] inline ml-5';
  if (!tokenPreferences || !userDetails) {
    return <Skeleton
      key="TokenPreferencesCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  return <Card
    top={t("ramp.From EUR to Crypto")}
    middle={<TableAligner
      keysName={
        [t("ramp.Target address"), ...tokenPreferences.map(z => t("ramp.Convert currency to", { currency: z.currency }))]
      }
      values={[
        <span className='pointer' onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "TARGET_ADDRESS", auxModalData: { currentAddress: userDetails.target_address } }) }}>{userDetails.target_address ? addressSummary(userDetails.target_address) : t("ramp.Not set!")}
          <img src='edit_wh.png' className={editIconClass} />
        </span>
        , ...tokenPreferences.map(t => {
          return <span className={`${wrapperClasses} pointer`}
            onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "ONRAMP_PREF", auxModalData: t }) }}>
            <Display
              className="!justify-end"
              data={tokenBeautify(t.token)}
            />
            &nbsp;
            (<Display
              className="!justify-end"
              data={networkBeautify(t.chain)}
            />)
            <img src='edit_wh.png' className={editIconClass} />
          </span>
        })]}
      keyStyle={keyClasses}
      valueStyle={valueClasses}

    />}
    bottom={userDetails.kyc_status.canTransact && <>
      {userDetails.target_address && <div className="flex gap-5">
        <BlueBtn
          isDisabled={state.txnLoading > 1}
          isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "ONRAMP", auxModalData: { currency: "EUR" } }) }}>{t("ramp.OnRamp (from EUR to Crypto)")}</BlueBtn>
      </div>}
      {!userDetails.target_address && <div className="flex gap-5">
        <BlueBtn
          isDisabled={true} onClick={() => { }}>{t("ramp.Please set a target address")}</BlueBtn>
      </div>}
    </>} />;
}


const OffRampCard = ({ bankAccounts, userDetails }: { bankAccounts?: IRampBankAccount[], userDetails?: IRampUserDetails }) => {
  const [rampState, setRampState] = useAtom(rampAtom);
  const { state } = useGlobal();

  if (!bankAccounts || !userDetails) {
    return <Skeleton
      key="OffRampCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }

  //const currencies = [...new Set(bankAccounts.map(b => b.currency))];

  //ToDo soft code currency
  return <Card
    top={<div className='flex'>
      <div className='w-full'>{t("ramp.From Crypto to EUR")}</div>
      <div><BlueBtn onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "BANK_ADD", auxModalData: { currency: "EUR" } }) }}>&nbsp;&nbsp;&nbsp;<span dangerouslySetInnerHTML={
        { __html: t("ramp.Add&nbsp;Account", { interpolation: { escapeValue: false } }) }
      }></span>&nbsp;&nbsp;&nbsp;</BlueBtn></div>
    </div>}
    middle={<TableAligner
      keysName={
        [...bankAccounts.map((b, i) => {
          if (i > 0 && b.currency === bankAccounts[i - 1].currency)
            return '';

          return t("ramp.currency destination account(s)", { currency: b.currency });
        })]
      }
      values={[
        ...bankAccounts.map(b => {
          return <span className={`${wrapperClasses}${b.isMain ? '' : ' pointer'}`}
            onClick={() => { if (!b.isMain) setRampState({ ...rampState, isModalOpen: true, activeModal: "BANK_MAIN", auxModalData: b }) }}>
            <Display
              className="!justify-end"
              data={<>{b.isMain ? <span className='green'>({t("ramp.main")})</span> : <></>} {b.name ? `${b.name} (${b.iban.substring(0, 4)}...${b.iban.substring(b.iban.length - 4)})` : b.iban}</>}
            />&nbsp;
          </span>
        })]}
      keyStyle={keyClasses}
      valueStyle={valueClasses}

    />
    }
    bottom={
      userDetails.kyc_status.canTransact && <>
        <OffRampButtons bankAccounts={bankAccounts} />
      </>
    } />;
}

export function OffRampButtons({ bankAccounts }: { bankAccounts: IRampBankAccount[] }) {
  const [rampState, setRampState] = useAtom(rampAtom);
  const { state } = useGlobal();
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();

  const btnClasses = '';
  const hasBank = bankAccounts && bankAccounts.length > 0


  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );

  //console.log("Max Cap", id, data.maxCap);

  return (<>
    {hasBank && <div className={`${btnClasses} flex gap-5`}>
      <BlueBtn
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "OFFRAMP" }) }}>{t("ramp.OffRamp (Crypto to EUR)")}</BlueBtn>
    </div>}
    {!hasBank && <div className={`${btnClasses} flex gap-5`}>
      <BlueBtn
        isDisabled={true}
        onClick={() => { }}>{t("ramp.Please add a bank account")}</BlueBtn>
    </div>}
  </>);

}

const OnRampTransactions = () => {
  //fetchTransactions();
  const [rampState] = useAtom(rampAtom);
  const [transactions] = useGetRampTransactions(rampState.sessionId);


  if (transactions && transactions.length == 0) {
    return <></>
  }
  else {
    return <Section
      Heading={<div className={topStyles}>{t("ramp.Last Transactions")}</div>}
      subHeading={
        <div className={descStyles}>
          {t("ramp.List of your last transactions")}
        </div>
      }
      other={<OnRampTransactionList transactions={transactions} />}
    />
  }


}


const OnRampTransactionList = ({ transactions }: { transactions?: IRampTransaction[] }) => {
  if (!transactions) {
    return <Skeleton
      key="OnRampTransactionsCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  else {
    const headerJSX = [
      { id: "tid", label: t("ramp.Transaction ID") },
      { id: "direction", label: t("ramp.Direction") },
      { id: "input", label: t("ramp.Input") },
      { id: "output", label: t("ramp.Output") },
      { id: "status", label: t("ramp.Status") },
    ];

    const dashboardData = transactions.map(t => {
      /*return {
        tid: t.input.transaction_id,
        direction: t.direction,
        input: `${t.input.amount} ${t.input.currency}`,
        output: t.output.currency
      }*/
      return [
        addressSummary(t.input.transaction_id),
        t.direction,
        `${t.input.amount} ${t.input.currency}`,
        t.output.currency,
        t.status
      ]
    });
    //console.log("dashboardData", dashboardData);

    interface ICellContent {
      content: ReactNode[];
      className?: string;
      classNames?: string[];
      preventDefault?: boolean;
    }

    const CellContent: React.FC<ICellContent> = ({
      content,
      classNames,
      preventDefault,
      className,
    }) => {
      if (!content.length) return;
      return (
        <div className={`${className} flex flex-col`}>
          {content.map((cellInfo, key) => {
            return (
              <span
                className={`${classNames?.length >= key ? classNames[key] : null} ${key && !preventDefault && " text-4 "
                  }`}
                key={key}
              >
                {cellInfo}
              </span>
            );
          })}
        </div>
      );
    };

    const bodyJSX = (
      row: number,
      col: number,
      sortedData: typeof dashboardData
    ) => {
      const currentData = sortedData[row][col];
      let classNames = "";
      if (currentData.indexOf("COMPLETED") > 0)
        classNames += "green";
      else if (currentData.indexOf("REJECTED") > 0)
        classNames += "red";
      //console.log("currentData", currentData);
      return <CellContent
        content={[
          <Display
            data={currentData}
            className="!justify-start"
          />,
        ]}
        className={classNames}
      />;
    }


    return <>
      <div>
        <TransactionTable
          defaultSortId="direction"
          defaultOrder="desc"
          headerJSX={headerJSX}
          cols={headerJSX.length}
          data={dashboardData}
          rows={dashboardData?.length}
          bodyJSX={bodyJSX}
          loading={!dashboardData.length}
          onRowClick={(idx) => {
            //navigate(`/binary/${dashboardData[idx].pair}`);
          }}
          widths={['30%', '20%', '15%', '15%', '20%']}
          shouldShowMobile={true}
        />
      </div>
    </>;
  }
}