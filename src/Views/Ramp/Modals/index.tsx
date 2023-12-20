import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { rampAtom } from '../rampAtom';
import { prettyPrintJson } from 'pretty-print-json';
import { TargetAddressModal } from './TargetAddressModal';
import { TargetTokenModal } from './TargetTokenModal';
import { CompleteKYCModal } from './CompleteKYCModal';
import { NewUserModal } from './NewUserModal';
import { BankAddModal } from './BankAddModal';
import { OnRampModal } from './OnRampModal';
import { OffRampModal } from './OffRampModal';
import { KycDetailModal } from './KYCDetailModal';
import { TrxDetailModal } from './TrxDetailModal';

export const RampModals = () => {
    const [pageState, setPageState] = useAtom(rampAtom);

    const closeModal = () => {
        if (pageState.auxModalData && pageState.auxModalData.bakPageState) {
            setPageState(pageState.auxModalData.bakPageState);
        }
        else {
            setPageState({ ...pageState, isModalOpen: false, activeModal: "" });
        }
    }
    return (
        <Dialog open={pageState.isModalOpen} onClose={closeModal} className='w-full'>
            <div className="text-1 bg-2 p-6 rounded-md relative w-full">
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

    if (activeModal == "KYC")
        return <CompleteKYCModal />;

    if (activeModal == "NEWUSER")
        return <NewUserModal />;

    if (activeModal == "BANK_ADD")
        return <BankAddModal />;

    if (activeModal == "ONRAMP")
        return <OnRampModal />;

    if (activeModal == "OFFRAMP")
        return <OffRampModal />;

    if (activeModal == "ADMIN_KYC_DETAIL")
        return <KycDetailModal />;

    if (activeModal == "ADMIN_TRX_DETAIL")
        return <TrxDetailModal />;

    if (activeModal == "INTERACTION_DETAIL")
        return <pre className='json-container !text-f14 h-[30vw] oauto' dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(pageState.auxModalData.interaction) }}>
        </pre>

    return <div>{activeModal}</div>;
}



