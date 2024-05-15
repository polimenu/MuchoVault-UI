import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { prettyPrintJson } from 'pretty-print-json';
import { poolsAtom, poolsDataAtom } from '../poolsAtom';
import BufferInput from '@Views/Common/BufferInput';
import { useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { TextMultipleDropDown } from '../Components/TextDropDown';

export const PoolDetailModals = () => {
    const [pageState, setPageState] = useAtom(poolsAtom);

    const closeModal = () => {
        setPageState({ ...pageState, isModalOpen: false, activeModal: "" });
    }
    return (
        <Dialog open={pageState.isModalOpen} onClose={closeModal} className='w-full'>
            <div className="text-1 bg-2 p-6 rounded-md relative w-full oauto">
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
    const [pageState, setPageState] = useAtom(poolsAtom);
    const activeModal = pageState.activeModal;


    if (!activeModal)
        return <div>No modal</div>;

    if (activeModal == "setMin" || activeModal == "setMax")
        return <SetMinMaxModal />;

    return <div>{activeModal}</div>;
}

const SetMinMaxModal = () => {
    const [pageState, setPageState] = useAtom(poolsAtom);

    if (!pageState || !pageState.auxModalData)
        return <></>;

    const { num, setNum, title, currentValue, reverse } = pageState.auxModalData;
    const [input, setInput] = useState(currentValue);

    const closeModal = (anchor: boolean = false) => {
        console.log("Closing modal", anchor);
        setNum(reverse ? 1 / input : input, anchor);
        setPageState({ ...pageState, isModalOpen: false, activeModal: "" });
    }

    return <div className="text-f16 m-auto mb-5 w-full mt-5">
        <div className='max-h-[400px] o-auto'>
            <BufferInput
                className=""
                header={`${title}:`}
                bgClass="!bg-2 !text-1"
                ipClass="!bg-1 !p-3 w-full !text-1 mt-5"
                value={input}
                onChange={(val) => {
                    setInput(val);
                }}
            />
            <BlueBtn className='mb-5' onClick={() => closeModal(false)}>Save</BlueBtn>
            <BlueBtn className='mb-5' onClick={() => closeModal(true)}>Save & Anchor</BlueBtn>
        </div>

    </div>
}

