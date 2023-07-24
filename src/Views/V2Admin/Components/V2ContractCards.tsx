import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoVaultData, IMuchoVaultParametersInfo, IV2ContractData, IVaultInfo } from '../v2AdminAtom';
import { Card } from './Card';
import { Divider } from './Divider';
import { PlanAdminButtons, PlanButtons } from './PlanButtons';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext } from 'react';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getPlanCards = (data: IV2ContractData) => {
  //console.log("getBadgeCards 0");
  if (!data) {
    //console.log("getBadgeCards 1");
    return [0, 1, 2, 3].map((index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        className="w-full !h-full min-h-[370px] !transform-none !bg-1"
      />
    ));
  }
  //console.log("getBadgeCards");
  //console.log(data);
  let activeChain: Chain | null = null;
  const viewContextValue = useContext(ViewContext);
  if (viewContextValue) {
    activeChain = viewContextValue.activeChain;
  }

  const planCards = () => {
    return <MuchoVaultCard muchoVaultData={data.muchoVault} />
  };

  return planCards;
};



const MuchoVaultCard = ({ muchoVaultData }: { muchoVaultData: IMuchoVaultData }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>MuuchoVault Contract ({muchoVaultData.contract})</span>
        </>
      }
      middle={<>
        {muchoVaultData.vaultsInfo.map((v) => <MuchoVaultInfo vaultInfo={v} />)}
        <MuchoVaultParametersInfo info={muchoVaultData.parametersInfo} />
      </>}
      bottom={
        < div className="mt-5" >
          Pending buttons
        </div >
      }
    />
  );
}

const MuchoVaultInfo = ({ vaultInfo }: { vaultInfo: IVaultInfo }) => {
  //console.log("Plan:"); console.log(plan);
  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <>
      <TableAligner
        keysName={['Deposit Token', 'Mucho Token', 'Total Staked', 'Last Update', 'Stakable', 'Deposit Fee', 'Withdraw Fee', 'Max Cap', 'Max Deposit per user']}
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={vaultInfo.depositToken.name + " (" + vaultInfo.depositToken.contract + ")"}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={`<a href='https://arbiscan.io/address/{vaultInfo.muchoToken.contract}'>{vaultInfo.muchoToken.name}</a>`}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.totalStaked}
              unit={vaultInfo.depositToken.name}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.lastUpdate.toString()}
            />
          </div>,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.stakable.toString()}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.depositFee}
              unit={"%"}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.withdrawFee}
              unit={"%"}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.maxCap}
              unit={vaultInfo.depositToken.name}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.maxDepositUser}
              unit={vaultInfo.depositToken.name}
              precision={2}
            />
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};


const MuchoVaultParametersInfo = ({ info }: { info: IMuchoVaultParametersInfo }) => {
  //console.log("Plan:"); console.log(plan);
  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <>
      <TableAligner
        keysName={['Swap fee', 'Earnings Address'}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={info.swapFee}
              unit={"%"}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={<a href="https://arbiscan.io/address/{info.earningsAddress}">{info.earningsAddress}</a>}
            />
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};



/*const PlanInfoUser = ({ plan }: { plan: IPlan }) => {
  //console.log("Plan:"); console.log(plan);
  const enabledStr: string = plan.isActiveForCurrentUser ? "Subscribed" :
    (plan.isExpiredForCurrentUser ? "Expired" : "Not subscribed");

  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <>
      <TableAligner
        keysName={['Duration', 'Subscription Price', 'Renewal Price', 'Status (time left)']}
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={plan.time}
              unit={"days"}
              precision={0}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.subscriptionPrice.amount}
              unit={plan.subscriptionPrice.token}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={plan.renewalPrice.amount}
              unit={plan.renewalPrice.token}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            {<Display
              className="!justify-end"
              data={enabledStr}
            />}
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};*/