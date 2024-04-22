import BufferInput from "@Views/Common/BufferInput";
import { IPoolDetail } from "../poolsAtom";
import { Card } from "@Views/Common/Card/Card";
import { useEffect, useState } from "react";
import { BlueBtn } from "@Views/Common/V2-Button";

export const PoolAPRCalc = ({ data, reverse }: { data: IPoolDetail, reverse: boolean }) => {
    const [liq, setLiq] = useState(1000);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [tokenRatio, setTokenRatio] = useState({ xAmount: 0, yAmount: 0, xPercentage: 0, yPercentage: 0 });

    const lastHist = data.history.sort((a, b) => b.date - a.date)[0];
    const lastPrice = lastHist.priceNative;
    const prices = data.history.map(h => h.priceNative);
    const avg = prices.reduce((p, c) => p + c) / data.history.length;
    const stDev = Math.sqrt(prices.map(p => (p - avg) ** 2).reduce((p, c) => p + c) / data.history.length);
    const tikFactor = 1.0001;
    const feeDelta = (data.feeTier !== 0) ? data.feeTier * 2 / 100 : 200;


    const applyRange = (range: number[]) => {
        setMin(closestTikPrice(range[0]));
        setMax(closestTikPrice(range[1]));
    }

    const closestTik = (price: number) => {
        const pe = (Math.log(price) / Math.log(tikFactor)) / feeDelta;
        return Math.round(pe);
    }

    const priceFromTik = (tik: number) => {
        return Math.round(10000 * Math.pow(tikFactor, feeDelta * tik)) / 10000;
    }

    const closestTikPrice = (price: number) => {
        return priceFromTik(closestTik(price));
    }

    const shiftTik = (price: number, step: number) => {
        return priceFromTik(closestTik(price) + step);
    }

    const calculateTokensRatio = () => {
        const x = 1;
        const Lx = x * (Math.sqrt(lastPrice) * Math.sqrt(max)) /
            (Math.sqrt(max) - Math.sqrt(lastPrice));

        const y = Lx * (Math.sqrt(lastPrice) - Math.sqrt(min));

        const xPercentage = 100 * lastPrice / (lastPrice + y);
        const yPercentage = 100 * y / (lastPrice + y);

        const MaxX = liq / (lastHist.priceUsd);
        const MaxY = (MaxX) * (lastPrice);

        return {
            xAmount: Math.round(10000 * (MaxX) * (xPercentage) / 100.0) / 10000,
            yAmount: Math.round(10000 * (MaxY) * (yPercentage) / 100.0) / 10000,
            xPercentage: Math.round(10 * xPercentage) / 10,
            yPercentage: Math.round(10 * yPercentage) / 10,
        }
    }

    useEffect(() => {
        setTokenRatio(calculateTokensRatio());
    }, [liq, min, max])

    const wideRange = (lastPrice >= avg) ? [avg - stDev * 1.5, lastPrice + stDev * 2.5] : [lastPrice - stDev * 2.5, avg + stDev * 1.5];
    const narrowRange = [lastPrice - stDev * 1.5, lastPrice + stDev * 1.5];

    return (
        <Card
            top={<>
                <div className="flex">
                    <div className="w-[200px]">APR Calculator</div>
                    <div className="w-full justify-end flex">
                        <BlueBtn onClick={() => { applyRange(wideRange) }} className="!w-[100px] !h-[30px]">Wide</BlueBtn>
                        <BlueBtn onClick={() => { applyRange(narrowRange) }} className="!w-[100px] !h-[30px] ml-5">Narrow</BlueBtn>
                    </div>
                </div>
            </>}
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
                    <div className="flex">
                        <BufferInput
                            className=""
                            bgClass="w-[300px] text-white flex justify-end"
                            header={`Min value (${reverse ? data.BaseToken : data.QuoteToken}):`}
                            ipClass="ml-5 !bg-grey !w-[100px] text-center rounded"
                            value={min.toString()}
                            onChange={(val) => {
                                if (!isNaN(val)) {
                                    setMin(closestTikPrice(val));
                                }
                            }}
                        />
                        <div className="!pt-[4px]">
                            <BlueBtn className="!min-w-[20px] !h-[15px] mb-2" onClick={() => { setMin(shiftTik(min, -1)) }}>-</BlueBtn>
                            <BlueBtn className="!min-w-[20px] !h-[15px]" onClick={() => { setMin(shiftTik(min, 1)) }}>+</BlueBtn>
                        </div>
                    </div>
                    <div className="flex">
                        <BufferInput
                            className=""
                            bgClass="w-[300px] text-white flex justify-end"
                            header={`Max value (${reverse ? data.BaseToken : data.QuoteToken}):`}
                            ipClass="ml-5 !bg-grey !w-[100px] text-center rounded"
                            value={max.toString()}
                            onChange={(val) => {
                                if (!isNaN(val)) {
                                    setMax(closestTikPrice(val));
                                }
                            }}
                        />
                        <div className="!pt-[4px]">
                            <BlueBtn className="!min-w-[20px] !h-[15px] mb-2" onClick={() => { setMax(shiftTik(max, -1)) }}>-</BlueBtn>
                            <BlueBtn className="!min-w-[20px] !h-[15px]" onClick={() => { setMax(shiftTik(max, 1)) }}>+</BlueBtn>
                        </div>
                    </div>
                    <BufferInput
                        className=""
                        bgClass="w-[300px] text-white flex justify-end"
                        header={`Anchor price:`}
                        ipClass="ml-5 !w-[100px] text-center rounded"
                        value={Math.round(10000 * ((min * max) ** (1 / 2))) / 10000}
                        onChange={(val) => { }}
                    />
                    <BufferInput
                        className=""
                        bgClass="w-[300px] text-white flex justify-end"
                        header={`${data.BaseToken} tokens:`}
                        ipClass="ml-5 !text-f12 !w-[100px] text-center rounded"
                        value={`${tokenRatio.xAmount} (${tokenRatio.xPercentage} %)`}
                        onChange={(val) => { }}
                    />
                    <BufferInput
                        className=""
                        bgClass="w-[300px] text-white flex justify-end"
                        header={`${data.QuoteToken} tokens:`}
                        ipClass="ml-5 !text-f12 !w-[100px] text-center rounded"
                        value={`${tokenRatio.yAmount} (${tokenRatio.yPercentage} %)`}
                        onChange={(val) => { }}
                    />
                </div>
            }
        />
    )
}

