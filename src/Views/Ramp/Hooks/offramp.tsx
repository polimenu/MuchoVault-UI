import { useGlobal } from "@Contexts/Global";
import { fetchFromRampApi } from "./fetch";
import { useContext, useEffect, useState } from "react";
import { useWriteCall } from "@Hooks/useWriteCall";
import { useContractRead } from "wagmi";
import ERC20AbiExt from '../Config/Abis/ERC20Ext.json';
import { useAtom } from "jotai";
import { rampAtom } from "../rampAtom";
import { useUserAccount } from "@Hooks/useUserAccount";
import { useActiveChain } from "@Hooks/useActiveChain";
import { getBNtoStringCopy } from "@Utils/useReadCall";
import { ViewContext } from "..";
import { BigNumber } from "ethers";


export const useGetOffRampQuote = (currencyIn: string, currencyOut: string, amount: number): string[] => {
    const { dispatch } = useGlobal();
    const [quote, setQuote] = useState("");
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const save = (obj: any) => {
        if (obj.status !== "KO") {
            setQuote(Math.round(obj.amountOut * 100) / 100);
        }
        else {
            setQuote("Error!");
        }
    }

    const cleanToken = (token: string) => {
        let tk = token.toUpperCase().replace(".", "");
        return tk;
    }

    useEffect(() => {

        if (amount && currencyIn && currencyOut) {
            if (timer) {
                //console.log("Cleaning previous timer");
                clearTimeout(timer);
            }

            setTimer(setTimeout(() => {
                //console.log("Setting new timer");
                fetchFromRampApi(`/onramp/quote`, 'GET', { input_currency: cleanToken(currencyIn), output_currency: currencyOut.toUpperCase(), direction: "cryptoToFiat", amount: amount }, save, dispatch);
            }, 1000)
            );
        }
    }, [amount, currencyIn, currencyOut]);

    return [quote];
}



export const useOffRampWallet = (sessionId: string, chain: string) => {
    const { dispatch } = useGlobal();
    const [wallet, setWallet] = useState("");

    const save = (obj: any) => {
        console.log("$$$$$$$$$$$$$$$$$$$$  Got wallet", obj, sessionId, chain);
        if (obj.status !== "KO") {
            setWallet(obj[0].address);
        }
    }

    useEffect(() => {
        if (sessionId && chain) {
            console.log("FETCHING OFFRAMP WALLET");
            fetchFromRampApi(`/offramp/wallet`, 'GET', { session_id: sessionId, chain }, save, dispatch);
        }
        else {

            console.log("NOT FETCHING OFFRAMP WALLET");
        }
    }, [sessionId, chain]);

    return [wallet];
}

export const useSendToken = (address: string, destination: string, value: number, decimals: number) => {
    const { activeChain } = useContext(ViewContext);
    console.log("Active Chain", activeChain);
    const { writeCall } = useWriteCall(address, ERC20AbiExt);
    const [pageState, setPageState] = useAtom(rampAtom);
    function callBack(res) {
        if (res.payload)
            setPageState({
                ...pageState,
                isModalOpen: false,
                activeModal: "",
            });
    }

    const BNvalue = Math.ceil(value * 10 ** decimals);
    //console.log(" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Configuring useSendToken", address, destination, BNvalue);
    const call = () => {
        //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Sending!!!!!!!!!!", address, destination, value, decimals)
        writeCall(callBack, "transfer", [destination, BNvalue]);
    }

    return [call]
}

export const useGetAmountInWallet = (address: string, decimals: number) => {
    const { activeChain } = useActiveChain();
    const { address: account } = useUserAccount();

    if (!account || !activeChain)
        return [0];


    const call = {
        address: address,
        abi: ERC20AbiExt,
        functionName: 'balanceOf',
        args: [account],
        chainId: activeChain?.id,
        watch: true
    }

    let { data } = useContractRead(call);
    if (data) {
        console.log("getamountinwallet", data);
        data = getBNtoStringCopy([data]);
        console.log("getamountinwallet after bn", data);
        const amount = data[0] / (10 ** decimals);
        console.log("getamountinwallet after bn number", amount);

        return [amount];
    }

    return [0];
}