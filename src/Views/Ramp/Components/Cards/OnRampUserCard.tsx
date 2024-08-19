//ToDo soft code currency
import { IRampTokenPreference, IRampUserDetails } from "@Views/Ramp/rampAtom";
import { Skeleton } from "@mui/material";
import { OnRampGenericCard } from "./OnRampGenericCard";

export const OnRampUserCard = ({ tokenPreferences, userDetails }: { tokenPreferences?: IRampTokenPreference[], userDetails?: IRampUserDetails }) => {
    const ALLOWED_CURRENCY = "EUR";
    const curr = tokenPreferences ? tokenPreferences.find(t => t.currency == ALLOWED_CURRENCY) : null;

    if (!tokenPreferences || !userDetails || !curr) {
        return <Skeleton
            key="TokenPreferencesCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    const target_address = curr.chain == "solana" ? userDetails.target_solana_address : userDetails.target_address;
    //console.log("tokenPref", tokenPreferences);

    return <OnRampGenericCard
        headTitle={""}
        target_address={target_address}
        canTransact={userDetails.kyc_status.canTransact}
        targetAddressModalData={{ currentAddress: target_address }}
        onRampModalData={{ currency: ALLOWED_CURRENCY }}
        onRampPrefModalData={curr}
        tokenPreferences={tokenPreferences}
    />;

}