/*
const calculateApr = () => {

    let totalPeriods = 0;
    let inRangePeriods = 0;
    let totalFees = 0;
    let periodFee = 0;

    // How many std devs are we from the mean
    let stdDevs = (max - min) / stDev;

    const feeParams = [
        { min: 2, max: 3, x1: 2, y1: 1, x2: 3, y2: 0.81 },
        { min: 3, max: 4, x1: 3, y1: 0.81, x2: 4, y2: 0.68 },
        { min: 4, max: 6, x1: 4, y1: 0.68, x2: 6, y2: 0.5 },
        { min: 6, max: 20, x1: 6, y1: 0.5, x2: 20, y2: 0.1 },
        { min: 20, max: 20000000000, x1: 20, y1: 0.1, x2: 100, y2: 0.05 },
    ].find(pars => stdDevs > pars.min && stdDevs <= pars.max);

    const feesWeight = feeParams ?
        ((feeParams.y2 - feeParams.y1) / (feeParams.x2 - feeParams.x1)) * stdDevs + (feeParams.y1 - ((feeParams.y2 - feeParams.y1) / (feeParams.x2 - feeParams.x1)) * feeParams.x1)
        : 1;

    // Moving averages for volume 
    const period = 7;
    const averages = [];

    for (let i = period - 1; i < this.poolDetailedData.length; i++) {
        const volumes = this.poolDetailedData.slice(i - period + 1, i + 1).map(element => element.Volume / 3);
        const sum = volumes.reduce((acc, volume) => acc + volume, 0);
        const average = sum / period;
        averages.push(average);
    }

    console.log(`From the total number of periods: ${this.poolDetailedData.length} we have ${averages.length} periods for the moving averages.`);
    console.log(`Simple Moving Averages for Volume: ${averages}`);




    this.poolDetailedData.forEach(element => {

        totalPeriods++;

        // If within range we count time in range
        // and calculate the fees
        if ((element.priceNative) >= (min) &&
            (element.priceNative) <= (max)) {
            inRangePeriods++;

            // TO-DO: apply the number of tiks reduction
            periodFee = this.myLiquidity * (feesWeight) * (element.Volume / 3) * (this.poolDetailedData[0].feeTier / 1000000) * (1 / (element.Liquidity));
            console.log(`Adding ${inRangePeriods} periods in range - Fees: ${periodFee}`);

        }
        else {
            periodFee = 0;
        }
        totalFees += periodFee;

    });

    this.inRangePercentaje = inRangePeriods * 100 / totalPeriods;
    this.estimatedFees = totalFees;
    this.estimatedAPR = this.estimatedFees * 100 * (365 / (totalPeriods / 3)) * (1 / this.myLiquidity);

    console.log(`${inRangePeriods} periods in range out of ${totalPeriods}`);
    console.log(`The estimated APR is ${this.estimatedAPR}`);


}*/