import { useGlobal } from "@Contexts/Global";
import { useToast } from "@Contexts/Toast";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { IRampCurrency } from "../rampAtom";


export const useRampTokens = () => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [tokens, setTokens] = useState<IRampCurrency[]>([]);
    const save = (obj: IRampCurrency[]) => {
        //console.log("Saving token currencies", obj);
        setTokens(obj.filter(o => o.network_name && o.network_name.length > 0));
    }

    useEffect(() => {
        fetchFromRampApi(`/currencies`, 'GET', {}, save, dispatch, toastify);
    }, []);


    return [tokens];

}

export const useRampCountries = () => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [countries, setCountries] = useState<IRampCountry[]>([]);
    const save = (obj: IRampCountry[]) => {
        //console.log("Saving countries", obj);
        setCountries(obj);
    }

    useEffect(() => {
        fetchFromRampApi(`/countries`, 'GET', {}, save, dispatch, toastify);
    }, []);


    return [countries];

}