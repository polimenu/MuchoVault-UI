import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IHubTokenInfo, IMuchoHubData, IMuchoVaultData, IMuchoVaultParametersInfo, IV2ContractData, IVaultInfo } from '../v2AdminAtom';
import { Card } from '../../Common/Card/Card';
import { PlanAdminButtons, MuchoVaultAdminButtons } from './MuchoVaultAdminButtons';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext } from 'react';
import { MuchoVaultGeneralButtons, VaultButtons } from './MuchoVaultV2AdminButtons';
import { CheckBox } from '@mui/icons-material';
import { MuchoHubGeneralButtons, MuchoHubTokenButtons } from './MuchoHubV2AdminButtons';
import { contractLink } from '@Views/Common/Utils';
export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoHubV2AdminCards = (data: IMuchoHubData) => {
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

  const tokensInfo = data.tokensInfo.map((v, i) => <MuchoHubTokenInfoCard tokenInfo={v} />);
  const generalCard = <MuchoHubGeneralCard muchoHubData={data} />;

  return [generalCard, ...tokensInfo];
};


const MuchoHubGeneralCard = ({ muchoHubData }: { muchoHubData: IMuchoHubData }) => {
  //console.log("PlanCard");
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>MuchoHub Contract General Params (${contractLink(muchoHubData.contract)})</span>
        </>
      }
      middle={<>
        <MuchoHubParametersInfo info={muchoHubData} />
      </>}
      bottom={
        <div className="mt-5">
          {<MuchoHubGeneralButtons data={muchoHubData} />}
        </div>
      }
    />
  );
}

const MuchoHubTokenInfoCard = ({ tokenInfo }: { tokenInfo: IHubTokenInfo }) => {
  if (!tokenInfo) {
    return <Skeleton
      key=""
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  return (
    <Card
      top={
        <>
          <span className={underLineClass}>Token {tokenInfo.token.name} ({tokenInfo.token.contract})</span>
        </>
      }
      middle={<>
        <MuchoHubTokenInfo tokenInfo={tokenInfo} />
      </>}
      bottom={
        <div className="mt-5">
          {<MuchoHubTokenButtons data={tokenInfo} />}
        </div>
      }
    />
  );
}

const MuchoHubTokenInfo = ({ tokenInfo }: { tokenInfo: IHubTokenInfo }) => {
  //console.log("Plan:"); console.log(plan);
  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <>
      <TableAligner
        keysName={
          ['Total Staked', 'Total Not Invested', 'Current Investment', 'Default Investment']
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={tokenInfo.totalStaked}
              unit={tokenInfo.token.name}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={tokenInfo.totalNotInvested}
              unit={tokenInfo.token.name}
              precision={2}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
          </div>,
          <div className={`${wrapperClasses}`}>
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};


const MuchoHubParametersInfo = ({ info }: { info: IMuchoHubData }) => {
  //console.log("Plan:"); console.log(plan);
  //console.log("Enabled:"); console.log(enabledStr);
  return (
    <TableAligner
      keysName={['Protocols']}
      values={[
        <div className={`${wrapperClasses}`}>
          <ul>
            {info.protocols && info.protocols.map(p => <li key={p.address}>
              {contractLink(p.address, p.name)}
              &nbsp;
            </li>)}
          </ul>
        </div>,]
      }
      keyStyle={keyClasses}
      valueStyle={valueClasses}
    />
  );
};