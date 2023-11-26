import { ReactNode, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { Section } from '@Views/Common/Card/Section';
import TransactionTable from './TransactionTable';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Common/Card/Card';
import { TableAligner } from '@Views/Common/TableAligner';
import { Skeleton } from '@mui/material';
import { useAtom } from 'jotai';
import { IRampTokenPreference, IRampTransaction, IRampUserDetails, rampAtom, rampDataAtom } from '../rampAtom';
import { addressSummary } from '@Views/Common/Utils';
import { useRampSumsubToken } from '../Hooks/kyc';
import { RAMP_CONFIG } from '../Config/rampConfig';
import { networkBeautify, tokenBeautify } from '../Modals';


const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const underLineClass =
  'underline underline-offset-4 decoration decoration-[#ffffff30] w-fit ml-auto pointer';

export const OnRampStatus = () => {
  const [rampData] = useAtom(rampDataAtom);

  console.log("OnRampStatus loading", rampData);

  return <div>
    <UserDetailsAndTokenPreferences userDetails={rampData.userDetails} tokenPreferences={rampData.tokenPreferences} />
    <Section
      Heading={<div className={topStyles}>Last Transactions</div>}
      subHeading={
        <div className={descStyles}>
          List of your last transactions
          {/* (Stats since 30th Jan, 2023) */}
        </div>
      }
      other={<OnRampTransactions transactions={rampData.transactions} />}
    />

  </div>;

  return <></>;
}

const UserDetailsAndTokenPreferences = ({ userDetails, tokenPreferences }: { userDetails?: IRampUserDetails, tokenPreferences?: IRampTokenPreference[] }) => {

  return <Section
    Heading={<div className={topStyles}>User details and token preferences</div>}
    subHeading={
      <div className={descStyles}>

      </div>
    }
    Cards={
      [
        <UserDetailsCard userDetails={userDetails} />,
        <TokenPreferencesCard tokenPreferences={tokenPreferences} userDetails={userDetails} />
      ]
    }
  />;
}


const wrapperClasses = 'flex justify-end flex-wrap';
const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';

const UserDetailsCard = ({ userDetails }: { userDetails: IUserDetails }) => {
  const [state, setPageState] = useAtom(rampAtom);
  const [getToken, setGetToken] = useState(false);
  const [token] = useRampSumsubToken(getToken);

  if (!userDetails) {
    return <Skeleton
      key="userDetailsCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  return <Card
    top={
      <>User Details</>
    }


    middle={<>{userDetails &&
      <TableAligner
        keysName={
          ['Name', 'Last name', 'KYC Status', 'E-mail', 'Date of birth', 'Address', 'Postal Code', 'City', 'Country']
        }
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.first_name}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.last_name}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.kyc_status}
            />
          </div>
          ,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.email}
            />
          </div>
          ,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.date_of_birth}
            />
          </div>
          ,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={userDetails.address ? `${userDetails.address.address_line_1} ${userDetails.address.address_line_2}` : ''}
            />
          </div>
          ,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={`${userDetails.address.city}`}
            />
          </div>
          ,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={` ${userDetails.address.post_code}`}
            />
          </div>
          ,

          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={`${userDetails.address.country}`}
            />
          </div>
          ,


        ]
        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />}


    </>}

    bottom={<>
      {userDetails.canCreateKYC && <BlueBtn onClick={() => { setPageState({ ...state, isModalOpen: true, activeModal: "KYC" }) }}>Start KYC</BlueBtn>}
      {userDetails.status == "PENDING_KYC_DATA" && <BlueBtn onClick={() => { setGetToken(true); }}>Upload KYC data</BlueBtn>}
    </>}
  />;
}

const TokenPreferencesCard = ({ tokenPreferences, userDetails }: { tokenPreferences?: IRampTokenPreference[], userDetails?: IRampUserDetails }) => {
  const [state, setPageState] = useAtom(rampAtom);
  const editIconClass = 'w-[1vw] h-[1vw] inline ml-5';
  if (!tokenPreferences || !userDetails) {
    return <Skeleton
      key="TokenPreferencesCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />
  }
  return <Card
    top="On Ramp Preferences"
    middle={<TableAligner
      keysName={
        ['On Ramp target address', ...tokenPreferences.map(t => `Convert ${t.currency} to`)]
      }
      values={[
        <span className='pointer' onClick={() => { setPageState({ ...state, isModalOpen: true, activeModal: "TARGET_ADDRESS", auxModalData: { currentAddress: userDetails.target_address } }) }}>{userDetails.target_address ? addressSummary(userDetails.target_address) : 'Not set!'}
          <img src='edit_wh.png' className={editIconClass} />
        </span>
        , ...tokenPreferences.map(t => {
          return <span className={`${wrapperClasses} pointer`}
            onClick={() => { setPageState({ ...state, isModalOpen: true, activeModal: "ONRAMP_PREF", auxModalData: t }) }}>
            <Display
              className="!justify-end"
              data={tokenBeautify(t.token)}
            />
            &nbsp;
            (<Display
              className="!justify-end"
              data={networkBeautify(t.chain)}
            />)
            <img src='edit_wh.png' className={editIconClass} />
          </span>
        })]}
      keyStyle={keyClasses}
      valueStyle={valueClasses}
    />} />;
}

const OnRampTransactions = ({ transactions }: { transactions?: IRampTransaction[] }) => {
  //fetchTransactions();

  if (!transactions)
    return <Skeleton
      key="OnRampTransactionsCard"
      variant="rectangular"
      className="w-full !h-full min-h-[370px] !transform-none !bg-1"
    />

  else {
    const headerJSX = [
      { id: 'tid', label: 'Transaction ID' },
      { id: 'direction', label: 'Direction' },
      { id: 'input', label: 'Input' },
      { id: 'output', label: 'Output' },
      { id: 'status', label: 'Status' },
    ];

    const dashboardData = transactions.map(t => {
      /*return {
        tid: t.input.transaction_id,
        direction: t.direction,
        input: `${t.input.amount} ${t.input.currency}`,
        output: t.output.currency
      }*/
      return [
        t.input.transaction_id,
        t.direction,
        `${t.input.amount} ${t.input.currency}`,
        t.output.currency,
        t.status
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
