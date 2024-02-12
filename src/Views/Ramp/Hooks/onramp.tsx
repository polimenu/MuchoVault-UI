import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { IRampOnRampBankAccount } from "../rampAtom";


export const useGetOnRampQuote = (sessionId: string, currencyIn: string, currencyOut: string, amount: number): { amountOut?: string, discount?: string }[] => {
    const { dispatch } = useGlobal();
    const [quote, setQuote] = useState<{ amountOut?: string, discount?: string }>();
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const save = (obj: any) => {
        console.log("Quote", obj);
        if (obj.status !== "KO") {
            setQuote({ amountOut: (Math.round(obj.amountOut * 100) / 100).toString(), discount: (obj.discount ? (Math.round(obj.discount * 100) / 100) : 0) });
        }
        else {
            setQuote({ amountOut: "Error!" });
        }
    }


    useEffect(() => {

        if (amount && currencyIn && currencyOut) {
            if (timer) {
                //console.log("Cleaning previous timer");
                clearTimeout(timer);
            }

            setTimer(setTimeout(() => {
                //console.log("Setting new timer");
                fetchFromRampApi(`/onramp/quote`, 'GET', { session_id: sessionId, input_currency: currencyIn.replace(".", "").toUpperCase(), output_currency: currencyOut.replace(".", "").toUpperCase(), direction: "fiatToCrypto", amount: amount }, save, dispatch);
            }, 1000)
            );
        }
    }, [sessionId, amount, currencyIn, currencyOut]);

    return [quote];
}


export const useOnRampAccounts = (sessionId: string, currency: string, trigger: boolean) => {
    const { dispatch } = useGlobal();
    const [account, setAccount] = useState<IRampOnRampBankAccount | undefined>(undefined);

    const save = (obj: any) => {
        //console.log("Got account", obj);
        if (obj.status !== "KO") {
            const account = obj.response.filter(a => a.currency == currency)[0];
            setAccount(account ? account : {});
        }
    }

    useEffect(() => {
        if (sessionId && currency) {
            //console.log("FETCHING ONRAMP BANK ACCOUNT");
            fetchFromRampApi(`/onramp/bank-account`, 'GET', { session_id: sessionId }, save, dispatch);
        }
    }, [sessionId, currency, trigger]);

    return [account];
}


export const useCreateOnRampAccount = (sessionId: string, currency: string, send: boolean) => {
    const { dispatch } = useGlobal();
    const [account, setAccount] = useState(false);

    const save = (obj: any) => {
        //console.log("Created account", obj);
        if (obj.status !== "KO") {
            setAccount(true);
        }
    }

    useEffect(() => {
        if (sessionId && currency && send) {
            //console.log("CREATING ONRAMP BANK ACCOUNT");
            fetchFromRampApi(`/onramp/bank-account`, 'POST', { session_id: sessionId, currency: currency }, save, dispatch);
        }
    }, [sessionId, currency, send]);

    return [account];
}