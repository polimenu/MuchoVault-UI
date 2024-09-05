import { useMemo } from "react";
import { Chart } from "react-charts";
import { Card } from "@Views/Common/Card/Card";
import { IMuchoIndexDailyPrice } from "../IndexAtom";

export const MuchoIndexDailyPriceChart = ({ data }: { data: IMuchoIndexDailyPrice[] }) => {
    type Price = {
        primary: string;
        price: number;
    }

    type PriceSeries = {
        label: string,
        data: Price[]
    }

    const series: PriceSeries[] = [
        {
            label: 'Price',
            data: data.map(p => {
                return {
                    primary: p.date,
                    price: p.price
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
    const secondaryAxes: {
        getValue: (datum: { price: number }) => number,
        elementType: 'line'
    }[] = useMemo(
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
            top={<></>}
            middle={
                <div className="w-full h-[20vw]">
                    <Chart<Price>
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