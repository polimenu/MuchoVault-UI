import { useAtom } from "jotai";
import { ILead, usersAtom } from "../usersAtom";
import { ReactNode, useState } from "react";
import { Skeleton } from "@mui/material";
import { Display } from "@Views/Common/Tooltips/Display";
import { Section } from "@Views/Common/Card/Section";
import BufferInput from "@Views/Common/BufferInput";
import UserTable from "./UserTable";
import { BlueBtn } from "@Views/Common/V2-Button";
import { btnClasses } from "@Views/Earn/Components/EarnButtons";
import { TableAligner } from "@Views/Common/TableAligner";
import { tooltipKeyClasses, tooltipValueClasses, wrapperClasses } from "@Views/Earn/Components/EarnCards";
import { formatDate } from "@Views/Ramp/Utils";

export const UserList = ({ allUserList }: { allUserList?: ILead[] }) => {
    const [pageState, setPageState] = useAtom(usersAtom);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(10);

    const [email, setEmail] = useState("");
    const [plans, setPlans] = useState<string[]>([])
    let userList = (email && allUserList) ? allUserList.filter(l => l.email.toLowerCase().indexOf(email.toLocaleLowerCase()) >= 0) : allUserList;
    if (userList && plans.length > 0) {
        userList = userList.filter(u => {
            if (u.plans) {
                for (const plan of u.plans) {
                    if (plans.indexOf(plan.planName) >= 0)
                        return true;
                }
            }
            return false;
        })
    }
    const uniquePlans = allUserList ? allUserList.filter(u => u.plans && u.plans.length > 0).map(u => u.plans).flat().map(p => p?.planName).filter((p, i, a) => a.indexOf(p) == i) : [];
    //console.log("uniquePlans", uniquePlans);
    //console.log("userList", userList?.length);
    //console.log("allUserList", allUserList?.length);
    console.log("plans", plans);

    const topStyles = 'mx-3 text-f22';
    const descStyles = 'mx-3';

    if (!userList) {
        return <Skeleton
            key="UserListCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }
    else {
        const headerJSX = [
            { id: "name", label: "Name" },
            { id: "email", label: "E-mail" },
            { id: "mailStatus", label: "Newsletter" },
            { id: "mailSubscribed", label: "Last Subscribed" },
            { id: "mailUnsubscribed", label: "Last Unsubscribed" },
            { id: "numNfts", label: "#NFTs" },
            { id: "nfts", label: "NFTs" },
        ];


        const counter = {
            total: userList.length,
            subscribed: userList.filter(k => k.subscriptionStatus == "Subscribed").length,
            withPlan: userList.filter(k => k.plans && k.plans.length > 0).length,
        }


        //const slicedUserList = userList.slice(from, to);
        const dashboardData = userList.map(t => {
            return {
                name: (t.name ?? " ") + " " + (t.surname ?? " "),
                email: t.email,
                mailStatus: t.subscriptionStatus,
                mailSubscribed: formatDate(t.subscriptionTS),
                mailUnsubscribed: t.unsubscriptionDate ? t.unsubscriptionDate.toString() : " ",
                numNfts: t.plans ? t.plans.length : 0,
                nfts: t.plans ? t.plans.map(p => <div className="!justify-start clear-right" key={`planUser_${p.nftAddress}_${t.email}`}>
                    <Display className="!justify-start" data={p.planName} content={<span>
                        <TableAligner
                            keysName={["NFT", "Start", "Expiration"]}
                            keyStyle={tooltipKeyClasses}
                            valueStyle={tooltipValueClasses}
                            values={[<div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={p.planName}
                                />
                            </div>,
                            <div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={formatDate(p.startTimeTs)}
                                />
                            </div>,
                            <div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={formatDate(p.expirationTimeTs)}
                                />
                            </div>,]}
                        ></TableAligner>
                    </span>} />
                </div>) : ""
                //console.log("dashboardData", dashboardData);
            }
        });


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
                                className={`${classNames?.length >= key ? classNames[key] : null} ${key && !preventDefault && " text-4 "
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
            //console.log("Showing", row, col, sortedData)
            const currentData = sortedData && sortedData[row] ? sortedData[row][headerJSX[col].id] : "";
            //console.log("currentData", currentData);
            return <CellContent
                content={[
                    <Display
                        data={currentData}
                        className="!justify-start !block"
                    />,
                ]}
            />;
        }


        return <Section
            Heading={<div className={topStyles}>Users ({`${counter.total} users, ${counter.subscribed} subscribed, ${counter.withPlan} with NFT`})</div>}
            subHeading={
                <>
                    <div className={descStyles + " flex"}>
                        <div className='inline'>
                            From <BufferInput placeholder={"0"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={from.toString()} onChange={(val) => { setFrom(Number(val)); }} />
                        </div>
                        <div className='inline ml-5'>
                            to <BufferInput placeholder={"20"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={to.toString()} onChange={(val) => { setTo(Number(val)); }} />
                        </div>
                        <div className='inline ml-5'>
                            Email:
                            <BufferInput placeholder={"a@a.com"} bgClass="!bg-1" ipClass="mt-1" className='w-[15vw]' value={email} onChange={(val) => { setEmail(val) }} />
                        </div>
                    </div>
                    <div className={descStyles + " flex mt-5"}>
                        {uniquePlans.map(p => <BlueBtn key={`btn_${p?.replaceAll(" ", "")}`} onClick={() => {
                            if (plans.indexOf(p) >= 0) {
                                setPlans(plans.filter(pl => pl != p));
                            }
                            else {
                                setPlans([...plans, p]);
                            }
                        }} className={btnClasses + " mr-5 " + (plans.indexOf(p) >= 0 ? " bg-green " : "")}>{p}</BlueBtn>)}
                    </div>
                </>
            }
            other={<div>
                <UserTable
                    defaultSortId="direction"
                    defaultOrder="desc"
                    headerJSX={headerJSX}
                    cols={headerJSX.length}
                    data={dashboardData}
                    rows={dashboardData?.length}
                    bodyJSX={bodyJSX}
                    loading={!dashboardData.length}
                    onRowClick={(idx) => {
                        /*const tid = slicedUserList[idx].transaction_id;
                        setPageState({ ...pageState, isModalOpen: true, activeModal: "ADMIN_TRX_DETAIL", auxModalData: { tid } })*/
                    }}
                    widths={["15%", "15%", "10%", "15%", "10%", "5%", "30%"]}
                    shouldShowMobile={true}
                    from={from}
                    to={to}
                />
            </div>}
        />
    }
}