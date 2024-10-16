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
            const lds = obj.leads.map(l => {
                return {
                    ...l,
                    plans: l.plans ? l.plans.map(p => {
                        return {
                            ...p,
                            startTime: new Date(Date.parse(p.startTime)),
                            expirationTime: new Date(Date.parse(p.expirationTime))
                        }
                    }) : undefined
                }
            })
            console.log("leads set", lds);
            setLeads(lds);
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/allLeads`, 'GET', {}, save, dispatch);
    }, []);

    return [leads];
}