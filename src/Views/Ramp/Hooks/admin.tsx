import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { IRampAdminData, IRampAdminTransaction, IRampKYB, IRampKYC, IRampTransaction, rampAtom } from "../rampAtom";
import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
//import auth0 from 'auth0-js';


export const useGetRampAdminData = () => {
    const [rampStateAtom] = useAtom(rampAtom);
    const rampAdminData: IRampAdminData = { KYCList: [] };

    //Admin data
    [rampAdminData.KYCList] = useGetKycList(rampStateAtom.sessionId);
    [rampAdminData.KYBList] = useGetKybList(rampStateAtom.sessionId);
    //[rampAdminData.OffRampList, rampAdminData.OnRampList] = useGetAllTransactionList(rampStateAtom.sessionId);
    [rampAdminData.OffRampList] = useGetTransactionList(rampStateAtom.sessionId, "cryptoToFiat");
    [rampAdminData.OnRampList] = useGetTransactionList(rampStateAtom.sessionId, "fiatToCrypto");

    return useMemo(() => rampAdminData,
        [rampStateAtom.sessionId, rampAdminData.KYCList, rampAdminData.KYBList, rampAdminData.OffRampList, rampAdminData.OnRampList]);
}


const useGetTransactionList = (session_id: string, type: string) => {
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
        fetchFromRampApi(`/admin/transactionsByType`, 'GET', { session_id, type }, save, dispatch);
    }, [session_id]);

    return [trxList];
}


const useGetKycList = (session_id: string) => {
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
        fetchFromRampApi(`/admin/kycs`, 'GET', { session_id }, save, dispatch);
    }, [session_id]);

    return [kycList];
}


const useGetKybList = (session_id: string) => {
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
        fetchFromRampApi(`/admin/kybs`, 'GET', { session_id }, save, dispatch);
    }, [session_id]);

    return [kybList];
}
