import { Section } from '@Views/Common/Card/Section';
import { useAtom } from 'jotai';
import { IRampData, IRampPremiumInfo, IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { t } from 'i18next';
import { useGetRampTransactions } from '../Hooks/user';
import { OnRampCard } from './Cards/OnRampCard';
import { OffRampCard } from './Cards/OffRampCard';
import { UserDetailsCard } from './Cards/UserDetailsCard';
import { KYCPremiumCard } from './Cards/KYCCard';
import { RampTransactionListCard } from './Cards/RampTransactionListCard';
import { useGetPremiumInfo } from '../Hooks/useGetPremiumInfo';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampStatus = () => {
  const [rampData] = useAtom(rampDataAtom);
  const premiumInfo = useGetPremiumInfo(rampData.userDetails?.uuid);

  //console.log("OnRampStatus loading", rampData);
  return <div>
    <UserDetailsSection userDetails={rampData.userDetails} premiumInfo={premiumInfo} />
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

const UserDetailsSection = ({ userDetails, premiumInfo }: { userDetails?: IRampUserDetails, premiumInfo?: IRampPremiumInfo }) => {

  return <Section
    Heading={<div className={topStyles}>{t("ramp.User details and KYC status")}</div>}
    subHeading={
      <div className={descStyles}>

      </div>
    }
    Cards={
      [
        <UserDetailsCard userDetails={userDetails} />,
        <KYCPremiumCard userDetails={userDetails} premiumInfo={premiumInfo} />,

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

