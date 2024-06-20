import { ReactNode, useState } from 'react';
import { Section } from '@Views/Common/Card/Section';
import TransactionTable from './TransactionTable';
import { Display } from '@Views/Common/Tooltips/Display';
import { Skeleton } from '@mui/material';
import { useAtom } from 'jotai';
import { IRampAdminTransaction, IRampKYB, IRampKYC, rampAdminDataAtom, rampAtom } from '../rampAtom';
import { addressSummary } from '@Views/Common/Utils';
import { formatDate } from '../Utils';
import BufferInput from '@Views/Common/BufferInput';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';


export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampAdminStatus = () => {
  const [rampData] = useAtom(rampAdminDataAtom);
  const [email, setEmail] = useState('');

  //console.log("OnRampAdminStatus loading", rampData);

  return <div>
    <KYBListSection KYBList={rampData.KYBList} />
    <KYCListSection KYCList={rampData.KYCList} />
    <OnRampTransactionsSection trxList={rampData.OnRampList} params={{ email, setEmail }} />
    <OffRampTransactionsSection trxList={rampData.OffRampList} />
  </div>;

}


const KYBListSection = ({ KYBList }: { KYBList?: IRampKYB[] }) => {
  const [pageState, setPageState] = useAtom(rampAtom);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(10);
  if (!KYBList) {
    return <Skeleton
      key="OnRampKYCListCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  else {
    console.log("KYBList", KYBList);
    const headerJSX = [
      { id: "uid", label: "User ID" },
      { id: "comnamepany", label: "Company" },
      { id: "status", label: "Status" },
      { id: "lastupdate", label: "Last Update" },
      { id: "initdate", label: "Init Date" },
    ];

    const counter = {
      total: KYBList.length,
      full: KYBList.filter(k => k.last_subtype == "FULL_USER").length,
      pending: KYBList.filter(k => k.last_subtype.indexOf("PENDING") >= 0).length,
      failed: KYBList.filter(k => k.last_subtype.indexOf("FAILED") >= 0).length
    }

    const slicedTrx = KYBList.slice(from, to);
    const dashboardData = slicedTrx.map(t => {
      return [
        addressSummary(t.user_id),
        t.name,
        t.last_subtype,
        formatDate(t.last),
        formatDate(t.init),
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
      Heading={<div className={topStyles}>KYB Processes ({`${counter.total} total, ${counter.full} done, ${counter.pending} pending, ${counter.failed} failed`})</div>}
      subHeading={
        <div className={descStyles + " flex"}>
          <div className='inline'>
            From <BufferInput placeholder={"0"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={from} onChange={(val) => { setFrom(val); }} />
          </div>
          <div className='inline ml-5'>
            to <BufferInput placeholder={"20"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={to} onChange={(val) => { setTo(val); }} />
          </div>
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
          onRowClick={(idx) => {
            const uid = slicedTrx[idx].user_id;
            setPageState({ ...pageState, isModalOpen: true, activeModal: "ADMIN_KYB_DETAIL", auxModalData: { uid } })
          }}
          widths={['20%', '20%', '20%', '20%', '20%']}
          shouldShowMobile={true}
        />
      </div>}
    />
  }
}


const KYCListSection = ({ KYCList }: { KYCList?: IRampKYC[] }) => {
  const [pageState, setPageState] = useAtom(rampAtom);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(10);
  if (!KYCList) {
    return <Skeleton
      key="OnRampKYCListCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  else {
    const headerJSX = [
      { id: "uid", label: "User ID" },
      { id: "email", label: "E-mail" },
      { id: "status", label: "Status" },
      { id: "lastupdate", label: "Last Update" },
      { id: "initdate", label: "Init Date" },
    ];

    const counter = {
      total: KYCList.length,
      full: KYCList.filter(k => k.last_subtype == "FULL_USER").length,
      pending: KYCList.filter(k => k.last_subtype.indexOf("PENDING") >= 0).length,
      failed: KYCList.filter(k => k.last_subtype.indexOf("FAILED") >= 0).length
    }

    const slicedTrx = KYCList.slice(from, to);
    const dashboardData = slicedTrx.map(t => {
      return [
        addressSummary(t.user_id),
        t.email,
        t.last_subtype,
        formatDate(t.last),
        formatDate(t.init),
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
      const currentData = sortedData[row][col] ?? "";
      let classNames = "";
      if (currentData && currentData.indexOf("COMPLETED") > 0)
        classNames += "green";
      else if (currentData && currentData.indexOf("REJECTED") > 0)
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
      Heading={<div className={topStyles}>KYC Processes ({`${counter.total} total, ${counter.full} done, ${counter.pending} pending, ${counter.failed} failed`})</div>}
      subHeading={
        <div className={descStyles + " flex"}>
          <div className='inline'>
            From <BufferInput placeholder={"0"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={from} onChange={(val) => { setFrom(val); }} />
          </div>
          <div className='inline ml-5'>
            to <BufferInput placeholder={"20"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={to} onChange={(val) => { setTo(val); }} />
          </div>
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
          onRowClick={(idx) => {
            const uid = slicedTrx[idx].user_id;
            setPageState({ ...pageState, isModalOpen: true, activeModal: "ADMIN_KYC_DETAIL", auxModalData: { uid } })
          }}
          widths={['20%', '20%', '20%', '20%', '20%']}
          shouldShowMobile={true}
        />
      </div>}
    />
  }
}






const OnRampTransactionsSection = ({ trxList, params }: { trxList?: IRampAdminTransaction[], params: { email: string, setEmail: any } }) => {
  const [pageState, setPageState] = useAtom(rampAtom);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(10);
  if (!trxList) {
    return <Skeleton
      key="OnRampKYCListCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  else {
    const headerJSX = [
      { id: "tid", label: "Trx ID" },
      { id: "email", label: "E-mail" },
      { id: "uid", label: "User ID" },
      { id: "status", label: "Last Status" },
      { id: "lastupdate", label: "Last Update" },
      { id: "initdate", label: "Init Date" },
      { id: "fiat", label: "FIAT" },
      { id: "crypto", label: "Crypto" },
      { id: "fees", label: "Fees" },
      { id: "exchange", label: "Exchange Rate" },
    ];


    const counter = {
      total: trxList.length,
      full: trxList.filter(k => k.last_subtype == "SUCCESS").length,
      amount: Math.round(100 * trxList.filter(k => k.last_subtype == "SUCCESS").map(t => t.amountFiat ? parseFloat(t.amountFiat) : 0).reduce((p, c) => c + p, 0)) / 100,
      fees: Math.round(100 * trxList.filter(k => k.last_subtype == "SUCCESS").map(t => t.fees ? parseFloat(t.fees) : 0).reduce((p, c) => c + p, 0)) / 100
    }

    const slicedTrx = trxList.slice(from, to);
    const dashboardData = slicedTrx.map(t => {
      /*return {
        tid: t.input.transaction_id,
        direction: t.direction,
        input: `${t.input.amount} ${t.input.currency}`,
        output: t.output.currency
      }*/
      return [
        addressSummary(t.transaction_id),
        t.email,
        addressSummary(t.user_id),
        t.last_subtype,
        formatDate(t.last),
        formatDate(t.init),
        `${t.amountFiat} ${t.currencyFiat}`,
        `${t.amountCrypto} ${t.currencyCrypto} (${t.chain})`,
        t.fees ? t.fees.toString() : "",
        t.exchange_rate ? t.exchange_rate.toString() : ""
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
      const currentData = sortedData[row][col] ?? "";
      let classNames = "";
      if (currentData && currentData.indexOf("COMPLETED") > 0)
        classNames += "green";
      else if (currentData && currentData.indexOf("REJECTED") > 0)
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
      Heading={<div className={topStyles}>On Ramp Transactions ({`${counter.total} transactions, ${counter.full} done, ${counter.amount} EUR, ${counter.fees} EUR fees`})</div>}
      subHeading={
        <div className={descStyles + " flex"}>
          <div className='inline'>
            From <BufferInput placeholder={"0"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={from} onChange={(val) => { setFrom(val); }} />
          </div>
          <div className='inline ml-5'>
            to <BufferInput placeholder={"20"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={to} onChange={(val) => { setTo(val); }} />
          </div>
          <div className='inline ml-5'>
            EMAIL <BufferInput placeholder={""} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={params.email} onChange={(val) => { params.setEmail(val); }} />
          </div>
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
          onRowClick={(idx) => {
            const tid = slicedTrx[idx].transaction_id;
            setPageState({ ...pageState, isModalOpen: true, activeModal: "ADMIN_TRX_DETAIL", auxModalData: { tid } })
          }}
          widths={["10%", "15%", "10%", "10%", "10%", "10%", "10%", "15%", "5%", "5%",]}
          shouldShowMobile={true}
        />
      </div>}
    />
  }
}





const OffRampTransactionsSection = ({ trxList }: { trxList?: IRampAdminTransaction[] }) => {
  const [pageState, setPageState] = useAtom(rampAtom);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(10);
  if (!trxList) {
    return <Skeleton
      key="OnRampKYCListCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  else {
    const headerJSX = [
      { id: "tid", label: "Trx ID" },
      { id: "email", label: "E-mail" },
      { id: "uid", label: "User ID" },
      { id: "status", label: "Last Status" },
      { id: "lastupdate", label: "Last Update" },
      { id: "initdate", label: "Init Date" },
      { id: "fiat", label: "FIAT" },
      { id: "crypto", label: "Crypto" },
      { id: "fees", label: "Fees" },
      { id: "exchange", label: "Exchange Rate" },
    ];

    const counter = {
      total: trxList.length,
      full: trxList.filter(k => k.last_subtype == "SUCCESS").length,
      amount: Math.round(100 * trxList.filter(k => k.last_subtype == "SUCCESS").map(t => t.amountCrypto ? parseFloat(t.amountCrypto) : 0).reduce((p, c) => c + p, 0)) / 100,
      fees: Math.round(100 * trxList.filter(k => k.last_subtype == "SUCCESS").map(t => t.fees ? parseFloat(t.fees) : 0).reduce((p, c) => c + p, 0)) / 100
    }

    const slicedTrx = trxList.slice(from, to);
    const dashboardData = slicedTrx.map(t => {
      /*return {
        tid: t.input.transaction_id,
        direction: t.direction,
        input: `${t.input.amount} ${t.input.currency}`,
        output: t.output.currency
      }*/
      return [
        addressSummary(t.transaction_id),
        t.email,
        addressSummary(t.user_id),
        t.last_subtype,
        formatDate(t.last),
        formatDate(t.init),
        `${t.amountFiat} ${t.currencyFiat}`,
        `${t.amountCrypto} ${t.currencyCrypto} (${t.chain})`,
        t.fees ? t.fees.toString() : "",
        t.exchange_rate ? t.exchange_rate.toString() : ""
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
      const currentData = sortedData[row][col];
      let classNames = "";
      if (currentData && currentData.indexOf("COMPLETED") > 0)
        classNames += "green";
      else if (currentData && currentData.indexOf("REJECTED") > 0)
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
      Heading={<div className={topStyles}>Off Ramp Transactions ({`${counter.total} transactions, ${counter.full} done, ${counter.amount} USD, ${counter.fees} USD fees`})</div>}
      subHeading={
        <div className={descStyles + " flex"}>
          <div className='inline'>
            From <BufferInput placeholder={"0"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={from} onChange={(val) => { setFrom(val); }} />
          </div>
          <div className='inline ml-5'>
            to <BufferInput placeholder={"20"} bgClass="!bg-1" ipClass="mt-1" className='w-[5vw]' value={to} onChange={(val) => { setTo(val); }} />
          </div>
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
          onRowClick={(idx) => {
            const tid = slicedTrx[idx].transaction_id;
            setPageState({ ...pageState, isModalOpen: true, activeModal: "ADMIN_TRX_DETAIL", auxModalData: { tid } })
          }}
          widths={["10%", "15%", "10%", "10%", "10%", "10%", "10%", "15%", "5%", "5%",]}
          shouldShowMobile={true}
        />
      </div>}
    />
  }
}