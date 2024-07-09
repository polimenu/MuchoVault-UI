import { Display } from "@Views/Common/Tooltips/Display";
import { addressSummary } from "@Views/Common/Utils";
import { IRampTransaction } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { ReactNode } from "react";
import TransactionTable from "../TransactionTable";

export const RampTransactionListCard = ({ transactions }: { transactions?: IRampTransaction[] }) => {
    if (!transactions) {
        return <Skeleton
            key="OnRampTransactionsCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {
        const headerJSX = [
            { id: "tid", label: t("ramp.Transaction ID") },
            { id: "direction", label: t("ramp.Direction") },
            { id: "input", label: t("ramp.Input") },
            { id: "output", label: t("ramp.Output") },
            { id: "status", label: t("ramp.Status") },
        ];

        const dashboardData = transactions.map(t => {
            return [
                addressSummary(t.input.transaction_id),
                t.direction,
                `${t.input.amount} ${t.input.currency}`,
                t.output.currency,
                t.status
            ]
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
            const currentData = sortedData[row][col];
            let classNames = "";
            if (!currentData)
                return "";
            if (currentData.indexOf("COMPLETED") > 0)
                classNames += "green";
            else if (currentData.indexOf("REJECTED") > 0)
                classNames += "red";
            //console.log("currentData", currentData);
            return <CellContent
                content={[
                    <Display
                        data={currentData}
                        className="!justify-start"
                    />,
                ]}
                className={classNames}
            />;
        }


        return <>
            <div>
                <TransactionTable
                    defaultSortId="direction"
                    defaultOrder="desc"
                    headerJSX={headerJSX}
                    cols={headerJSX.length}
                    data={dashboardData}
                    rows={dashboardData?.length}
                    bodyJSX={bodyJSX}
                    loading={!dashboardData.length}
                    onRowClick={(idx) => {
                        //navigate(`/binary/${dashboardData[idx].pair}`);
                    }}
                    widths={['30%', '20%', '15%', '15%', '20%']}
                    shouldShowMobile={true}
                />
            </div>
        </>;
    }
}