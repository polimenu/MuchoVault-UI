import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { badgeAtom } from '../badgeAtom';
import { EditModal } from './edit';
import { SubModal } from './sub';
import { SubscribeUserModal } from './subuser';

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
  const [pageState] = useAtom(badgeAtom);
  const activeModal = pageState.activeModal;

  if (activeModal) {

    if (activeModal.action == "edit") {
      return (
        <EditModal />
      );

    }
    else if (activeModal.action == "add") {
      return (
        <EditModal create={true} />
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
  }

  return <div></div>;
}
