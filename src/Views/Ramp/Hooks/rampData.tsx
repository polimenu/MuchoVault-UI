import { useMemo } from 'react';
import { IRampData, rampAtom } from '../rampAtom';
import { useGetBankAccounts, useGetRampTransactions, useGetTokenPreferences, useGetUserDetails } from './user';
import { useRampCountries, useRampTokens } from './masters';
import { useAtom } from 'jotai';
import { useGetCorpDetails, useGetTokenPreferencesB2B } from './corp';
//import auth0 from 'auth0-js';


export const useGetRampData = () => {
    const [rampStateAtom] = useAtom(rampAtom);

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
    [rampData.corpDetails] = useGetCorpDetails(rampStateAtom.sessionId, rampData.userDetails ? rampData.userDetails.linked_corporates_uuid : "");
    [rampData.tokenPreferences] = useGetTokenPreferences(rampStateAtom.sessionId);
    [rampData.tokenPreferencesB2B] = useGetTokenPreferencesB2B(rampStateAtom.sessionId);

    return useMemo(() => rampData, [rampStateAtom.sessionId,
    rampData.allowedCountries,
    rampData.allowedCurrencies,
    rampData.userDetails,
    rampData.corpDetails,
    rampData.tokenPreferences,
    rampData.tokenPreferencesB2B
    ]);
}












