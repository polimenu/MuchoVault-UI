import { useMemo } from "react";
import { IPoolDetail } from "../poolsAtom";
import { Chart } from "react-charts";
import { Card } from "@Views/Common/Card/Card";

export const PoolPriceChart = ({ data, reverse, min, max }: { data: IPoolDetail, reverse: boolean, min: number, max: number }) => {
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
            label: 'Price',
            data: data.history.map(h => {
                return {
                    primary: h.date,
                    price: reverse ? 1 / h.priceNative : h.priceNative
                }
            })
        },
        {
            label: 'Min',
            data: data.history.map(h => {
                return {
                    primary: h.date,
                    price: min
                }
            })
        },
        {
            label: 'Max',
            data: data.history.map(h => {
                return {
                    primary: h.date,
                    price: max
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
            top={<>Price ({reverse ? `${data.QuoteToken} / ${data.BaseToken}` : `${data.BaseToken} / ${data.QuoteToken}`})</>}
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