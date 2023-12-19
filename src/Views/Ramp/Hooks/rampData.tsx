import { useMemo } from 'react';
import { IRampData, rampAtom } from '../rampAtom';
import { useGetBankAccounts, useGetRampTransactions, useGetTokenPreferences, useGetUserDetails } from './user';
import { useRampCountries, useRampTokens } from './masters';
import { useAtom } from 'jotai';
//import auth0 from 'auth0-js';


export const useGetRampData = () => {
    const [rampStateAtom] = useAtom(rampAtom);

    //Update every X secs
    /*const SECS_UPDATE = 20;
    const [hashTime, setHashTime] = useState((new Date()).getTime());
    useEffect
    setTimeout(() => { setHashTime((new Date()).getTime()) }, SECS_UPDATE * 1000);

    const interval = */


    //console.log("***********useGetRampData************", rampStateAtom.sessionId)

    let rampData: IRampData = {
        allowedCountries: [],
        allowedCurrencies: []
    };



    //Masters
    [rampData.allowedCurrencies] = useRampTokens();
    [rampData.allowedCountries] = useRampCountries();

    //User associated data
    [rampData.userDetails] = useGetUserDetails(rampStateAtom.sessionId);
    [rampData.tokenPreferences] = useGetTokenPreferences(rampStateAtom.sessionId);
    [rampData.transactions] = useGetRampTransactions(rampStateAtom.sessionId);
    [rampData.bankAccounts] = useGetBankAccounts(rampStateAtom.sessionId);

    return useMemo(() => rampData, [rampStateAtom.sessionId,
    rampData.allowedCountries,
    rampData.allowedCurrencies,
    rampData.userDetails,
    rampData.tokenPreferences,
    rampData.transactions,
    rampData.bankAccounts
    ]);
}












