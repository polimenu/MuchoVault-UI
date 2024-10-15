import { useGlobal } from "@Contexts/Global";
import { useEffect, useState } from 'react';
import { ILead } from "../usersAtom";
import { fetchFromIndexApi } from "@Views/Index/Hooks/fetch";

export const useGetAllLeads = () => {
    const { dispatch } = useGlobal();
    const [leads, setLeads] = useState<ILead[]>([]);

    const save = (obj: any) => {
        if (obj.status == "OK" && obj.leads) {
            //console.log("Setting latest price", obj);
            setLeads(obj.leads);
            //console.log("Set latest price", latestPrice);
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/allLeads`, 'GET', {}, save, dispatch);
    }, []);

    return [leads];
}