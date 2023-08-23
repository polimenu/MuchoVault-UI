import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoVaultData, IMuchoVaultParametersInfo, IV2ContractData, IVaultInfo } from '../v2AdminAtom';
import { Card } from '../../Common/Card/Card';
import { PlanAdminButtons, MuchoVaultAdminButtons } from './MuchoVaultAdminButtons';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext } from 'react';
import { MuchoVaultGeneralButtons, VaultButtons } from './MuchoVaultV2UserButtons';
import { CheckBox } from '@mui/icons-material';
import { contractLink } from '@Views/Common/Utils';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import { Divider } from '@Views/Common/Card/Divider';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoVaultV2UserCards = (data: IMuchoVaultData) => {
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

  return vaultsInfo;
};


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
          <span className={underLineClass}>{vaultInfo.depositToken.name} Vault</span>
          <div className="text-f12 text-3  mt-2">
            Max Capacity&nbsp;:&nbsp;
            <Display
              data={vaultInfo.maxCap}
              unit={vaultInfo.depositToken.name}
              className="inline"
              disable
              precision={0}
            />
            &nbsp;(<Display
              data={Number(vaultInfo.totalStaked > 0 ? vaultInfo.totalUSDStaked * vaultInfo.maxCap / vaultInfo.totalStaked : 0)}
              label={"$ "}
              className="inline"
              disable
              precision={0}
            />)
          </div>
          <div className="max-w-[300px]">
            <BufferProgressBar
              fontSize={12}
              progressPercent={Number(100 * vaultInfo.totalStaked / vaultInfo.maxCap)}
            />
          </div>
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
  const muchoToDepositExchange = Number(vaultInfo.muchoToken.supply) > 0 ? Number(vaultInfo.totalStaked / vaultInfo.muchoToken.supply) : 1;

  return (
    <>
      <TableAligner
        keysName={
          ['Recepit current price', 'Total Invested in Vault']
        }
        values={[
          <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={1}
              unit={vaultInfo.muchoToken.name}
              precision={0}
            />
            &nbsp;=&nbsp;
            <Display
              className="!justify-end"
              data={muchoToDepositExchange}
              unit={vaultInfo.depositToken.name}
              precision={4}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.totalStaked}
              unit={vaultInfo.depositToken.name}
              precision={2}
            />
          </div>
          ,
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />

      <TableAligner
        keysName={
          ['Expected APR', 'Your investment', 'Your (not invested) tokens in wallet']
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.expectedAPR}
              unit={"%"}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.userData.muchoTokens * muchoToDepositExchange}
              unit={vaultInfo.depositToken.name}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={vaultInfo.userData.depositTokens}
              unit={vaultInfo.depositToken.name}
              precision={2}
            />
          </div>
          ,
        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />

      <Divider />

      <TableAligner
        keysName={
          ['Deposit Fee', 'Withdraw Fee', 'Max Deposit per user']
        }
        values={[
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
              data={vaultInfo.maxDepositUser}
              unit={vaultInfo.depositToken.name}
              precision={0}
            />
          </div>,
        ]
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