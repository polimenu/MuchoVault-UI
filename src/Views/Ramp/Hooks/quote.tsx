import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";


export const useGetOnRampQuote = (currencyIn: string, currencyOut: string, amount: number): string[] => {
    const [quote, setQuote] = useState("");

    const save = (obj: any) => {
        if (obj.status !== "KO") {
            setQuote(obj.amountOut);
        }
        else {
            setQuote("Error!");
        }
    }

    useEffect(() => {
        if (currencyIn && currencyOut) {
            fetchFromRampApi(`/onramp/quote`, 'GET', { input_currency: currencyIn, output_currency: currencyOut, direction: "fiatToCrypto", amount: amount }, save, null);
        }
    }, [amount, currencyIn, currencyOut]);

    return [quote];
}
