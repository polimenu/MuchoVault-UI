import { Section } from '@Views/Common/Card/Section';
import { useAtom } from 'jotai';
import { IRampData, IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { t } from 'i18next';
import { useGetRampTransactions } from '../Hooks/user';
import { OnRampCard } from './Cards/OnRampCard';
import { OffRampCard } from './Cards/OffRampCard';
import { UserDetailsCard } from './Cards/UserDetailsCard';
import { KYCCard } from './Cards/KYCCard';
import { RampTransactionListCard } from './Cards/RampTransactionListCard';


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
    <RampTransactions />
  </div>;
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

const RampTransactions = () => {
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
      other={<RampTransactionListCard transactions={transactions} />}
    />
  }


}

