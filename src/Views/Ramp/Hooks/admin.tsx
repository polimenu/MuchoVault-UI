import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { IRampKYC } from "../rampAtom";




export const useGetKycList = (session_id: string, isAdmin: boolean) => {
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
        if (isAdmin) {
            fetchFromRampApi(`/admin/kycs`, 'GET', {}, save, dispatch);
        }
    }, [session_id, isAdmin]);

    return [kycList];
}
