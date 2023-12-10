import { ReactNode, useContext, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { Section } from '@Views/Common/Card/Section';
import TransactionTable from './TransactionTable';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Common/Card/Card';
import { TableAligner } from '@Views/Common/TableAligner';
import { Skeleton } from '@mui/material';
import { useAtom } from 'jotai';
import { IRampBankAccount, IRampData, IRampKYC, IRampTokenPreference, IRampTransaction, IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { addressSummary } from '@Views/Common/Utils';
import { useRampSumsubToken } from '../Hooks/kyc';
import { RAMP_CONFIG } from '../Config/rampConfig';
import { networkBeautify, tokenBeautify } from '../Utils';
import { useGlobal } from '@Contexts/Global';
import { useLogout } from '../Hooks/login';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { useUserAccount } from '@Hooks/useUserAccount';
import { ViewContext } from '..';
import { useNetwork } from 'wagmi';
import { t } from 'i18next';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampAdminStatus = () => {
  const [rampData] = useAtom(rampDataAtom);

  //console.log("OnRampStatus loading", rampData);

  return <div>
    <KYCListSection KYCList={rampData.KYCList} />
    {/*<OnRampTransactions transactionList={rampData.admin.transactionList} />*/}
  </div>;

  return <></>;
}




const KYCListSection = ({ KYCList }: { KYCList?: IRampKYC[] }) => {
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

    const dashboardData = KYCList.map(t => {
      /*return {
        tid: t.input.transaction_id,
        direction: t.direction,
        input: `${t.input.amount} ${t.input.currency}`,
        output: t.output.currency
      }*/
      return [
        addressSummary(t.user_id),
        t.email,
        t.last_subtype,
        t.last.toUTCString(),
        t.init.toUTCString()
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
          widths={['30%', '20%', '15%', '15%', '20%']}
          shouldShowMobile={true}
        />
      </div>
    </>;
  }
}