import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { IRampAdminData, IRampAdminTransaction, IRampKYB, IRampKYC, IRampTransaction, rampAtom } from "../rampAtom";
import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
//import auth0 from 'auth0-js';


export const useGetRampAdminData = () => {
    const [rampStateAtom] = useAtom(rampAtom);
    return useGetRampAdminDataByEmail(rampStateAtom.sessionId, "", false);
}


export const useGetRampAdminDataByEmail = (sessionId: string, email: string, emailMandatory: boolean) => {
    const rampAdminData: IRampAdminData = { KYCList: [] };
    console.log("Getting all ramp admin data", sessionId, email);
    const z = 2;

    //Admin data
    [rampAdminData.KYCList] = useGetKycList(sessionId, email, emailMandatory);
    [rampAdminData.KYBList] = useGetKybList(sessionId, email, emailMandatory);
    //[rampAdminData.OffRampList, rampAdminData.OnRampList] = useGetAllTransactionList(rampStateAtom.sessionId);
    [rampAdminData.OffRampList] = useGetTransactionList(sessionId, "cryptoToFiat", email, emailMandatory);
    [rampAdminData.OnRampList] = useGetTransactionList(sessionId, "fiatToCrypto", email, emailMandatory);

    return useMemo(() => rampAdminData, [sessionId
        , email
        , JSON.stringify(rampAdminData.KYCList)
        , JSON.stringify(rampAdminData.KYBList)
        , JSON.stringify(rampAdminData.OffRampList)
        , JSON.stringify(rampAdminData.OnRampList)]);
}


export const useGetRampAdminUserData = (session_id: string, email: string) => {
    const { dispatch } = useGlobal();
    //console.log("OnRampList updated", onRampList);
    const [data, setData] = useState<any>();

    const save = (obj: any) => {
        if (obj.status == "OK") {
            console.log("Setting user data", obj);
            setData(obj);
        }
    }

    useEffect(() => {
        if (email.indexOf("@") > 0) {
            fetchFromRampApi(`/admin/user`, 'GET', { session_id, email }, save, dispatch);
        }
    }, [session_id, email]);

    return [data];
}

export const useGetRampAdminUserBankAccounts = (session_id: string, email: string) => {
    const { dispatch } = useGlobal();
    //console.log("OnRampList updated", onRampList);
    const [data, setData] = useState<any>();

    const save = (obj: any) => {
        if (obj.status == "OK") {
            console.log("Setting user bank accounts", obj);
            setData(obj);
        }
    }

    useEffect(() => {
        if (email.indexOf("@") > 0) {
            fetchFromRampApi(`/admin/user/onramp/banks`, 'GET', { session_id, email }, save, dispatch);
        }
    }, [session_id, email]);

    return [data];
}

export const useGetRampAdminUserSessions = (session_id: string, email: string) => {
    const { dispatch } = useGlobal();
    //console.log("OnRampList updated", onRampList);
    const [data, setData] = useState<any>();

    const save = (obj: any) => {
        if (obj.status == "OK") {
            console.log("Setting user sessions", obj);
            setData(obj);
        }
    }

    useEffect(() => {
        if (email.indexOf("@") > 0) {
            fetchFromRampApi(`/admin/sessions`, 'GET', { session_id, email }, save, dispatch);
        }
    }, [session_id, email]);

    return [data];
}

export const useGetRampAdminUserApiTransactions = (session_id: string, user_session_id: string) => {
    const { dispatch } = useGlobal();
    //console.log("OnRampList updated", onRampList);
    const [data, setData] = useState<any>();

    const save = (obj: any) => {
        if (obj.status == "OK") {
            console.log("Setting user api transactions", obj);
            setData(obj.apiTransactions);
        }
    }

    useEffect(() => {
        if (user_session_id.length > 0) {
            fetchFromRampApi(`/admin/apiTransactions`, 'GET', { session_id, user_session_id }, save, dispatch);
        }
    }, [session_id, user_session_id]);

    return [data];
}


const useGetTransactionList = (session_id: string, type: string, email: string, emailMandatory: boolean) => {
    const { dispatch } = useGlobal();
    //console.log("OnRampList updated", onRampList);
    const [trxList, setTrxList] = useState<IRampAdminTransaction[]>([]);

    const save = (obj: any) => {
        if (obj.status == "OK") {
            console.log("Setting list transactions", obj);
            const trx = obj.transactions.sort((a, b) => b.init - a.init);
            //console.log("OnRampList", on);
            setTrxList(trx);
        }
    }

    useEffect(() => {
        if (!emailMandatory || email) {
            fetchFromRampApi(`/admin/transactionsByType`, 'GET', { session_id, type, email }, save, dispatch);
        }
    }, [session_id, type, email]);

    return [trxList];
}


export const useGetTransactionDataById = (session_id: string, transactionId: string) => {
    const { dispatch } = useGlobal();
    //console.log("OnRampList updated", onRampList);
    const [trx, setTrx] = useState<IRampAdminTransaction>();

    const save = (obj: any) => {
        if (obj.status == "OK") {
            console.log("Setting transaction", obj);
            //console.log("OnRampList", on);
            setTrx(obj.transactions);
        }
    }

    useEffect(() => {
        fetchFromRampApi(`/admin/transactionById`, 'GET', { session_id, id: transactionId }, save, dispatch);
    }, [session_id]);

    return [trx];

}


const useGetKycList = (session_id: string, email: string, emailMandatory: boolean) => {
    const { dispatch } = useGlobal();
    const [kycList, setKycList] = useState<IRampKYC[]>([]);

    const save = (obj: any) => {
        //console.log("KYCList!!!!!!!!!", obj);
        if (obj.status == "OK") {
            //console.log("Setting list kyc", obj.kycs);
            setKycList(obj.kycs.sort((a, b) => b.init - a.init));
        }
    }

    useEffect(() => {
        if (!emailMandatory || email) {
            fetchFromRampApi(`/admin/kycs`, 'GET', { session_id, email }, save, dispatch);
        }
    }, [session_id, email]);

    return [kycList];
}


const useGetKybList = (session_id: string, email: string, emailMandatory: boolean) => {
    const { dispatch } = useGlobal();
    const [kybList, setKybList] = useState<IRampKYB[]>([]);

    const save = (obj: any) => {
        //console.log("KYBList!!!!!!!!!", obj);
        if (obj.status == "OK") {
            //console.log("Setting list kyb", obj.kybs);
            setKybList(obj.kybs.sort((a, b) => b.init - a.init));
        }
    }

    useEffect(() => {
        if (!emailMandatory || email) {
            fetchFromRampApi(`/admin/kybs`, 'GET', { session_id, email }, save, dispatch);
        }
    }, [session_id, email]);

    return [kybList];
}
