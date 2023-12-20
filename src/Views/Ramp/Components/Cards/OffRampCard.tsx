import { useGlobal } from "@Contexts/Global";
import { useToast } from "@Contexts/Toast";
import { useUserAccount } from "@Hooks/useUserAccount";
import { Card } from "@Views/Common/Card/Card";
import { ConnectionRequired } from "@Views/Common/Navbar/AccountDropdown";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { BlueBtn } from "@Views/Common/V2-Button";
import { useGetBankAccounts, useSetMainBankAccount } from "@Views/Ramp/Hooks/user";
import { IRampBankAccount, IRampUserDetails, rampAtom } from "@Views/Ramp/rampAtom";
import { ViewContext } from "@Views/V2Admin";
import { Skeleton } from "@mui/material";
import { t } from "i18next";
import { useAtom } from "jotai";
import { useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";

export const OffRampCard = ({ userDetails }: { userDetails?: IRampUserDetails }) => {
    const wrapperClasses = 'flex justify-end flex-wrap';
    const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
    const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';

    const [rampState, setRampState] = useAtom(rampAtom);
    const [reload, setReload] = useState(0);
    const [bankAccounts] = useGetBankAccounts(rampState.sessionId, reload);
    const { state } = useGlobal();
    const [bankMainUid, setBankMainUid] = useState("");
    const toastify = useToast();
    const [resultSetMainAccount] = useSetMainBankAccount(rampState.sessionId, bankMainUid);


    useEffect(() => {
        if (resultSetMainAccount.done && resultSetMainAccount.status) {
            toastify(t("ramp.Main bank account updated successfully"));
            setReload(reload + 1);
        }
        else if (resultSetMainAccount.done) {
            toastify({ type: "error", message: resultSetMainAccount.errorMessage })
        }
    }, [resultSetMainAccount]);


    if (!bankAccounts || !userDetails) {
        return <Skeleton
            key="OffRampCard"
            variant="rectangular"
            className="w-full !h-full min-h-[370px] !transform-none !bg-1"
        />
    }

    const accountTitle = (b: IRampBankAccount) => {
        if (!b.iban)
            return "Invalid account";

        const sumIban = b.iban.length > 10 ? `${b.iban.substring(0, 6)}...${b.iban.substring(b.iban.length - 4)}` : b.iban;
        return b.name ? `${b.name} (${sumIban})` : sumIban;
    }

    //ToDo soft code currency
    const sortedAccounts = bankAccounts.sort((b1, b2) => Number(b2.isMain) - Number(b1.isMain)) //Main account the first

    return <Card
        top={<div className='flex'>
            <div className='w-full'>{t("ramp.From Crypto to EUR")}</div>
            <div><BlueBtn onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "BANK_ADD", auxModalData: { currency: "EUR" } }) }}>&nbsp;&nbsp;&nbsp;
                <span dangerouslySetInnerHTML={
                    { __html: t("ramp.Add&nbsp;Account", { interpolation: { escapeValue: false } }) }
                }></span>&nbsp;&nbsp;&nbsp;</BlueBtn></div>
        </div>}
        middle={<TableAligner
            keysName={
                [...sortedAccounts.map((b, i) => {
                    if (i > 0 && b.currency === bankAccounts[i - 1].currency)
                        return '';

                    return t("ramp.currency destination account(s)", { currency: b.currency });
                })]

            }
            values={[
                ...sortedAccounts.map(b => {
                    return <span className={wrapperClasses}>
                        <img src={b.isMain ? "star_filled.png" : "star_empty.png"} className={`w-[1.2em] h-[1.2em] ${!b.isMain ? "pointer" : ""}`}
                            onClick={() => { setBankMainUid(b.uuid); }}
                            onMouseOver={(e) => { e.currentTarget.src = "star_filled.png"; }}
                            onMouseOut={(e) => { e.currentTarget.src = b.isMain ? "star_filled.png" : "star_empty.png"; }}
                            title={b.isMain ? t("ramp.Main account") : t("ramp.Click to set as main account")} /> &nbsp;
                        <Display
                            className="!justify-end inline"
                            data={accountTitle(b)}
                        />
                    </span>
                })]}
            keyStyle={keyClasses}
            valueStyle={valueClasses}

        />
        }
        bottom={
            userDetails.kyc_status.canTransact && <>
                <OffRampButtons bankAccounts={bankAccounts} />
            </>
        } />;
}

const OffRampButtons = ({ bankAccounts }: { bankAccounts: IRampBankAccount[] }) => {
    const [rampState, setRampState] = useAtom(rampAtom);
    const { state } = useGlobal();
    const { address: account } = useUserAccount();
    //const { activeChain } = useContext(ViewContext) ?? { activeChain: null };
    const { chain } = useNetwork();
    const ALLOWED_CHAIN = 42161;  //ToDo softcode chain


    const btnClasses = '';
    const hasBank = bankAccounts && bankAccounts.length > 0

    if (!account || !chain || chain.id != ALLOWED_CHAIN)
        return (
            <div className={btnClasses}>
                <ConnectionRequired>
                    <></>
                </ConnectionRequired>
            </div>
        );

    console.log("hasBank", hasBank);

    return (<>
        {hasBank && <div className={`${btnClasses} flex gap-5`}>
            <BlueBtn
                isDisabled={state.txnLoading > 1}
                isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "OFFRAMP" }) }}>{t("ramp.OffRamp (Crypto to EUR)")}</BlueBtn>
        </div>}
        {!hasBank && <div className={`${btnClasses} flex gap-5`}>
            <BlueBtn
                isDisabled={true}
                onClick={() => { }}>{t("ramp.Please add a bank account")}</BlueBtn>
        </div>}
    </>);

}