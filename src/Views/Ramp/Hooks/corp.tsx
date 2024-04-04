import { useGlobal } from "@Contexts/Global";
import { ICorporate, INewCorporateRequest } from "./user";
import { useToast } from "@Contexts/Toast";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { rampAtom } from "../rampAtom";
import { t } from "i18next";
import { fetchFromRampApi } from "./fetch";



export const useGetCorpDetails = (sessionId: string, corporationUuids: string[]): ICorporate[][] => {
    const [corpsDetails, setCorpsDetails] = useState<ICorporate[]>([]);

    const save = (obj: any) => {
        console.log("****************setting GET CORPORATES", obj);
        if (obj.status !== "KO") {
            setCorpsDetails(obj.response);
        }
    }

    useEffect(() => {

        if (sessionId && corporationUuids && corporationUuids.length > 0) {
            console.log("CALLING GET CORPORATES");
            fetchFromRampApi(`/corporates`, 'GET', { uuids: corporationUuids.join(","), session_id: sessionId }, save, () => { });
        }

    }, [sessionId, corporationUuids]);

    return [corpsDetails];
}

export const useCreateCorp = (request?: INewCorporateRequest) => {
    ///user/target-address
    const { dispatch } = useGlobal();
    const toastify = useToast();
    const [result, setResult] = useState(false);
    const [rampState, setRampState] = useAtom(rampAtom);

    const save = (obj: { status: string, errorMessage: string }) => {
        //console.log("Obj res create user", obj);
        if (obj.status === "OK") {
            //console.log("User created ok", obj);
            setResult(true);
            //window.location.reload();
            toastify(t("ramp.Corporation successfully created"));
            setRampState({ ...rampState, isModalOpen: false });
        }
        else {
            toastify({ type: "error", msg: (obj.errorMessage ? obj.errorMessage : t("ramp.Could not create Corporation")) });
        }
    }

    useEffect(() => {
        if (request && request.legal_name && request.type && request.contact_details && request.registered_address && request.target_address) {

            //console.log("Fetching Corp creation");
            fetchFromRampApi('/corporate', 'POST', request, save, dispatch, toastify);

        }
    }, [request]);

    return [result];
}