import { useAtom } from "jotai";
import { rampAdminDataAtom, rampAtom } from "../rampAtom";
import { ReactNode } from "react";
import { formatDate } from "../Utils";
import { addressSummary } from "@Views/Common/Utils";
import { Display } from "@Views/Common/Tooltips/Display";
import { Section } from "@Views/Common/Card/Section";
import TransactionTable from "../Components/TransactionTable";



const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const TrxDetailModal = () => {
    const [pageState, setPageState] = useAtom(rampAtom);
    const [rampAdminData] = useAtom(rampAdminDataAtom);
    const tid = pageState.auxModalData.tid;
    //console.log("******ORL************", rampAdminData.OnRampList);
    const offramp = rampAdminData.OffRampList.find(r => r.transaction_id == tid);
    const onramp = rampAdminData.OnRampList.find(r => r.transaction_id == tid);
    //console.log("******onramp************", onramp);
    //console.log("******offramp************", offramp);
    const trx = offramp ? offramp : onramp;

    if (!trx) {
        return <div>No data found ({tid})!</div>;
    }

    //console.log("trx", trx);

    const headerJSX = [
        { id: "date", label: "Date" },
        { id: "status", label: "Status" },
        { id: "tx", label: "Tx Hash" },
        { id: "fiat", label: "FIAT" },
        { id: "crypto", label: "Crypto" },
        { id: "fees", label: "Fees" },
        { id: "exchange", label: "Exchange Rate" },
    ];

    const dashboardData = trx.interactions.map(t => {
        return [
            formatDate(t.date),
            t.data.status.replaceAll("_", " "),
            t.data.transactionHash ? addressSummary(t.data.transactionHash) : "",
            `${t.data.amountFiat ?? ""} ${t.data.currencyFiat ?? ""}`,
            `${t.data.amountCrypto ?? ""} ${t.data.currencyCrypto ?? ""} (${t.data.chain ?? ""})`,
            t.data.fees ? t.data.fees.toString() : "",
            t.data.exchangeRate ? t.data.exchangeRate.toString() : ""
        ]
    });
    //console.log("dashboardData", dashboardData);

    interface ICellContent {
        content: ReactNode[];
        className?: string;
        classNames?: string[];
        preventDefault?: boolean;
    }

    const CellContent: React.FC<ICellContent> = ({
        content,
        classNames,
        preventDefault,
        className,
    }) => {
        if (!content.length) return;
        return (
            <div className={`${className} flex flex-col`}>
                {content.map((cellInfo, key) => {
                    return (
                        <span
                            className={`${key && !preventDefault && " text-4 "}`}
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
        const currentData = sortedData[row][col] ?? "";
        let classNames = "";
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


    return <Section
        Heading={<div className={topStyles}>Transaction Details ({tid})</div>}
        subHeading={
            <div className={descStyles}>
            </div>
        }
        other={<div>
            <TransactionTable
                defaultSortId="direction"
                defaultOrder="desc"
                headerJSX={headerJSX}
                cols={headerJSX.length}
                data={dashboardData}
                rows={dashboardData?.length}
                bodyJSX={bodyJSX}
                loading={!dashboardData.length}
                onRowClick={(i) => { setPageState({ ...pageState, isModalOpen: true, activeModal: "INTERACTION_DETAIL", auxModalData: { interaction: trx.interactions[i], bakPageState: pageState } }) }}
                widths={['15%', '15%', '20%', '10%', '10%', '10%']}
                shouldShowMobile={true}
            />
        </div>}
    />

}