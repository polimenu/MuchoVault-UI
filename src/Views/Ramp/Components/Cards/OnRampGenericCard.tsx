//ToDo soft code currency
import { useGlobal } from "@Contexts/Global";
import { Card } from "@Views/Common/Card/Card";
import { TableAligner } from "@Views/Common/TableAligner";
import { Display } from "@Views/Common/Tooltips/Display";
import { addressSummary } from "@Views/Common/Utils";
import { BlueBtn } from "@Views/Common/V2-Button";
import { networkBeautify, tokenBeautify } from "@Views/Ramp/Utils";
import { rampAtom } from "@Views/Ramp/rampAtom";
import { IRampTokenPreference } from "@Views/Ramp/rampAtom";
import { t } from "i18next";
import { useAtom } from "jotai";

export const OnRampGenericCard = ({
    headTitle,
    target_address,
    canTransact,
    targetAddressModalData,
    onRampModalData,
    onRampPrefModalData,
    tokenPreferences
}:
    {
        headTitle: string,
        target_address: string,
        canTransact: boolean,
        targetAddressModalData: { currentAddress: string, uuid?: string },
        onRampModalData: { currency: string, uuid?: string },
        onRampPrefModalData: any,
        tokenPreferences: IRampTokenPreference[]
    }) => {
    const [rampState, setRampState] = useAtom(rampAtom);
    const { state } = useGlobal();
    const wrapperClasses = 'flex justify-end flex-wrap';
    const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
    const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';

    const editIconClass = 'w-[1vw] h-[1vw] inline ml-5';

    return <Card
        top={(headTitle ? headTitle + " - " : "") + t("ramp.From EUR to Crypto")}
        middle={<TableAligner
            keysName={
                [
                    ...tokenPreferences.map(z => t("ramp.Convert currency to", { currency: z.currency })),
                    t("ramp.Target address")
                ]
            }
            values={[...tokenPreferences.map(t => {
                return <span className={`${wrapperClasses} pointer`}
                    onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "ONRAMP_PREF", auxModalData: onRampPrefModalData }) }}>
                    <Display
                        className="!justify-end"
                        data={tokenBeautify(t.token)}
                    />
                    &nbsp;
                    (<Display
                        className="!justify-end"
                        data={networkBeautify(t.chain)}
                    />)
                    <img src='edit_wh.png' className={editIconClass} />
                </span>
            }),

            <span className='pointer' onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "TARGET_ADDRESS", auxModalData: targetAddressModalData }) }}>{target_address ? addressSummary(target_address) : t("ramp.Not set!")}
                <img src='edit_wh.png' className={editIconClass} />
            </span>]}
            keyStyle={keyClasses}
            valueStyle={valueClasses}

        />}
        bottom={canTransact && <>
            {target_address && <div className="flex gap-5">
                <BlueBtn
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1} onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "ONRAMP", auxModalData: onRampModalData }) }}>{t("ramp.OnRamp (from EUR to Crypto)")}</BlueBtn>
            </div>}
            {!target_address && <div className="flex gap-5">
                <BlueBtn
                    isDisabled={true} onClick={() => { }}>{t("ramp.Please set a target address")}</BlueBtn>
            </div>}
        </>} />;
}