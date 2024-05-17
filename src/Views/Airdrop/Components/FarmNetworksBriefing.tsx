import { Display } from "@Views/Common/Tooltips/Display";
import { addressSummary } from "@Views/Common/Utils";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";
import { IFarmBalance, IFarmNetwork, IFarmNetworkBriefing } from "../AirdropAtom";
import TransactionTable from "@Views/Ramp/Components/TransactionTable";

export const FarmNetworksBriefing = ({ farmNetworkBriefings, prices, setNetwork }: { farmNetworkBriefings?: IFarmNetworkBriefing[], prices: any, setNetwork: any }) => {
    if (!farmNetworkBriefings) {
        return <Skeleton
            key="FarmNetwork"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {

        //console.log("PRICES", prices);
        console.log("farmNetworkBriefings", farmNetworkBriefings);

        const uniqueTokens: string[] = [];

        //console.log("BRIEFINGS", farmNetworkBriefings);
        for (let inet in farmNetworkBriefings) {
            for (let it in farmNetworkBriefings[inet].balances) {
                const bal = farmNetworkBriefings[inet].balances[it];
                if (uniqueTokens.indexOf(it) < 0)
                    uniqueTokens.push(it);
            }
        }
        uniqueTokens.sort((a, b) => {
            const va = a.startsWith("USD") ? 1 : -1;
            const vb = b.startsWith("USD") ? 1 : -1;
            return va - vb;
        })
        //console.log("uniqueTokens", uniqueTokens);

        const displayValue = (token: string, balance: number, useColors: boolean = false, addClass: string = "", network: string = "") => {
            let classColors = "";
            if (useColors) {
                classColors = balance > 0 ? "green" : "red";
            }
            //console.log("Test prices", token, prices[token], prices)
            if (prices[token]) {
                //return `${roundTo(balance, 6)} ($ ${roundTo(prices[token] * balance, 2)})`;
                return <div key={token + "_" + network}><Display className={`!justify-start inline ${classColors} ${addClass}`} data={balance} precision={balance > 1000 ? 0 : 3} />
                    &nbsp;
                    ($ <Display className={`!justify-start inline ${addClass}`} data={prices[token] * balance} precision={0} />)
                </div>
            }

            return <Display key={token + "_" + network} className={`!justify-start inline ${classColors} ${addClass}`} data={balance} precision={0} />;
        }

        const headerJSX = [
            { id: "w", label: "Network" },
            ...uniqueTokens.map(tk => { return { id: `tk_${tk}`, label: tk } })
        ];

        let dashboardData = [];

        const totals = [];
        for (let it in uniqueTokens) {
            const token = uniqueTokens[it];
            let total = 0;
            for (let inet in farmNetworkBriefings) {
                for (let it in farmNetworkBriefings[inet].balances) {
                    const bal = farmNetworkBriefings[inet].balances[it];
                    if (it == token) {
                        total += bal;
                    }
                }
            }

            totals.push({ token: token, total: total });
        }

        dashboardData.push([
            <b key="totalCol">TOTAL</b>,
            ...totals.map(tk => displayValue(tk.token, tk.total, false, "bold", "total"))
        ]);


        for (let inet in farmNetworkBriefings) {
            const netValues: any[] = [farmNetworkBriefings[inet].network]
            for (let it in uniqueTokens) {
                const token = uniqueTokens[it];
                let val = 0;
                for (let it in farmNetworkBriefings[inet].balances) {
                    const bal = farmNetworkBriefings[inet].balances[it];
                    if (it == token) {
                        val += bal;
                    }
                }
                netValues.push(displayValue(token, val, false, "", farmNetworkBriefings[inet].network));
            }
            dashboardData.push(netValues);
        }

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
                <div className={`${className}`}>
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
            return <CellContent
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
                if (idx > 0)
                    setNetwork(dashboardData[idx][0]);
            }}
            widths={['15%', ...uniqueTokens.map(u => `${Math.round(85 / uniqueTokens.length)}%`)]}
            shouldShowMobile={true}
        />;
    }
}