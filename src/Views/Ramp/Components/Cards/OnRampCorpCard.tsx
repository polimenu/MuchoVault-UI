//ToDo soft code currency
import { ICorporate } from "@Views/Ramp/Hooks/corp";
import { IRampTokenPreference } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { OnRampGenericCard } from "./OnRampGenericCard";

export const OnRampCorpCard = ({ tokenPreferences, corpDetails }: { tokenPreferences?: IRampTokenPreference[], corpDetails?: ICorporate }) => {
    const ALLOWED_CURRENCY = "EUR";
    const curr = tokenPreferences ? tokenPreferences.find(t => t.currency == ALLOWED_CURRENCY) : null;

    if (!tokenPreferences || !corpDetails || !curr) {
        return <Skeleton
            key="TokenPreferencesCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    const target_address = curr.chain == "solana" ? corpDetails.target_solana_address : corpDetails.target_address;

    return <OnRampGenericCard
        headTitle={corpDetails.legal_name}
        target_address={target_address}
        canTransact={corpDetails.kybStatus.canTransact}
        targetAddressModalData={{ currentAddress: target_address, uuid: corpDetails.uuid }}
        onRampModalData={{ currency: ALLOWED_CURRENCY, uuid: corpDetails.uuid }}
        onRampPrefModalData={{ ...curr, uuid: corpDetails.uuid }}
        tokenPreferences={tokenPreferences}
    />;

}