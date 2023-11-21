import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { rampAtom } from '../rampAtom';
import BufferInput from '@Views/Common/BufferInput';
import { useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { ITokenChain, usePatchAddress, usePatchTokenPref, useRampSession, useRampTokens } from '../Hooks/rampHooks';
import { underLineClass } from '../Components/OnRampStatus';

export const RampModals = () => {
    const [pageState, setPageState] = useAtom(rampAtom);

    const closeModal = () =>
        setPageState({
            ...pageState,
            isModalOpen: false,
            activeModal: "",
        });
    return (
        <Dialog open={pageState.isModalOpen} onClose={closeModal}>
            <div className="text-1 bg-2 p-6 rounded-md relative">
                <IconButton
                    className="!absolute text-1 top-[20px] right-[20px]"
                    onClick={closeModal}
                >
                    <CloseOutlined />
                </IconButton>
                {pageState.isModalOpen && <ModalChild />}
            </div>
        </Dialog>
    );
};

function ModalChild() {
    const [pageState, setPageState] = useAtom(rampAtom);
    const activeModal = pageState.activeModal;

    if (!activeModal)
        return <div>No modal</div>;

    if (activeModal == "TARGET_ADDRESS")
        return <TargetAddressModal />;


    if (activeModal == "ONRAMP_PREF")
        return <TargetTokenModal />;


    return <div>{activeModal}</div>;
}

function TargetAddressModal() {
    const [pageState] = useAtom(rampAtom);
    const currentAddress = pageState.auxModalData && pageState.auxModalData.currentAddress ? pageState.auxModalData.currentAddress : "";
    const [val, setVal] = useState(currentAddress);
    const [addr, setAddr] = useState('');
    const { state } = useGlobal();
    const [sessionId] = useRampSession();
    const [isPatched] = usePatchAddress(sessionId, addr);
    if (isPatched) {
        window.location.reload();
    }
    return (
        <>
            <div>
                <div className="text-f15 mb-5">Change target address</div>
                <BufferInput
                    placeholder={"Enter your new address"}
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={val}
                    onChange={(val) => {
                        setVal(val);
                    }}
                />
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setAddr(val); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    Change address
                </BlueBtn>
            </div>
        </>
    );
}

function TargetTokenModal() {
    const [pageState] = useAtom(rampAtom);
    const currentAddress = pageState.auxModalData && pageState.auxModalData.currentAddress ? pageState.auxModalData.currentAddress : "";
    const [sessionId] = useRampSession();
    const [tokens] = useRampTokens();
    const [token, setToken] = useState<ITokenChain>({ token: '', chain: '' });
    const [isPatched] = usePatchTokenPref(sessionId, pageState.auxModalData.currency, token);

    if (isPatched) {
        window.location.reload();
    }
    return (
        <>
            <div className='mr-5'>
                <div className="text-f15 mb-5 mr-5">Select {pageState.auxModalData.currency} target token:</div>
                <ul className='text-f12'>
                    {tokens && tokens.map(t => {

                        return t.network_name &&
                            t.network_name.map(n => {
                                return <li key={t.currency_label + "_" + n} className={`${underLineClass} m-auto`}
                                    onClick={() => {
                                        setToken({ token: t.currency_label.toLowerCase(), chain: n.toLowerCase() })
                                    }}>{t.currency_label} ({n})</li>;
                            });
                    }
                    )
                    }
                </ul>
            </div>
        </>
    );
}
