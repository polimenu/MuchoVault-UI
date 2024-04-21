import { Skeleton } from "@mui/material";
import { IPoolDetail, poolsAtom } from "../poolsAtom";
import { Section } from "@Views/Common/Card/Section";
import { PoolHistoryTable } from "./PoolHistoryTable";
import { PoolAPRChart } from "./PoolAPRChart";
import { useAtom } from "jotai";
import { BlueBtn } from "@Views/Common/V2-Button";
import { PoolPriceChart } from "./PoolPriceChart";
import { PoolLiqVolumeChart } from "./PoolLiqVolumeChart";
import BufferInput from "@Views/Common/BufferInput";
import { useState } from "react";

export const PoolDetail = ({ data }: { data: IPoolDetail }) => {
    const [numDays, setNumDays] = useState(30);
    const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
    //console.log("PoolsTable data", data);
    const [poolsState, setPoolsState] = useAtom(poolsAtom);
    const dateButtons = [
        { label: "1W", days: 7 }, { label: "2W", days: 14 }, { label: "3W", days: 21 },
        { label: "1M", days: 30 }, { label: "2M", days: 60 }, { label: "3M", days: 90 }, { label: "6M", days: 180 }
    ]

    if (!data) {
        return <Skeleton
            key="PoolsDetail"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {
        //console.log("poolDetail data", data);
        return <Section
            Heading={<></>}
            subHeading={<>
                <div className="flex text-f16 w-full flex-wrap">
                    <div id="dateButtons" className="flex w-[49%] mb-5">
                        <div id="customDays" className="">
                            <BufferInput
                                className=""
                                bgClass="!bg-grey flex w-[120px] text-white !pb-[6px] ml-5"
                                header={"Days:"}
                                ipClass="mt-1 ml-5 !bg-3 !w-[40px] text-center !p-[2px]"
                                value={numDays.toString()}
                                onChange={(val) => {
                                    if (!isNaN(val))
                                        setNumDays(Number(val));
                                }}
                            />
                        </div>
                        <div id="discreteButtons" className="flex">
                            {
                                dateButtons.map(b => <BlueBtn className={"w-[40px] ml-[8px] " + (b.days == numDays ? "bg-green" : "")} onClick={() => { setNumDays(b.days) }}>{b.label}</BlueBtn>
                                )
                            }
                        </div>
                    </div>
                    <div id="otherButtons" className="mb-5 ml-5 flex justify-end w-[49%] mb-5">
                        <BlueBtn className="!w-[100px]" onClick={() => { }}>APR</BlueBtn>
                        <BlueBtn className="ml-5 !w-[140px]" onClick={() => { window.open(`https://dexscreener.com/${data.ChainId}/${data.pairAddress}`) }}>DexScreener</BlueBtn>
                        <BlueBtn className="ml-5 !w-[140px]" onClick={() => { setPoolsState({ ...poolsState, pairAddress: undefined }) }}>Back to List</BlueBtn>
                    </div>
                </div></>}
            Cards={[
                <PoolAPRChart data={data} numDays={numDays} />,
                <PoolPriceChart data={data} numDays={numDays} reverse={false} />,
                <PoolLiqVolumeChart data={data} numDays={numDays} />,

                <PoolPriceChart data={data} numDays={numDays} reverse={true} />,
            ]}
            other={<PoolHistoryTable data={data} numDays={numDays} />}
        />;
    }
}