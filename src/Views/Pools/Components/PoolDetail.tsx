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
    if (!data) {
        return <Skeleton
            key="PoolsDetail"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {

        return <Section
            Heading={<></>}
            subHeading={<>
                <div className="flex text-f16 w-full">
                    <div className="ml-5 w-[87%]">
                        <BufferInput
                            className="w-[150px]"
                            bgClass="!bg-2"
                            header={"Num days:"}
                            ipClass="mt-1 !bg-1 mt-3 mb-5"
                            value={numDays.toString()}
                            onChange={(val) => {
                                if (!isNaN(val))
                                    setNumDays(Number(val));
                            }}
                        />
                    </div>
                    <div className="w-[10%] mb-5 ml-5 pt-[40px]">
                        <BlueBtn onClick={() => { setPoolsState({ ...poolsState, pairAddress: undefined }) }}>Back to Pools List</BlueBtn>
                    </div>
                </div></>}
            Cards={[
                <PoolAPRChart data={data} numDays={numDays} />,
                <PoolPriceChart data={data} numDays={numDays} reverse={false} />,
                <PoolLiqVolumeChart data={data} numDays={numDays} />,

                <PoolPriceChart data={data} numDays={numDays} reverse={true} />,
            ]}
            other={<PoolHistoryTable data={data} />}
        />;
    }
}