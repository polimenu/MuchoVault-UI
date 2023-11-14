import { useContext, useEffect, useState } from 'react';
import { useGetRampTransactions, useLoginByEmail, useOtpLogin } from '../Hooks/rampHooks';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { RampContext } from '..';


export const OnRampStatus = () => {
  return <OnRampTransactions />
}

const OnRampTransactions = () => {
  const { sessionId } = useContext(RampContext);
  console.log("sessionId", sessionId);
  const [transactions, fetchTransactions] = useGetRampTransactions(sessionId);
  //fetchTransactions();

  if (!transactions)
    return <div>No transactions</div>;

  else
    return <><div>
      <div className="text-f15 mb-5">List of transactions</div>
      <table>
        <thead>
          <tr>
            <th>Direction</th>
            <th>Input</th>
            <th>Transaction ID</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {
            transactions.map(t => <tr>
              <td>{t.direction}</td>
              <td>{t.input.amount} {t.input.currency}</td>
              <td>{t.input.transaction_id}</td>
              <td>{t.output.currency}</td>
            </tr>)
          }
        </tbody>
      </table>
    </div>
    </>;
}