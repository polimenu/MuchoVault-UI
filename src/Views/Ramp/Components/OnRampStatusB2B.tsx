import { Section } from '@Views/Common/Card/Section';
import { useAtom } from 'jotai';
import { IRampData, IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { t } from 'i18next';
import { ICorporate, useGetRampTransactions } from '../Hooks/user';
import { UserDetailsCard } from './Cards/UserDetailsCard';
import { RampTransactionListCard } from './Cards/RampTransactionListCard';
import { KYBCards } from './Cards/KYBCard';
import { useGetCorpDetails, useGetRampTransactionsB2B } from '../Hooks/corp';
import { OnRampCard } from './Cards/OnRampCard';
import { OffRampCard } from './Cards/OffRampCard';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampStatusB2B = () => {
  const [rampData] = useAtom(rampDataAtom);
  const [rampState] = useAtom(rampAtom);
  const [corpDetails] = useGetCorpDetails(rampState.sessionId, rampData.userDetails ? rampData.userDetails.linked_corporates_uuid : []);
  //console.log("premiumInfo", premiumInfo);

  //console.log("OnRampStatus loading", rampData);
  return <div>
    <UserDetailsSection userDetails={rampData.userDetails} corpDetails={corpDetails} />
    <OnOffRampSection rampData={rampData} />
    <RampTransactions corpDetails={corpDetails} />
  </div>;
}


const UserDetailsSection = ({ userDetails, corpDetails }: { userDetails?: IRampUserDetails, corpDetails: ICorporate[] }) => {
  const [rampData] = useAtom(rampDataAtom);

  return <Section
    Heading={<div className={topStyles}>{t("ramp.User details and KYC status")}</div>}
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
        <OffRampCard userDetails={rampData.userDetails} />,

      ]
    }
  />;
}