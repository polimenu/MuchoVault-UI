import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { IRampOnRampBankAccount } from "../rampAtom";


export const useGetOnRampQuoteB2B = (sessionId: string, uuid: string, currencyIn: string, currencyOut: string, amount: number): string[] => {
    const { dispatch } = useGlobal();
    const [quote, setQuote] = useState<{ amountOut?: string, discount?: string }>({ amountOut: "", discount: "" });
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const save = (obj: any) => {
        //console.log("Quote", obj);
        if (obj.status !== "KO") {
            setQuote({ amountOut: (Math.round(obj.amountOut * 100) / 100).toString(), discount: (obj.discount ? (Math.round(obj.discount * 100) / 100) : 0) });
        }
        else {
            setQuote({ amountOut: "Error!" });
        }
    }


    useEffect(() => {

        if (amount && currencyIn && currencyOut && uuid) {
            if (timer) {
                //console.log("Cleaning previous timer");
                clearTimeout(timer);
            }

            setTimer(setTimeout(() => {
                //console.log("Setting new timer");
                console.log("Quoting B2B onramp");
                fetchFromRampApi(`/onramp/corporate/quote`, 'GET', { session_id: sessionId, uuid, input_currency: currencyIn.replace(".", "").toUpperCase(), output_currency: currencyOut.replace(".", "").toUpperCase(), direction: "fiatToCrypto", amount: amount }, save, dispatch);
            }, 1000)
            );
        }
    }, [sessionId, uuid, amount, currencyIn, currencyOut]);

    return [quote?.amountOut, quote?.discount];
}

export const useOnRampAccountsB2B = (sessionId: string, uuid: string, currency: string, trigger: boolean) => {
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
        if (sessionId && uuid && currency) {
            //console.log("FETCHING ONRAMP BANK ACCOUNT");
            fetchFromRampApi(`/onramp/corporate/bank-account`, 'GET', { session_id: sessionId, uuid }, save, dispatch);
        }
    }, [sessionId, currency, trigger]);

    return [account];
}


export const useCreateOnRampAccountB2B = (sessionId: string, uuid: string, currency: string, send: boolean) => {
    const { dispatch } = useGlobal();
    const [account, setAccount] = useState(false);

    const save = (obj: any) => {
        //console.log("Created account", obj);
        if (obj.status !== "KO") {
            setAccount(true);
        }
    }

    useEffect(() => {
        if (sessionId && uuid && currency && send) {
            //console.log("CREATING ONRAMP BANK ACCOUNT");
            fetchFromRampApi(`/onramp/corporate/bank-account`, 'POST', { session_id: sessionId, uuid, currency: currency }, save, dispatch);
        }
    }, [sessionId, currency, send]);

    return [account];
}