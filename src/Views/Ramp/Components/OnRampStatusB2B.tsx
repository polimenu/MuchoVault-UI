import { Section } from '@Views/Common/Card/Section';
import { useAtom } from 'jotai';
import { IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { t } from 'i18next';
import { useGetRampTransactions } from '../Hooks/user';
import { UserDetailsCard } from './Cards/UserDetailsCard';
import { RampTransactionListCard } from './Cards/RampTransactionListCard';
import { KYBCards } from './Cards/KYBCard';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampStatusB2B = () => {
  const [rampData] = useAtom(rampDataAtom);
  //console.log("premiumInfo", premiumInfo);

  //console.log("OnRampStatus loading", rampData);
  return <div>
    <UserDetailsSection userDetails={rampData.userDetails} />
    <RampTransactions />
  </div>;
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
        ...KYBCards({ userDetails }),

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

