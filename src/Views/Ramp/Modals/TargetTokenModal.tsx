import { useAtom } from "jotai";
import { rampAtom, rampDataAtom } from "../rampAtom";
import { useEffect, useState } from "react";
import { useGlobal } from "@Contexts/Global";
import { ITokenChain, usePatchTokenPref } from "../Hooks/user";
import { BlueBtn } from "@Views/Common/V2-Button";
import { t } from "i18next";
import { ChainsDropDown } from "../Components/ChainsDropDown";
import { TokensDropDown } from "../Components/TokensDropDown";
import { ICorporate, usePatchTokenPrefB2B } from "../Hooks/corp";


export const TargetTokenModal = () => {
    const { state } = useGlobal();
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const current = rampData.tokenPreferences ? rampData.tokenPreferences.find(t => t.currency == pageState.auxModalData.currency) : null;
    const defaultToken = current ? { token: current.token, chain: current.chain } : { token: "", chain: "" };
    const [chain, setChain] = useState(defaultToken.chain);
    const [token, setToken] = useState<ITokenChain>(defaultToken);
    const [tokenChain, setTokenChain] = useState<ITokenChain>({ token: '', chain: '' });
    const [isPatched] = usePatchTokenPref(pageState.sessionId, pageState.auxModalData.currency, tokenChain);

    useEffect(() => {
        if (isPatched) {
            window.location.reload();
            //setPageState({ ...pageState, isModalOpen: false, activeModal: "", auxModalData: null })
        }
    }, [isPatched]);

    return (
        <>
            <div className='mr-5'>
                <div className="text-f15 mb-5 mr-5">{t("ramp.Select target token", { currency: pageState.auxModalData.currency })}:</div>
                <div className="text-f12 mb-5 mr-5">{t("ramp.Chain")}:
                    <ChainsDropDown setChain={setChain} chain={chain} defaultChain={defaultToken.chain} />
                </div>
                <div className="text-f12 mb-5 mr-5">{t("ramp.Token")}:
                    <TokensDropDown chain={chain} setToken={setToken} token={token} />
                </div>
                <div className="text-f15 mb-5 mr-5">&nbsp;</div>
                <div className="text-f15 mb-5 mr-5 m-auto"><BlueBtn
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1} onClick={() => { setTokenChain(token) }} >{t("ramp.Save")}</BlueBtn></div>
            </div>
        </>
    );
}



export const TargetTokenModalB2B = ({ corpId }: { corpId: string }) => {
    const { state } = useGlobal();
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const tokenPreferences = rampData.tokenPreferencesB2B ? rampData.tokenPreferencesB2B.find(c => c.corporateUuid == corpId)?.tokenPreferences : null;
    const current = tokenPreferences ? tokenPreferences.find(t => t.currency == pageState.auxModalData.currency) : null;
    //console.log("current", current);
    //console.log("pageState.auxModalData", pageState.auxModalData);
    const defaultToken = current ? { token: current.token, chain: current.chain } : { token: "", chain: "" };
    const [chain, setChain] = useState(defaultToken.chain);
    const [token, setToken] = useState<ITokenChain>(defaultToken);
    const [tokenChain, setTokenChain] = useState<ITokenChain>({ token: '', chain: '' });
    const [isPatched] = usePatchTokenPrefB2B(pageState.sessionId, corpId, pageState.auxModalData.currency, tokenChain);

    useEffect(() => {
        if (isPatched) {
            window.location.reload();
            //setPageState({ ...pageState, isModalOpen: false, activeModal: "", auxModalData: null })
        }
    }, [isPatched]);

    return (
        <>
            <div className='mr-5'>
                <div className="text-f15 mb-5 mr-5">{t("ramp.Select target token", { currency: pageState.auxModalData.currency })}:</div>
                <div className="text-f12 mb-5 mr-5">{t("ramp.Chain")}:
                    <ChainsDropDown setChain={setChain} chain={chain} defaultChain={defaultToken.chain} />
                </div>
                <div className="text-f12 mb-5 mr-5">{t("ramp.Token")}:
                    <TokensDropDown chain={chain} setToken={setToken} token={token} />
                </div>
                <div className="text-f15 mb-5 mr-5">&nbsp;</div>
                <div className="text-f15 mb-5 mr-5 m-auto"><BlueBtn
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1} onClick={() => { setTokenChain(token) }} >{t("ramp.Save")}</BlueBtn></div>
            </div>
        </>
    );
}