import { useMemo } from "react";
import { IPoolDetail } from "../poolsAtom";
import { Chart } from "react-charts";
import { Card } from "@Views/Common/Card/Card";

export const PoolPriceChart = ({ data, numDays, reverse }: { data: IPoolDetail, numDays: number, reverse: boolean }) => {
    type PriceSerie = {
        primary: number;
        price: number;
    }

    type PriceSeries = {
        label: string,
        data: PriceSerie[]
    }

    const series: PriceSeries[] = [
        {
            label: 'APR',
            data: data.history.sort((a, b) => a.date - b.date)
                .slice(data.history.length - numDays)
                .map(h => {
                    return {
                        primary: h.date,
                        price: reverse ? 1 / h.priceNative : h.priceNative
                    }
                })
        },
    ]

    const primaryAxis = useMemo(
        () => ({
            getValue: (datum: { primary: string }) => datum.primary,
        }),
        []
    )
    const secondaryAxes = useMemo(
        () => [
            {
                getValue: (datum: { price: number }) => datum.price,
                elementType: 'line',
            },
        ],
        []
    )

    return (
        <Card
            top={<>Price ({reverse ? `${data.BaseToken} / ${data.QuoteToken}` : `${data.QuoteToken} / ${data.BaseToken}`})</>}
            middle={
                <div className="w-full h-[20vw]">
                    <Chart<PriceSerie>
                        options={{
                            data: series,
                            primaryAxis,
                            secondaryAxes,
                            dark: true,
                        }}
                    />
                </div>
            }
        />
    )
}