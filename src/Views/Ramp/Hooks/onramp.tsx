import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { IRampOnRampBankAccount } from "../rampAtom";


export const useGetOnRampQuote = (currencyIn: string, currencyOut: string, amount: number): string[] => {
    const { dispatch } = useGlobal();
    const [quote, setQuote] = useState("");

    const save = (obj: any) => {
        if (obj.status !== "KO") {
            setQuote(obj.amountOut);
        }
        else {
            setQuote("Error!");
        }
    }

    let previousTimer = null;

    useEffect(() => {

        if (amount && currencyIn && currencyOut) {
            if (previousTimer)
                clearTimeout(previousTimer);

            previousTimer = setTimeout(() => {
                fetchFromRampApi(`/onramp/quote`, 'GET', { input_currency: currencyIn.toUpperCase(), output_currency: currencyOut.toUpperCase(), direction: "fiatToCrypto", amount: amount }, save, dispatch);
            }, 1000);
        }
    }, [amount, currencyIn, currencyOut]);

    return [quote];
}


export const useOnRampAccounts = (sessionId: string, currency: string) => {
    const { dispatch } = useGlobal();
    const [account, setAccount] = useState<IRampOnRampBankAccount>({ iban: "", bic: "", bank_country: "", currency: "", uuid: "" });

    const save = (obj: any) => {
        console.log("Got account", obj);
        if (obj.status !== "KO") {
            setAccount(obj.filter(a => a.currency == currency)[0]);
        }
    }

    useEffect(() => {
        if (sessionId && currency) {
            console.log("FETCHING ONRAMP BANK ACCOUNT");
            fetchFromRampApi(`/onramp/bank-account`, 'GET', { session_id: sessionId }, save, dispatch);
        }
        else {

            console.log("NOT FETCHING ONRAMP BANK ACCOUNT");
        }
    }, [sessionId, currency]);

    return [account];
}