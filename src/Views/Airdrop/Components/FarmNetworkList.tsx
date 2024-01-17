import { Display } from "@Views/Common/Tooltips/Display";
import { addressSummary } from "@Views/Common/Utils";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";
import { IFarmNetwork } from "../AirdropAtom";
import TransactionTable from "@Views/Ramp/Components/TransactionTable";

export const FarmNetworkList = ({ farmNetwork }: { farmNetwork?: IFarmNetwork }) => {
    if (!farmNetwork) {
        return <Skeleton
            key="FarmNetwork"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {
        const uniqueTokens = farmNetwork.wallets[0].balances.map(b => b.token);

        farmNetwork.wallets.sort((a, b) => a.nativeBalance - b.nativeBalance)

        const headerJSX = [
            { id: "w", label: "Wallet" },
            { id: "n", label: farmNetwork.nativeToken },
            ...uniqueTokens.map(tk => { return { id: `tk_${tk}`, label: tk } })
        ];

        const dashboardData = farmNetwork.wallets.map(w => {
            return [
                (w.name),
                w.nativeBalance,
                ...w.balances.map(tk => tk.balance)
            ]
        });

        const totals = farmNetwork.wallets.reduce((p, c) => {
            return {
                wallet: "TOTAL",
                nativeBalance: p.nativeBalance + c.nativeBalance,
                balances: uniqueTokens.map((tk, i) => {
                    return {
                        token: tk,
                        balance: p.balances[i].balance + c.balances[i].balance,
                    }
                })
            };
        })
        dashboardData.push([
            (totals.wallet),
            totals.nativeBalance,
            ...totals.balances.map(tk => tk.balance)
        ]);

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
            if (col == 1) {
                if (currentData > 0)
                    classNames += "green";
                else
                    classNames += "red";
            }
            //console.log("currentData", currentData);
            return <CellContent
                content={[
                    <Display
                        data={currentData}
                        className="!justify-start"
                        precision={col == 1 ? 6 : 0}
                    />,
                ]}
                className={classNames}
            />;
        }


        return <TransactionTable
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
            widths={['40%', '20%', ...uniqueTokens.map(u => `${Math.round(40 / uniqueTokens.length)}%`)]}
            shouldShowMobile={true}
        />;
    }
}