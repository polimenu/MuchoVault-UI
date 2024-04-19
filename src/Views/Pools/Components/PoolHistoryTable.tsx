import { Skeleton } from "@mui/material";
import { IPoolDetail } from "../poolsAtom";
import { ReactNode } from "react";
import { Display } from "@Views/Common/Tooltips/Display";
import PoolHistoryTableDraw from "./PoolHistoryTableDraw";

export const PoolHistoryTable = ({ data }: { data: IPoolDetail }) => {
    //console.log("PoolsTable data", data);
    if (!data) {
        return <Skeleton
            key="PoolsDetail"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {
        const headerJSX = [
            { id: "Date", label: "Date", unit: "", align: "center", precision: undefined },
            { id: "APR", label: "APR", unit: "%", align: "center", precision: 0 },
            { id: "TVL", label: "TVL", unit: "$", align: "center", precision: 0 },
            { id: "Volume", label: "Volume", unit: "$", align: "center", precision: 0 },
            { id: "Fees", label: "Fees", unit: "$", align: "center", precision: 0 },
            { id: "VolTVL", label: "Vol / TVL", unit: "", align: "center", precision: 2 },
        ];

        const dashboardData = data.history.map(h => {
            return {
                Date: h.date,
                APR: h.apr,
                TVL: h.Liquidity,
                Volume: h.Volume,
                Fees: h.fees,
                VolTVL: h.Volume / h.Liquidity,
            }
        });
        //console.log("dashboardData", dashboardData);

        interface ICellContent {
            content: ReactNode[];
            className?: string;
            classNames?: string[];
            preventDefault?: boolean;
        }

        const CellContent: React.FC<ICellContent> = ({ content, classNames, preventDefault, className, }) => {

            if (!content.length) return <></>;
            return (
                <div className={`${className} flex flex-col`}>
                    {content.map((cellInfo, key) => {
                        return (
                            <span
                                className={`${classNames && classNames?.length >= key ? classNames[key] : null} ${key && !preventDefault && " text-4 "
                                    }`}
                                key={key}
                            >
                                {cellInfo}
                            </span>
                        );
                    })}
                </div>
            );
        };

        const bodyJSX = (
            row: number,
            col: number,
            sortedData: typeof dashboardData
        ) => {
            const rowData = sortedData[row];
            const keys = Object.keys(rowData);
            const currentData = sortedData[row][keys[col]];

            //console.log("currentData", currentData);
            return <CellContent
                content={[
                    <Display
                        data={currentData}
                        unit={headerJSX[col].unit}
                        precision={headerJSX[col].precision}
                    />,
                ]}
            />;
        }


        return <div className="mt-[20px]">
            <PoolHistoryTableDraw
                defaultSortId="Date"
                defaultOrder="desc"
                headerJSX={headerJSX}
                cols={headerJSX.length}
                data={dashboardData}
                rows={Math.min(dashboardData?.length, 10)}
                bodyJSX={bodyJSX}
                loading={!dashboardData.length}
                onRowClick={(idx) => {
                    //navigate(`/binary/${dashboardData[idx].pair}`);
                }}
                widths={['17%', '15%', '18%', '19%', '16%', '15%']}
                shouldShowMobile={true}
            />
        </div>;
    }
}