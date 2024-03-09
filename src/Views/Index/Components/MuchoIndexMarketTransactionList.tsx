import { Display } from "@Views/Common/Tooltips/Display";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { ReactNode } from "react";
import TransactionTable from "./TransactionTable";
import { formatDate } from "@Views/Ramp/Utils";
import { BlueBtn } from "@Views/Common/V2-Button";
import { useIndexMarketInteractionCalls } from "../Hooks/useIndexMarketInteractionCalls";
import { IMuchoTokenMarketData } from "../IndexAtom";

export const MuchoIndexTransactionList = ({ data, transactions }: { data: IMuchoTokenMarketData, transactions: any[] }) => {
    if (!data || !transactions) {
        return <Skeleton
            key="OnRampTransactionsCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {
        const { cancelBuyCall, cancelSellCall } = useIndexMarketInteractionCalls(data);
        const headerJSX = [
            //  { orderPosition: 1, orderType: "SELL", orderStatus: "PENDING", remitant: "0x00", amount: 100, fee: 2, date: 1707490959, attempts: 0, lastAttempt: 0 },
            { id: "tid", label: t("index.Transaction ID") },
            { id: "type", label: t("index.Type") },
            { id: "status", label: t("index.Status") },
            { id: "amount", label: t("index.Amount") },
            { id: "date", label: t("index.Date") },
            { id: "action", label: t("index.Action") },
        ];

        const dashboardData = transactions.map(t => {
            return [
                t.orderPosition,
                t.orderType,
                t.orderStatus,
                t.amount,
                formatDate(t.date * 1000),
                t.orderStatus == "PENDING" ? <><BlueBtn className='!w-fit px-4 rounded-sm !h-7 m-auto' onClick={() => { t.orderType == "BUY" ? cancelBuyCall(t.orderPosition) : cancelSellCall(t.orderPosition) }} >Cancel Order</BlueBtn></> : <span></span>
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
            let classNames = "";/*
            if (currentData.indexOf("COMPLETED") > 0)
                classNames += "green";
            else if (currentData.indexOf("REJECTED") > 0)
                classNames += "red";*/
            //console.log("currentData", currentData);
            return <CellContent
                content={[
                    <Display
                        data={currentData}
                        className="!justify-start"
                        precision={col == 0 ? 0 : 2}
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
                    widths={['15%', '5%', '20%', '20%', '20%', '20%']}
                    shouldShowMobile={true}
                />
            </div>
        </>;
    }
}