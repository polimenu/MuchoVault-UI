import { useAtom } from "jotai";
import { ILead, usersAtom } from "../usersAtom";
import { ReactNode, useEffect, useState } from "react";
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
    const [currencyConversion, setCurrencyConversion] = useState<{ [currency: string]: number }>({});
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(10);
    /*const [nftStartDate, setNftStartDate] = useState("Loading...");
    const [nftExpDate, setNftExpDate] = useState("Loading...");
    const [tokenIdShowing, setTokenIdShowing] = useState({ tokenId: 0, nftAddress: "" });*/
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [plans, setPlans] = useState<string[]>([])

    /*useEffect(() => {
        if (tokenIdShowing.tokenId > 0 && tokenIdShowing.nftAddress) {
            console.log("finding token id data", tokenIdShowing.tokenId, tokenIdShowing.nftAddress);
            setNftStartDate("Hola");
            setNftExpDate("Adios");
        }

    }, [JSON.stringify(tokenIdShowing)]);*/

    let userList = allUserList;
    if (userList && email) {
        userList = userList.filter(l => l.email.toLowerCase().indexOf(email.toLocaleLowerCase()) >= 0);
    }
    if (userList && name) {
        userList = userList.filter(l => ((l.name ?? "") + " " + (l.surname ?? "")).toLowerCase().indexOf(name.toLocaleLowerCase()) >= 0);
    }
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
    const uniqueCurrencies = allUserList ? allUserList.filter(u => u.payments && u.payments.length > 0).map(u => u.payments).flat().map(p => p?.currency).filter((p, i, a) => a.indexOf(p) == i) : [];
    //const uniqueProducts =
    //Init to exchange = 0.9;
    useEffect(() => {
        if (uniqueCurrencies) {
            const conv: typeof currencyConversion = {};
            for (const c of uniqueCurrencies) {
                if (c) {
                    conv[c] = 0.9;
                }
            }
            setCurrencyConversion(conv);
        }
    }, [JSON.stringify(uniqueCurrencies)]);

    //console.log("uniquePlans", uniquePlans);
    //console.log("userList", userList?.length);
    //console.log("allUserList", allUserList?.length);
    //console.log("plans", plans);

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
            { id: "email", label: "E-mail", resume: 25 },
            { id: "mailStatus", label: "Newsletter", orderBy: "mailStatusPlain" },
            //{ id: "mailSubscribed", label: "Last Subscribed" },
            //{ id: "mailUnsubscribed", label: "Last Unsubscribed" },
            { id: "paid", label: "Paid", orderBy: "paidPlain" },
            { id: "prods", label: "Products", classes: "text-f12" },
            //{ id: "numNfts", label: "#NFTs" },
            { id: "nfts", label: "NFTs", classes: "text-f12 !block" },
        ];




        //const slicedUserList = userList.slice(from, to);
        const dashboardData = userList.map(t => {

            const paymentsGr: { currency: string; net: number }[] = t.payments ? t.payments.filter(p => p).reduce((p, c, i, a) => {
                const cur = (currencyConversion[c.currency] > 0) ? "eur" : c.currency;
                const exch = (currencyConversion[c.currency] > 0) ? currencyConversion[c.currency] : 1;
                const el = p.find(pc => pc.currency == cur);
                const net = (c.net ?? 0) * exch;
                //console.log("ITERATION", c.currency, p.length, el);

                if (el) {
                    el.net += net;
                }
                else {
                    p.push({ currency: cur, net: net });
                }

                return p;
            }, [{ currency: 'eur', net: 0 }]) : [];

            return {
                name: (t.name ?? " ") + " " + (t.surname ?? " "),
                email: t.email,
                mailStatusPlain: t.subscriptionStatus,
                mailStatus: <div className="!justify-start">
                    <Display className="!justify-start" data={t.subscriptionStatus} content={<span>
                        <TableAligner
                            keysName={["Last Subscribed", "Last Unsubscribed"]}
                            keyStyle={tooltipKeyClasses}
                            valueStyle={tooltipValueClasses}
                            values={[<div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={formatDate(t.subscriptionTS)}
                                />
                            </div>,
                            <div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={t.unsubscriptionDate ? t.unsubscriptionDate.toString() : ""}
                                />
                            </div>]}
                        />
                    </span>} />
                </div>,
                //mailSubscribed: formatDate(t.subscriptionTS),
                //mailUnsubscribed: t.unsubscriptionDate ? t.unsubscriptionDate.toString() : " ",
                //numNfts: t.plans ? Math.round(t.plans.length).toString() : "0",
                paid: paymentsGr ? (paymentsGr.map(el => <div className="!justify-start" key={`paymentUser_${el.currency}_${t.email}`}>
                    <Display className="!justify-start" data={el.net} unit={el.currency} precision={0} /></div>)) : "0",
                paidPlain: paymentsGr ? paymentsGr.map(el => el.net).reduce((p, c) => p + c, 0) : 0,
                prods: t.subscriptions ? t.subscriptions.map(s => <div className="!justify-start" key={`subscriptionUser_${s.productCode}_${t.email}`}>
                    <Display className="!justify-start" data={s.productCode} content={<span>
                        <TableAligner
                            keysName={["Start", "Expiration"]}
                            keyStyle={tooltipKeyClasses}
                            valueStyle={tooltipValueClasses}
                            values={[<div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={s.period && s.period.start ? formatDate(s.period.start * 1000) : "?"}
                                />
                            </div>,
                            <div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={s.period && s.period.end ? formatDate(s.period.end * 1000) : "?"}
                                />
                            </div>]}
                        ></TableAligner>
                    </span>} />
                </div>) : "",
                nfts: t.plans ? t.plans.map(p => <div className="!justify-start clear-right" key={`planUser_${p.nftAddress}_${t.email}`}>
                    <Display className="!justify-start" data={p.planName} onOpen={() => {
                        //setTokenIdShowing({ tokenId: p.tokenId, nftAddress: p.nftAddress });
                        //return true;
                    }} content={<span>
                        <TableAligner
                            keysName={["NFT", "Token ID", "Address"/*, "Start", "Expiration"*/]}
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
                                    data={p.tokenId}
                                    precision={0}
                                />
                            </div>,
                            <div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end text-f12"
                                    data={p.userAddress}
                                    precision={0}
                                />
                            </div>, {/*,
                            <div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={nftStartDate}
                                />
                            </div>,
                            <div className={`${wrapperClasses}`}>
                                <Display
                                    className="!justify-end"
                                    data={nftExpDate}
                                />
                    </div>,*/}]}
                        ></TableAligner>
                    </span>} />
                </div>) : ""
                //console.log("dashboardData", dashboardData);
            }
        });


        const counter = {
            totalLeads: userList.length,
            totalCustomers: userList.filter(k => k.payments && k.payments.length > 0).length,
            subscribed: userList.filter(k => k.subscriptionStatus == "Subscribed").length,
            withPlan: userList.filter(k => k.plans && k.plans.length > 0).length,
            totalNet: dashboardData.map(d => d.paidPlain).reduce((p, c) => p + c, 0)
        }

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
            const data = sortedData && sortedData[row] ? sortedData[row][headerJSX[col].id] : "";
            let currentData = data;
            if (headerJSX[col].resume && currentData.length > headerJSX[col].resume) {
                currentData = currentData.substring(0, Math.round(headerJSX[col].resume / 2)) + "..." + currentData.substring(currentData.length - Math.round(headerJSX[col].resume / 2 - 1));
            }
            //console.log("currentData", currentData);
            return <CellContent
                content={[
                    <Display
                        data={currentData}
                        content={headerJSX[col].resume && data != currentData && data}
                        className={`!justify-start !left ${headerJSX[col].classes ?? ""}`}
                    />,
                ]}
            />;
        }

        const revPerLead = counter.totalLeads ? counter.totalNet / counter.totalLeads : 0;
        const revPerCustomer = counter.totalCustomers ? counter.totalNet / counter.totalCustomers : 0;
        //console.log("revPerLead", revPerLead)
        //console.log("revPerCustomer", revPerCustomer)

        return <Section
            Heading={<>
                <div className={topStyles}>Users ({`${counter.totalLeads} leads, ${counter.subscribed} subscribed, ${counter.totalCustomers} customers, ${counter.withPlan} with NFT`})</div>
                <div className={"mx-3 mt-5 text-f14"}>Revenue after TPV: <Display className="!justify-start inline w-[500px]" data={counter.totalNet} precision={0} unit={"EUR"} /> total</div>
                <div className={"mx-3 text-f14"}>Revenue per lead: <Display className="!justify-start inline w-[500px]" data={revPerLead} precision={1} unit={"EUR"} /> </div>
                <div className={"mx-3 mb-5 text-f14"}>Revenue per customer: <Display className="!justify-start inline w-[500px]" data={revPerCustomer} precision={1} unit={"EUR"} /> </div>
            </>}
            subHeading={
                <>
                    <div className={descStyles + " flex mt-5"}>
                        Currency Conversion (0 = do not convert):&nbsp;&nbsp;&nbsp;&nbsp;
                        {uniqueCurrencies.filter(c => (c && c != "eur")).map(c => {
                            const conv = currencyConversion[c] ?? 0;
                            return <div className='inline mr-5' key={`currencyConv_${c}`}>
                                {c} to EUR: <BufferInput placeholder={"0"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={conv.toString()} onChange={(val) => {
                                    setCurrencyConversion({ ...currencyConversion, [c]: (val) });
                                }} />
                            </div>
                        })}
                    </div>
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
                        <div className='inline ml-5'>
                            Name:
                            <BufferInput placeholder={"Pepe Diaz"} bgClass="!bg-1" ipClass="mt-1" className='w-[15vw]' value={name} onChange={(val) => { setName(val) }} />
                        </div>
                    </div>
                    <div className={descStyles + " flex mt-5"}>
                        Filter by NFT:&nbsp;&nbsp;&nbsp;&nbsp;
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
                    widths={["25%", "25%", "10%", "10%", "10%", "20%"]}
                    shouldShowMobile={true}
                    from={from}
                    to={to}
                />
            </div>}
        />
    }
}