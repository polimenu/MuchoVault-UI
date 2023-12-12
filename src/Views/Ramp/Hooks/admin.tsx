import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { IRampAdminData, IRampAdminTransaction, IRampKYC, IRampTransaction, rampAtom } from "../rampAtom";
import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
//import auth0 from 'auth0-js';


export const useGetRampAdminData = () => {
    const [rampStateAtom] = useAtom(rampAtom);
    const rampAdminData: IRampAdminData = { KYCList: [] };

    //Admin data
    [rampAdminData.KYCList] = useGetKycList(rampStateAtom.sessionId);
    [rampAdminData.OffRampList, rampAdminData.OnRampList] = useGetAllTransactionList(rampStateAtom.sessionId);

    return useMemo(() => rampAdminData,
        [rampStateAtom.sessionId, rampAdminData.KYCList, rampAdminData.OffRampList, rampAdminData.OnRampList]);
}


const useGetAllTransactionList = (session_id: string) => {
    const { dispatch } = useGlobal();
    const [onRampList, setOnRampList] = useState<IRampAdminTransaction[]>([]);
    const [offRampList, setOffRampList] = useState<IRampAdminTransaction[]>([]);

    const save = (obj: any) => {
        if (obj.status == "OK") {
            console.log("Setting list transactions", obj);
            setOnRampList(obj.onramp);
            setOffRampList(obj.offramp);
        }
    }

    useEffect(() => {
        fetchFromRampApi(`/admin/transactions`, 'GET', { session_id }, save, dispatch);
    }, [session_id]);

    return [offRampList, onRampList];
}


const useGetKycList = (session_id: string) => {
    const { dispatch } = useGlobal();
    const [kycList, setKycList] = useState<IRampKYC[]>([]);

    const save = (obj: any) => {
        console.log("KYCList!!!!!!!!!", obj);
        if (obj.status == "OK") {
            console.log("Setting list kyc", obj.kycs);
            setKycList(obj.kycs);
        }
    }

    useEffect(() => {
        fetchFromRampApi(`/admin/kycs`, 'GET', { session_id }, save, dispatch);
    }, [session_id]);

    return [kycList];
}
