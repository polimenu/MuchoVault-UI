import { useMemo } from "react";
import { IPoolDetail } from "../poolsAtom";
import { Chart } from "react-charts";
import { Card } from "@Views/Common/Card/Card";

export const PoolAPRChart = ({ data }: { data: IPoolDetail }) => {
    type AprSerie = {
        primary: number;
        apr: number;
    }

    type AprSeries = {
        label: string,
        data: AprSerie[]
    }

    const series: AprSeries[] = [
        {
            label: 'APR',
            data: data.history.map(h => {
                return {
                    primary: h.date,
                    apr: h.apr
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
                getValue: (datum: { apr: number }) => datum.apr,
                elementType: 'line',
            },
        ],
        []
    )

    return (
        <Card
            top={<>Daily APR (%)</>}
            middle={
                <div className="w-full h-[20vw]">
                    <Chart<AprSerie>
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