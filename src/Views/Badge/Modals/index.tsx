import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { badgeAtom } from '../badgeAtom';
import { SubModal } from './sub';
import { SubscribeUserModal } from './subuser';
import { EditNameModal } from './editName';
import { EditDurationModal } from './editDuration';
import { EditPricingTokenModal } from './editPricingToken';
import { EditPricingPriceModal } from './editPricingPrice';
import { EditPricingDateModal } from './editPricingDate';
import { TokenIdActionModal } from './tokenIdAction';
import { DiscountModal } from './discount';
import { SaleSubscribeUserModal } from './saleSubuser';
import { TransferModal } from './transfer';
import { SaleRenewUserModal } from './saleRenuser';

export const PlanModals = () => {
  const [pageState, setPageState] = useAtom(badgeAtom);

  const closeModal = () =>
    setPageState({
      ...pageState,
      isModalOpen: false,
      activeModal: null,
    });
  return (
    <Dialog open={pageState.isModalOpen} onClose={closeModal}>
      <div className="text-1 bg-2 p-6 rounded-md relative w-[600px]">
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
  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;

  if (activeModal) {

    if (activeModal.action == "editName") {
      return (
        <EditNameModal />
      );
    }
    else if (activeModal.action == "editDuration") {
      return (
        <EditDurationModal />
      );
    }
    else if (activeModal.action == "editPricingPrice") {
      return (
        <EditPricingPriceModal />
      )
    }
    else if (activeModal.action == "editPricingDate") {
      return (
        <EditPricingDateModal />
      )
    }
    else if (activeModal.action == "tokenIdAction") {
      return (
        <TokenIdActionModal />
      )
    }
    else if (activeModal.action == "discount") {
      return (
        <DiscountModal />
      )
    }
    else if (activeModal.action == "editToken") {
      return (
        <EditPricingTokenModal />
      );
    }
    else if ((activeModal.action == "subscribe") || (activeModal.action == "unsubscribe") || (activeModal.action == "renew") || (activeModal.action == "bulkSubscribe")) {
      return (
        <SubModal mode={activeModal.action} />
      );
    }

    else if ((activeModal.action == "subscribeUser") || (activeModal.action == "renewUser")) {
      return (
        <SubscribeUserModal renew={activeModal.action == "renewUser"} />
      );
    }

    else if ((activeModal.action == "saleSubscribe")) {
      return (
        <SaleSubscribeUserModal />
      );
    }

    else if ((activeModal.action == "saleRenew")) {
      return (
        <SaleRenewUserModal />
      );
    }

    else if ((activeModal.action == "transfer")) {
      return (
        <TransferModal />
      );
    }
  }

  return <div></div>;
}
