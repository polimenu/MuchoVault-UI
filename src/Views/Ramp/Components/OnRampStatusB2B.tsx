import { Section } from '@Views/Common/Card/Section';
import { useAtom } from 'jotai';
import { IRampData, IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { t } from 'i18next';
import { UserDetailsCard } from './Cards/UserDetailsCard';
import { RampTransactionListCard } from './Cards/RampTransactionListCard';
import { KYBCards } from './Cards/KYBCard';
import { ICorporate, useGetBankAccountsB2B, useGetRampTransactionsB2B, useSetMainBankAccountB2B } from '../Hooks/corp';
import { OnRampCard } from './Cards/OnRampCard';
import { OffRampCard } from './Cards/OffRampCard';
import { useState } from 'react';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampStatusB2B = () => {
  const [rampData] = useAtom(rampDataAtom);
  const [rampState] = useAtom(rampAtom);
  //console.log("premiumInfo", premiumInfo);

  //console.log("OnRampStatus loading", rampData);
  return <div>
    <UserDetailsSection userDetails={rampData.userDetails} corpDetails={rampData.corpDetails} />
    <OnOffRampSection rampData={rampData} />
    <RampTransactions corpDetails={rampData.corpDetails} />
  </div>;
}


const UserDetailsSection = ({ userDetails, corpDetails }: { userDetails?: IRampUserDetails, corpDetails: ICorporate[] }) => {
  const [rampData] = useAtom(rampDataAtom);

  return <Section
    Heading={<div className={topStyles}>
      {t("ramp.User details and KYC status")}

    </div>}
    subHeading={
      <div className={descStyles}>

      </div>
    }
    Cards={
      [
        <UserDetailsCard userDetails={userDetails} addCorpButton={true} />,
        ...KYBCards({ corpDetails }),

      ]
    }
  />;
}

const RampTransactions = ({ corpDetails }: { corpDetails: ICorporate[] }) => {
  //fetchTransactions();
  const [rampState] = useAtom(rampAtom);
  const [rampData] = useAtom(rampDataAtom);
  const [corpsTransactions] = useGetRampTransactionsB2B(rampState.sessionId, rampData.userDetails?.linked_corporates_uuid);


  if (!corpsTransactions || corpsTransactions.length == 0 || !corpDetails) {
    return <></>
  }
  else {
    return <>
      {corpsTransactions.map(corp => {
        if (!corp.transactions || corp.transactions.length == 0) {
          return <span key={"transactions_" + corp.uuid}></span>;
        }

        const corpDet = corpDetails.find(c => c.uuid == corp.uuid);
        return <Section
          key={"transactions_" + corp.uuid}
          Heading={<div className={topStyles}>{t("ramp.Last Transactions")} - {corpDet?.legal_name}</div>}
          subHeading={
            <div className={descStyles}>
              {t("ramp.List of your last transactions")}
            </div>
          }
          other={<RampTransactionListCard transactions={corp.transactions} />}
        />
      })}
    </>
  }


}

const OffRampCardWrapper = ({ sessionId, uuid, canTransact }: { sessionId: string, uuid: string, canTransact: boolean }) => {
  const [reload, setReload] = useState(0);
  const [bankAccounts] = useGetBankAccountsB2B(sessionId, uuid, reload);
  return <OffRampCard bankAccounts={bankAccounts}
    canTransact={canTransact}
    setMainBankAccount={(account) => { return useSetMainBankAccountB2B(sessionId, uuid, account); }}
    reloadAccount={reload}
    setReloadAccount={setReload}
    addAccountModalData={{ currency: "EUR", uuid }}
    offRampModalData={{ uuid }} />

}


const OnOffRampSection = ({ rampData }: { rampData: IRampData }) => {

  const [rampState] = useAtom(rampAtom);

  let cards: JSX.Element[] = [];
  if (rampData.corpDetails && rampData.corpDetails.length > 0 && rampData.tokenPreferencesB2B) {
    cards = rampData.corpDetails.map(corp => {
      return [
        <OnRampCard tokenPreferences={rampData.tokenPreferencesB2B?.find(c => c.corporateUuid == corp.uuid)?.tokenPreferences} userDetails={rampData.userDetails} corpDetails={corp} />,
        <OffRampCardWrapper sessionId={rampState.sessionId} uuid={corp.uuid} canTransact={corp.kybStatus.canTransact} />
      ]
    }
    ).reduce((p, c) => p.concat(c));
  }

  return <Section
    Heading={<div className={topStyles}>{t("ramp.On & Off Ramp")}</div>}
    subHeading={
      <div className={descStyles}>
        {t("ramp.Move from FIAT to Crypto, or counterwise")}
      </div>
    }
    Cards={cards}
  />;
}