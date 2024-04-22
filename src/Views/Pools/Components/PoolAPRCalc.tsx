import BufferInput from "@Views/Common/BufferInput";
import { IPoolDetail } from "../poolsAtom";
import { Card } from "@Views/Common/Card/Card";
import { useEffect, useState } from "react";

export const PoolAPRCalc = ({ data, reverse }: { data: IPoolDetail, reverse: boolean }) => {
    const [liq, setLiq] = useState(1000);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const lastHist = data.history.sort((a, b) => b.date - a.date)[0];

    return (
        <Card
            top={<>APR Calculator</>}
            middle={
                <div className="w-[40%] mt-5">
                    <BufferInput
                        className=""
                        bgClass="w-[300px] text-white flex justify-end"
                        header={`Current price:`}
                        ipClass="ml-5 !w-[100px] text-center rounded"
                        value={lastHist.priceNative}
                        onChange={(val) => { }}
                    />
                    <BufferInput
                        className=""
                        bgClass="w-[300px] text-white flex justify-end"
                        header={`Anchor price:`}
                        ipClass="ml-5 !w-[100px] text-center rounded"
                        value={Math.round(10000 * ((min * max) ** (1 / 2))) / 10000}
                        onChange={(val) => { }}
                    />
                    <BufferInput
                        className="justify-end"
                        bgClass="w-[300px] text-white flex justify-end"
                        header={"Liquidity ($):"}
                        ipClass="ml-5 !bg-grey !w-[100px] text-center rounded"
                        value={liq.toString()}
                        onChange={(val) => {
                            if (!isNaN(val)) {
                                setLiq(val);
                            }
                        }}
                    />
                    <BufferInput
                        className=""
                        bgClass="w-[300px] text-white flex justify-end"
                        header={`Min value (${reverse ? data.BaseToken : data.QuoteToken}):`}
                        ipClass="ml-5 !bg-grey !w-[100px] text-center rounded"
                        value={min.toString()}
                        onChange={(val) => {
                            if (!isNaN(val)) {
                                setMin(val);
                            }
                        }}
                    />
                    <BufferInput
                        className=""
                        bgClass="w-[300px] text-white flex justify-end"
                        header={`Min value (${reverse ? data.BaseToken : data.QuoteToken}):`}
                        ipClass="ml-5 !bg-grey !w-[100px] text-center rounded"
                        value={max.toString()}
                        onChange={(val) => {
                            if (!isNaN(val)) {
                                setMax(val);
                            }
                        }}
                    />
                </div>
            }
        />
    )
}