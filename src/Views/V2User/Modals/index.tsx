import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { v2ContractDataAtom } from '../v2AdminAtom';
import { V2DepositModal } from './deposit';

export const V2AdminModals = () => {
  const [pageState, setPageState] = useAtom(v2ContractDataAtom);

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
  const [pageState] = useAtom(v2ContractDataAtom);
  const activeModal = pageState.activeModal;

  if (!activeModal)
    return <div></div>;

  return (
    <V2DepositModal head={activeModal.title} />
  );
}
