import { useGlobal } from "@Contexts/Global";
import { useToast } from "@Contexts/Toast";
import { fetchFromRampApi } from "./fetch";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { ERampStatus, rampAtom } from "../rampAtom";
import { t } from "i18next";
import { RAMP_CONFIG } from "../Config/rampConfig";

export const useRampSession = () => {
    const [pageState, setPageState] = useAtom(rampAtom);
    const savedSession = sessionStorage.getItem("ramp_session_id");
    //console.log("stored session", savedSession);

    if (savedSession && savedSession !== pageState.sessionId) {
        //console.log("Session stored is different, updating", savedSession);
        const savedMD = sessionStorage.getItem("ramp_session_identifier") ?? "";
        sessionStorage.setItem("ramp_session_id", savedSession);
        setPageState({ ...pageState, sessionId: savedSession, loginStatus: ERampStatus.LOGGED });
    }
    //console.log("Returning session", pageState.sessionId);

    return pageState.sessionId;
}

export const useLogout = () => {
    //const [rampState, setRampState] = useAtom(rampAtom)
    sessionStorage.removeItem("ramp_session_id");
    window.location.reload();
    //setRampState({ sessionId: "", loginStatus: ERampStatus.NOT_LOGGED, isModalOpen: false, activeModal: "", email: "" })
}

export const useOtpSent = (email: string) => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [loginStatus, setLoginStatus] = useState(false);
    const save = (obj: { status: string, errorMessage?: string }) => {
        //console.log("Saving login by email", obj);
        if (obj.status === "OK")
            setLoginStatus(true);
        else {
            //console.log("Toastifying error", obj);
            toastify({ type: "error", msg: obj.errorMessage ? obj.errorMessage : t("ramp.Login error") });
            //console.log("Toastified error");
        }
    }

    useEffect(() => {
        if (!email)
            setLoginStatus(false);
        else {
            //console.log("Fetching login by email");
            fetchFromRampApi(`/user-login`, 'POST', { email: email }, save, dispatch, toastify);
        }
    }, [email]);


    return [loginStatus];
}

export const useOtpLogin = (email?: string, otp?: string, saveSession?: any) => {
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const saveLogin = (obj: { status: string, session_id: string }) => {
        if (obj.status === "OK") {
            //console.log("Saving session", obj);
            saveSession(obj.session_id);
        }
        else {
            toastify({ type: "error", msg: t("ramp.Invalid OTP code") });
        }
    }

    useEffect(() => {
        if (email && otp) {
            //console.log("Fetching OTP session");
            fetchFromRampApi(`/login/otp-email`, 'POST', { email: email, otp: otp }, saveLogin, dispatch, toastify);
        }
    }, [email, otp]);
}