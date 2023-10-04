import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { earnAtom } from '../earnAtom';
import { DepositModal } from './deposit';
import { MigrateModal } from './migrate';

export const EarnModals = () => {
  const [pageState, setPageState] = useAtom(earnAtom);

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
  const [pageState] = useAtom(earnAtom);
  const activeModal = pageState.activeModal;

  if (!activeModal)
    return <div></div>;

  if (activeModal.migrate)
    return (
      <MigrateModal head={'Migrate ' + activeModal.primaryToken + ' to V2'} />
    );

  return (
    <DepositModal
      head={(activeModal.deposit ? 'Deposit ' : 'Withdraw ') + activeModal.primaryToken}
    />
  );
}
