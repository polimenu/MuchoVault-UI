import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { prettyPrintJson } from 'pretty-print-json';
import { poolsAtom, poolsDataAtom } from '../poolsAtom';
import BufferInput from '@Views/Common/BufferInput';
import { useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { TextMultipleDropDown } from '../Components/TextDropDown';

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

    const closeModal = () => {
        setNum(reverse ? 1 / input : input);
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
            <BlueBtn className='mb-5' onClick={closeModal}>Save</BlueBtn>
        </div>

    </div>
}

const FilterModal = () => {
    const [pageState, setPageState] = useAtom(poolsAtom);
    const [poolsData] = useAtom(poolsDataAtom);
    const [filterStatusParent, setFilterParent] = [pageState.auxModalData.filter, pageState.auxModalData.setFilter];
    const [filter, setFilter] = useState(filterStatusParent);
    const closeModal = () => {
        setPageState({ ...pageState, isModalOpen: false, activeModal: "" });
    }

    if (!poolsData || !poolsData.pools)
        return <></>;

    return <div className="text-f16 m-auto mb-5 w-full mt-5">
        <div className='max-h-[400px] o-auto'>
            <BufferInput
                className=""
                header="Filters:"
                bgClass="!bg-2 !text-1"
                placeholder={"Token A"}
                ipClass="!bg-1 !p-3 w-full !text-1 mt-5"
                value={filter.tokenA}
                onChange={(val) => {
                    setFilter({ ...filter, tokenA: val.toUpperCase() });
                    setFilterParent({ ...filter, tokenA: val.toUpperCase() });
                    //console.log("Token A changed", val);
                }}
            />
            <BufferInput
                className=""
                bgClass="!bg-2 !text-1"
                placeholder={"Token B"}
                ipClass="!bg-1 !p-3 w-full !text-1"
                value={filter.tokenB}
                onChange={(val) => {
                    setFilter({ ...filter, tokenB: val.toUpperCase() });
                    setFilterParent({ ...filter, tokenB: val.toUpperCase() });
                }}
            />

            <TextMultipleDropDown
                list={poolsData.pools.map(p => p.ChainId).filter((v, i, a) => a.indexOf(v) === i).sort()}
                placeHolder="Network"
                selected={filter.networks}
                toggleSelected={(n) => { setFilter({ ...filter, networks: n }); setFilterParent({ ...filter, networks: n }); }}
                name="networkDropDown"
                containerClass="w-full p-2"
                bgClass="flex items-center justify-between text-f15 font-medium bg-1 pl-5 ml-4 mr-4 !pb-[10px] !pt-[10px] pr-[0] py-[6px] rounded-sm text-2"
                bufferClass="py-4 px-4 !bg-2 h-[40vw] !y-auto ml-15 w-[50px]"
            />

            <TextMultipleDropDown
                list={poolsData.pools.map(p => p.DexId).filter((v, i, a) => a.indexOf(v) === i).sort()}
                placeHolder="Protocol"
                selected={filter.protocols}
                toggleSelected={(p) => { setFilter({ ...filter, protocols: p }); setFilterParent({ ...filter, protocols: p }) }}
                name="protocolDropDown"
                containerClass="w-full p-2"
                bgClass="flex items-center justify-between text-f15 font-medium bg-1 pl-5 ml-4 mr-4 !pb-[10px] !pt-[10px] pr-[0] py-[6px] rounded-sm text-2"
                bufferClass="py-4 px-4 !bg-2 h-[40vw] !y-auto ml-15 w-[50px]"
            />

            <BufferInput
                className=""
                bgClass="!bg-2 !text-1"
                placeholder={"Min. TVL"}
                ipClass="!bg-1 !p-3 w-full !text-1"
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
                bgClass="!bg-2 !text-1"
                placeholder={"Min. Vol"}
                ipClass="!bg-1 !p-3 w-full !text-1"
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
                bgClass="!bg-2 !text-1 mb-5"
                placeholder={"Min. Fees"}
                ipClass="!bg-1 !p-3 w-full !text-1"
                value={filter.feesMin ? filter.feesMin.toString() : ""}
                onChange={(val) => {
                    if (!isNaN(val)) {
                        setFilter({ ...filter, feesMin: Number(val) });
                        setFilterParent({ ...filter, feesMin: Number(val) });
                    }
                }}
            />
            <BlueBtn className='mb-5' onClick={closeModal}>Filter</BlueBtn>
        </div>

    </div>
}



