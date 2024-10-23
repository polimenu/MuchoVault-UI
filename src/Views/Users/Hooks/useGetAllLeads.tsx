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
                    subscriptionDate: l.subscriptionTS ? (new Date(l.subscriptionTS)) : "",
                    plans: l.plans ? l.plans.map(p => {
                        return {
                            ...p,
                            startTime: new Date(p.startTimeTs * 1000),
                            expirationTime: new Date(p.expirationTimeTs * 1000)
                        }
                    }) : undefined
                }
            })
            //console.log("leads set", lds);
            setLeads(lds);
        }
    }

    useEffect(() => {
        fetchFromIndexApi(`/allLeads`, 'GET', {}, save, dispatch);
    }, []);

    return [leads];
}