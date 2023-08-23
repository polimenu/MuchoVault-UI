import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoVaultData, IMuchoVaultParametersInfo, IV2ContractData, IVaultInfo } from '../v2AdminAtom';
import { Card } from '../../Common/Card/Card';
import { PlanAdminButtons, MuchoVaultAdminButtons } from './MuchoVaultAdminButtons';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext } from 'react';
import { MuchoVaultGeneralButtons, VaultButtons } from './MuchoVaultV2AdminButtons';
import { CheckBox } from '@mui/icons-material';
import { contractLink } from '@Views/Common/Utils';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoVaultV2AdminCards = (data: IMuchoVaultData) => {
  //console.log("getBadgeCards 0");
  //console.log("getV2AdminCards data", data);
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

  //console.log("Drawing cards with data", data);

  let activeChain: Chain | null = null;
  const viewContextValue = useContext(ViewContext);
  if (viewContextValue) {
    activeChain = viewContextValue.activeChain;
  }

  const vaultsInfo = data.vaultsInfo.map((v, i) => <MuchoVaultInfoCard vaultId={i} vaultInfo={v} />);
  const generalCard = <MuchoVaultGeneralCard muchoVaultData={data} />;

  return [generalCard, ...vaultsInfo];
};


const MuchoVaultGeneralCard = ({ muchoVaultData }: { muchoVaultData: IMuchoVaultData }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{contractLink(muchoVaultData.contract, "MuchoVault Contract")} General Params</span>
        </>
      }
      middle={<>
        <MuchoVaultParametersInfo info={muchoVaultData.parametersInfo} />
      </>}
      bottom={
        <div className="mt-5">
          <MuchoVaultGeneralButtons data={muchoVaultData} />
        </div>
      }
    />
  );
}

const MuchoVaultInfoCard = ({ vaultId, vaultInfo }: { vaultId: number, vaultInfo: IVaultInfo }) => {
  if (!vaultInfo) {
    return <Skeleton
      key={vaultId}
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>Vault #{vaultId}</span>
        </>
      }
      middle={<>
        <MuchoVaultInfo vaultInfo={vaultInfo} />
      </>}
      bottom={
        <div className="mt-5">
          <VaultButtons data={vaultInfo} />
        </div>
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
        keysName={
          ['Deposit Token', 'Mucho Token', 'Total Staked', 'Last Update', 'Stakable', 'Deposit Fee', 'Withdraw Fee', 'Max Cap', 'Max Deposit per user']
            .concat(vaultInfo.maxDepositPlans.map(mdp => {
              return `Plan ${mdp.planId} - Max deposit`
            }))
        }
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={contractLink(vaultInfo.depositToken.contract, vaultInfo.depositToken.name)}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={contractLink(vaultInfo.muchoToken.contract, vaultInfo.muchoToken.name)}
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
              data={<input type="checkbox" readOnly checked={vaultInfo.stakable} />}
            />
            &nbsp;
            <Display
              className="!justify-end"
              data={vaultInfo.stakable ? " Open" : " Closed"}
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
        ]
          .concat(vaultInfo.maxDepositPlans.map(mdp => {
            return <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={mdp.maxDeposit}
                unit={vaultInfo.depositToken.name}
                precision={2}
              />
            </div>
          }))
        }
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
    <TableAligner
      keysName={['Earnings Address', 'Swap fee'].concat(info.swapFeePlans.map(sfp => { return `Plan ${sfp.planId} - Swap fee` }))}
      values={[
        <div className={`${wrapperClasses}`}>
          <Display
            className="!justify-end"
            data={contractLink(info.earningsAddress)}
          />
        </div>,
        <div className={`${wrapperClasses}`}>
          <Display
            className="!justify-end"
            data={info.swapFee}
            unit={"%"}
            precision={2}
          />
        </div>,
      ].concat(info.swapFeePlans.map(sfp => {
        return <div className={`${wrapperClasses}`}>
          <Display
            className="!justify-end"
            data={sfp.swapFee}
            unit={"%"}
            precision={2}
          />
        </div>
      }))}
      keyStyle={keyClasses}
      valueStyle={valueClasses}
    />
  );
};