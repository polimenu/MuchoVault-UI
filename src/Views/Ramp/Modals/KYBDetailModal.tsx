
import { useAtom } from "jotai";
import { rampAdminDataAtom, rampAtom } from "../rampAtom";
import { ReactNode } from "react";
import { formatDate } from "../Utils";
import { Display } from "@Views/Common/Tooltips/Display";
import { Section } from "@Views/Common/Card/Section";
import TransactionTable from "../Components/TransactionTable";



const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const KybDetailModal = () => {
    const [pageState, setPageState] = useAtom(rampAtom);
    const [rampAdminData] = useAtom(rampAdminDataAtom);
    const uid = pageState.auxModalData.uid;
    const kyb = rampAdminData.KYBList.find(k => k.user_id == uid);

    if (!kyb) {
        return <div>No data found!</div>;
    }

    const headerJSX = [
        { id: "date", label: "Date" },
        { id: "status", label: "Status" },
    ];

    const dashboardData = kyb.interactions.map(t => {
        return [
            formatDate(t.date),
            t.subtype,
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
        Heading={<div className={topStyles}>KYC Processes</div>}
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
                onRowClick={(i) => { setPageState({ ...pageState, isModalOpen: true, activeModal: "INTERACTION_DETAIL", auxModalData: { interaction: kyb.interactions[i], bakPageState: pageState } }) }}
                widths={['34%', '33%', '33%']}
                shouldShowMobile={true}
            />
        </div>}
    />

}