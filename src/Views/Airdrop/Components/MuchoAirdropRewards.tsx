import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/Common/TableAligner';
import { IMuchoAirdropDataPrice, IMuchoAirdropDistribution, IMuchoAirdropManagerData, IOldAirdropData } from '../AirdropAtom';
import { Card } from '../../Common/Card/Card';
//import { BADGE_CONFIG } from '../Config/Plans';
import { ViewContext } from '..';
import { useContext, useEffect, useState } from 'react';
import { AirdropButtons } from './MuchoAirdropButtons';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import { Chain } from 'wagmi';
import { t } from 'i18next';
import { MAIDROP_CONFIG } from '../Config/mAirdropConfig';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useWriteCall } from '@Hooks/useWriteCall';
import MuchoRewardRouterAbi from '../Config/Abis/mAirdropRewardRouter.json';

export const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
export const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
export const tooltipKeyClasses = '!text-f14 !text-2 !text-left !py-1 !pl-[0px]';
export const tooltipValueClasses =
  '!text-f14 text-1 !text-right !py-1 !pr-[0px]';
export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30]  w-fit ml-auto';


export const wrapperClasses = 'flex justify-end flex-wrap';



export const getMuchoAirdropRewards = (data: IMuchoAirdropManagerData) => {
  const viewContextValue = useContext(ViewContext);
  const config: (typeof MAIDROP_CONFIG)[42161] = MAIDROP_CONFIG[viewContextValue.activeChain.id];
  const { writeCall } = useWriteCall(config.RewardRouterContract, MuchoRewardRouterAbi);
  //console.log("getBadgeCards 0");
  //console.log("getV2AdminCards data", data);

  if (!data || !data.distributions || data.distributions.length == 0) {
    //console.log("getBadgeCards 1");
    return [0, 1].map((index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        className="w-full !h-full min-h-[370px] !transform-none !bg-1"
      />
    ));
  }

  //console.log("Drawing cards with data", data);

  let activeChain: Chain | null = null;
  if (viewContextValue) {
    activeChain = viewContextValue.activeChain;
  }


  return data.distributions.map(d => <MuchoAirdropRewardsCard data={d} writeCall={writeCall} />);
};


const MuchoAirdropRewardsCard = ({ data, writeCall }: { data: IMuchoAirdropDistribution, writeCall: any }) => {
  if (!data) {
    return <Skeleton
      key={0}
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }

  const claimReward = (airdropId: number) => {
    //getContractCall(writeCall, "harvest", [airdropId]);
    writeCall(() => { }, "harvest", [airdropId]);
  }

  return (
    <Card
      top={
        <>
          <span className={underLineClass}>{t("airdrop.Airdrop distribution #")}{data.id}: {data.name}</span>
        </>
      }
      middle={<>
        <TableAligner
          keysName={
            ["Token",
              t("airdrop.Total distributed to you"),
              t("airdrop.Claim expiration date"),
            ]
          }
          values={[
            <div className={`${wrapperClasses}`}>

              {data.token}
            </div>,
            <div className={`${wrapperClasses}`}>

              <Display
                className="!justify-end"
                data={data.userTokensByMAirdrop + data.userTokensByNFT}
                unit={data.token}
                precision={2}
              />
            </div>,
            <div className={`${wrapperClasses}`}>

              <Display
                className="!justify-end"
                data={data.expirationDate.toUTCString()}
              />
            </div>,
          ]
          }
          keyStyle={keyClasses}
          valueStyle={valueClasses}
        />
      </>}
      bottom={
        <>
          {data.userTokensByMAirdrop + data.userTokensByNFT > 0 && <BlueBtn onClick={() => { claimReward(data.id) }}>{t("airdrop.Claim")}</BlueBtn>}
          {data.userTokensByMAirdrop == 0 && data.userTokensByNFT == 0 && <BlueBtn onClick={() => { }} isDisabled={true}>{t("airdrop.No pending assignation")}</BlueBtn>}
        </>
      }
    />
  );
}