import { Display } from "@Views/Common/Tooltips/Display";
import { addressSummary } from "@Views/Common/Utils";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";
import { IFarmNetwork, IFarmNetworkBriefing } from "../AirdropAtom";
import TransactionTable from "@Views/Ramp/Components/TransactionTable";


export const FarmNetworkList = ({ farmNetwork, prices }: { farmNetwork?: IFarmNetwork, prices: any }) => {
    if (!farmNetwork) {
        return <Skeleton
            key="FarmNetwork"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {

        //console.log("PRICES", prices);

        const uniqueTokens = farmNetwork.wallets[0].balances.map(b => b.token);

        farmNetwork.wallets.sort((a, b) => a.nativeBalance - b.nativeBalance);

        const displayValue = (token: string, balance: number, useColors: boolean = false, addClass: string = "") => {
            let classColors = "";
            if (useColors) {
                classColors = balance > 0 ? "green" : "red";
            }
            //console.log("Test prices", token, prices[token], prices)
            if (prices[token]) {
                //return `${roundTo(balance, 6)} ($ ${roundTo(prices[token] * balance, 2)})`;
                return <><Display className={`!justify-start inline ${classColors} ${addClass}`} data={balance} precision={6} />
                    &nbsp;
                    ($ <Display className={`!justify-start inline ${addClass}`} data={prices[token] * balance} precision={2} />)
                </>
            }

            return <Display className={`!justify-start inline ${classColors} ${addClass}`} data={balance} precision={2} />;
        }

        const headerJSX = [
            { id: "w", label: "Wallet" },
            { id: "n", label: farmNetwork.nativeToken },
            ...uniqueTokens.map(tk => { return { id: `tk_${tk}`, label: tk } })
        ];

        let dashboardData = [];

        const totals = farmNetwork.wallets.reduce((p, c) => {
            return {
                wallet: <b>TOTAL</b>,
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
            displayValue(farmNetwork.nativeToken, totals.nativeBalance, true, "bold"),
            ...totals.balances.map(tk => displayValue(tk.token, tk.balance, false, "bold"))
        ]);

        dashboardData = dashboardData.concat(farmNetwork.wallets.map(w => {
            return [
                (w.name),
                displayValue(farmNetwork.nativeToken, w.nativeBalance, true),
                ...w.balances.map(tk => displayValue(tk.token, tk.balance))
            ]
        }));

        //console.log("dashboardData", dashboardData);

        interface ICellContent {
            content: ReactNode[];
            className?: string;
            classNames?: string[];
            preventDefault?: boolean;
            mykey?: string;
        }

        const CellContent: React.FC<ICellContent> = ({ mykey, content, classNames, preventDefault, className, }) => {

            if (!content.length) return <></>;
            return (
                <div key={mykey} className={`${className}`}>
                    {content.map((cellInfo, key) => {
                        return cellInfo;
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
            /*if (col == 1) {
                if (currentData > 0)
                    classNames += "green";
                else
                    classNames += "red";
            }*/
            //console.log("currentData", currentData);
            return <CellContent mykey={"cellfwlist_" + row.toString() + "_" + col.toString()}
                content={[
                    currentData,
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