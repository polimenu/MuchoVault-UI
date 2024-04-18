import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { prettyPrintJson } from 'pretty-print-json';
import { poolsAtom } from '../poolsAtom';
import BufferInput from '@Views/Common/BufferInput';
import { useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';

export const PoolsModals = () => {
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

    if (activeModal == "FILTER")
        return <FilterModal />;

    return <div>{activeModal}</div>;
}

const FilterModal = () => {
    const [pageState, setPageState] = useAtom(poolsAtom);
    const [filterStatusParent, setFilterParent] = [pageState.auxModalData.filter, pageState.auxModalData.setFilter];
    const [filter, setFilter] = useState(filterStatusParent);
    const closeModal = () => {
        setPageState({ ...pageState, isModalOpen: false, activeModal: "" });
    }

    return <div className="text-f16 m-auto mb-5 w-full mt-5">
        <div className='max-h-[400px] o-auto'>
            <BufferInput
                className=""
                bgClass="!bg-2"
                header={"Token A:"}
                ipClass="mt-1 !bg-1 mt-3 mb-5"
                value={filter.tokenA}
                onChange={(val) => {
                    setFilter({ ...filter, tokenA: val });
                    setFilterParent({ ...filter, tokenA: val });
                    //console.log("Token A changed", val);
                }}
            />
            <BufferInput
                className=""
                bgClass="!bg-2"
                header={"Token B:"}
                ipClass="mt-1 !bg-1 mt-3 mb-5"
                value={filter.tokenB}
                onChange={(val) => {
                    setFilter({ ...filter, tokenB: val });
                    setFilterParent({ ...filter, tokenB: val });
                }}
            />
            <BufferInput
                className=""
                bgClass="!bg-2"
                header={"Network:"}
                ipClass="mt-1 !bg-1 mt-3 mb-5"
                value={filter.network}
                onChange={(val) => {
                    setFilter({ ...filter, network: val });
                    setFilterParent({ ...filter, network: val });
                }}
            />
            <BufferInput
                className=""
                bgClass="!bg-2"
                header={"Protocol:"}
                ipClass="mt-1 !bg-1 mt-3 mb-5"
                value={filter.protocol}
                onChange={(val) => {
                    setFilter({ ...filter, protocol: val });
                    setFilterParent({ ...filter, protocol: val });
                }}
            />

            <BufferInput
                className=""
                bgClass="!bg-2"
                header={"Min. TVL:"}
                ipClass="mt-1 !bg-1 mt-3 mb-5"
                value={filter.tvlMin ? filter.tvlMin.toString() : ""}
                onChange={(val) => {
                    if (!isNaN(val)) {
                        setFilter({ ...filter, tvlMin: Number(val) });
                        setFilterParent({ ...filter, tvlMin: Number(val) });
                    }
                }}
            />
            <BufferInput
                className=""
                bgClass="!bg-2"
                header={"Min Vol:"}
                ipClass="mt-1 !bg-1 mt-3 mb-5"
                value={filter.volumeMin ? filter.volumeMin.toString() : ""}
                onChange={(val) => {
                    if (!isNaN(val)) {
                        setFilter({ ...filter, volumeMin: Number(val) });
                        setFilterParent({ ...filter, volumeMin: Number(val) });
                    }
                }}
            />
            <BufferInput
                className=""
                bgClass="!bg-2"
                header={"Min Fees:"}
                ipClass="mt-1 !bg-1 mt-3 mb-5"
                value={filter.feesMin ? filter.feesMin.toString() : ""}
                onChange={(val) => {
                    if (!isNaN(val)) {
                        setFilter({ ...filter, feesMin: Number(val) });
                        setFilterParent({ ...filter, feesMin: Number(val) });
                    }
                }}
            />
            <BlueBtn onClick={closeModal}>Filter</BlueBtn>
        </div>

    </div>
}



