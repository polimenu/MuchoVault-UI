import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { IMuchoVaultData, v2ContractDataAtom } from '../v2AdminAtom';
import { V2DepositModal } from './deposit';
import { V2SwapModal } from './swap';

export const V2AdminModals = ({ data }: { data: IMuchoVaultData }) => {
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
        {pageState.isModalOpen && <ModalChild data={data} />}
      </div>
    </Dialog>
  );
};

function ModalChild({ data }: { data: IMuchoVaultData }) {
  const [pageState] = useAtom(v2ContractDataAtom);
  const activeModal = pageState.activeModal;

  if (!activeModal)
    return <div></div>;

  if (activeModal.swap)
    return (<V2SwapModal dVaultId={null} data={data} />);

  return (
    <V2DepositModal head={activeModal.title} />
  );
}
