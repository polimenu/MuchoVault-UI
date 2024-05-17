import { Display } from "@Views/Common/Tooltips/Display";
import { addressSummary } from "@Views/Common/Utils";
import { Skeleton } from "@mui/material";
import { ReactNode } from "react";
import { IFarmNetwork, IFarmNetworkBriefing } from "../AirdropAtom";
import TransactionTable from "@Views/Ramp/Components/TransactionTable";


export const FarmNetworkList = ({ farmNetwork, prices, setWallet }: { farmNetwork?: IFarmNetwork, prices: any, setWallet: any }) => {
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
        uniqueTokens.push(farmNetwork.nativeToken);

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
            ...uniqueTokens.map(tk => { return { id: `${tk}`, label: tk } })
        ];
        //console.log("headerJSX", headerJSX);

        let dashboardData = [];

        //console.log("farmNetwork.wallets", farmNetwork.wallets);
        const walletsCooked = farmNetwork.wallets.map(w => {
            const res = {
                w: w.name,
                [farmNetwork.nativeToken]: w.nativeBalance,
            }
            uniqueTokens.forEach((tk, i) => {
                res[tk] = (tk == farmNetwork.nativeToken) ? w.nativeBalance : w.balances.find(b => b.token == tk).balance;
            })
            return res;
        });

        const totals = walletsCooked.reduce((p, c) => {
            const res = {};
            uniqueTokens.forEach(tk => {
                res[tk] = p[tk] + c[tk];
            })
            return res;
        })
        //console.log("totals*********", totals);


        dashboardData.push({
            w: "TOTAL",
            ...totals
        });

        //console.log("111*********", dashboardData);

        dashboardData = dashboardData.concat(walletsCooked);

        //console.log("222*********", dashboardData);

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
            const token = headerJSX[col].id;
            const currentData = sortedData[row][token];
            const val = displayValue(token, currentData, (col > 0), sortedData[row].w == "TOTAL" ? "bold" : "");
            let classNames = "";
            /*if (col == 1) {
                if (currentData > 0)
                    classNames += "green";
                else
                    classNames += "red";
            }*/
            //if (col == 3 && row == 3)
            //    console.log("currentData", currentData);
            return <CellContent mykey={"cellfwlist_" + row.toString() + "_" + col.toString()}
                content={[val]}
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
                const w = dashboardData[idx].w;
                if (w != "TOTAL") {
                    setWallet(w);
                    //console.log("Set wallet!", w);
                }
                else {
                    setWallet("");
                }
            }}
            widths={['40%', '20%', ...uniqueTokens.map(u => `${Math.round(40 / uniqueTokens.length)}%`)]}
            shouldShowMobile={true}
        />;
    }
}