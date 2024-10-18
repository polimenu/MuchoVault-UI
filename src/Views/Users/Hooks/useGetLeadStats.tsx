import { useEffect, useState } from 'react';
import { ILead, ILeadStatPeriod } from "../usersAtom";

export const useGetLeadStats = (leads: ILead[]) => {
    const [stats, setStats] = useState<ILeadStatPeriod[]>([]);

    useEffect(() => {
        if (leads) {
            const leadsWithTs = leads.filter(l => Number(l.subscriptionTS) > 0);
            console.log("leadsWithTs", leadsWithTs)
            const firstLead = leadsWithTs.sort((a, b) => Number(a.subscriptionTS) - Number(b.subscriptionTS))[0];
            if (firstLead) {
                const firstDate = Number(firstLead.subscriptionTS);
                console.log("leads", leads.length);
                console.log("firstLead", firstLead);
                console.log("firstDate TS", firstDate);
                console.log("firstDate", (new Date(firstDate)).toString());
            }
        }

    }, [JSON.stringify(leads)]);

    return [stats];
}