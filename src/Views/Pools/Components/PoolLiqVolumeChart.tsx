import { useMemo } from "react";
import { IPoolDetail } from "../poolsAtom";
import { Chart } from "react-charts";
import { Card } from "@Views/Common/Card/Card";

export const PoolLiqVolumeChart = ({ data }: { data: IPoolDetail }) => {
    type NumSerie = {
        primary: Date;
        value: number;
    }

    type LiqVolumeSerie = {
        label: string,
        data: NumSerie[],
        secondaryAxisId?: string
    }

    const series: LiqVolumeSerie[] = [
        {
            label: 'TVL',
            data: data.history.map((h, i) => {
                return {
                    primary: h.date,
                    value: h.Liquidity
                }
            })
        },
        {
            label: 'Volume',
            data: data.history.map((h, i) => {
                return {
                    primary: h.date,
                    value: h.Volume
                }
            }),
        },
        {
            label: 'Vol / TVL',
            data: data.history.map(h => {
                return {
                    primary: h.date,
                    value: h.Volume / h.Liquidity
                }
            }),
            secondaryAxisId: "2"
        },
    ]

    //console.log("SERIES", series)

    const primaryAxis = useMemo(
        () => ({
            getValue: (datum: { primary: Date }) => datum.primary,
            //padBadRange: false,
            //scaleType: "band",
        }),
        []
    )
    const secondaryAxes = useMemo(
        () => [
            {
                getValue: (datum: { value: number }) => datum.value,
                elementType: 'line',
            },
            {
                id: "2",
                getValue: (datum: { value: number }) => datum.value,
                elementType: 'line',
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