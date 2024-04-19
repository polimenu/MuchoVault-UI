import { useMemo } from "react";
import { IPoolDetail } from "../poolsAtom";
import { Chart } from "react-charts";
import { Card } from "@Views/Common/Card/Card";

export const PoolLiqVolumeChart = ({ data, numDays }: { data: IPoolDetail, numDays: number }) => {
    type NumSerie = {
        primary: number;
        value: number;
    }

    type LiqVolumeSerie = {
        label: string,
        data: NumSerie[]
    }

    const series: LiqVolumeSerie[] = [
        {
            label: 'TVL',
            data: data.history.sort((a, b) => a.date - b.date)
                .slice(data.history.length - numDays)
                .map(h => {
                    return {
                        primary: h.date,
                        value: h.Liquidity
                    }
                })
        },
        {
            label: 'Volume',
            data: data.history.sort((a, b) => a.date - b.date)
                .slice(data.history.length - numDays)
                .map(h => {
                    return {
                        primary: h.date,
                        value: h.Volume
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
                getValue: (datum: { value: number }) => datum.value,
                elementType: 'bar',
            },
        ],
        []
    )

    return (
        <Card
            top={<>TVL vs Volume</>}
            middle={
                <div className="w-full h-[20vw]">
                    <Chart<NumSerie>
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