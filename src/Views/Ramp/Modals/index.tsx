import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { rampAtom } from '../rampAtom';
import { prettyPrintJson } from 'pretty-print-json';
import { TargetAddressModal } from './TargetAddressModal';
import { TargetTokenModal, TargetTokenModalB2B } from './TargetTokenModal';
import { CompleteKYCModal } from './CompleteKYCModal';
import { NewUserModal } from './NewUserModal';
import { BankAddModal } from './BankAddModal';
import { OnRampModal } from './OnRampModal';
import { OffRampModal } from './OffRampModal';
import { KycDetailModal } from './KYCDetailModal';
import { TrxDetailModal } from './TrxDetailModal';
import { KybDetailModal } from './KYBDetailModal';
import { NewCorpModal } from './NewCorpModal';
import { EditCorpModal } from './EditCorpModal';
import { OnRampModalB2B } from './OnRampModalB2B';
import { BankAddModalB2B } from './BankAddModalB2B';
import { OffRampModalB2B } from './OffRampModalB2B';

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
    const [pageState, setPageState] = useAtom(rampAtom);
    const activeModal = pageState.activeModal;


    if (!activeModal)
        return <div>No modal</div>;

    if (activeModal == "TARGET_ADDRESS")
        return <TargetAddressModal />;

    if (activeModal == "ONRAMP_PREF" && pageState.auxModalData.uuid)
        return <TargetTokenModalB2B corpId={pageState.auxModalData.uuid} />;

    if (activeModal == "ONRAMP_PREF")
        return <TargetTokenModal />;

    if (activeModal == "KYC")
        return <CompleteKYCModal />;

    if (activeModal == "NEWUSER")
        return <NewUserModal />;

    if (activeModal == "NEWCORP")
        return <NewCorpModal />;

    if (activeModal == "BANK_ADD" && pageState.auxModalData.uuid)
        return <BankAddModalB2B />;

    if (activeModal == "BANK_ADD")
        return <BankAddModal />;

    if (activeModal == "ONRAMP" && pageState.auxModalData.uuid)
        return <OnRampModalB2B />;

    if (activeModal == "ONRAMP")
        return <OnRampModal />;

    if (activeModal == "OFFRAMP" && pageState.auxModalData.uuid)
        return <OffRampModalB2B />;

    if (activeModal == "OFFRAMP")
        return <OffRampModal />;

    if (activeModal == "ADMIN_KYC_DETAIL")
        return <KycDetailModal />;

    if (activeModal == "ADMIN_KYB_DETAIL")
        return <KybDetailModal />;

    if (activeModal == "ADMIN_TRX_DETAIL")
        return <TrxDetailModal />;

    if (activeModal == "INTERACTION_DETAIL")
        return <pre className='json-container !text-f14 h-[30vw] oauto' dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(pageState.auxModalData.interaction) }}>
        </pre>

    if (activeModal == "EDITCORP")
        return <EditCorpModal uuid={pageState.auxModalData.uuid} />;

    console.log("auxModalData", pageState.auxModalData);
    return <div>{activeModal}</div>;
}



