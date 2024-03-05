import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { IMuchoTokenLauncherData, IMuchoTokenMarketData, indexAtom } from '../IndexAtom';
import { IndexBuyLaunchModal } from './buyLaunch';

export const IndexMarketModals = ({ data }: { data: IMuchoTokenMarketData }) => {
  const [pageState, setPageState] = useAtom(indexAtom);

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

function ModalChild({ data }: { data: IMuchoTokenMarketData }) {
  const [pageState] = useAtom(indexAtom);
  const activeModal = pageState.activeModal;


  if (!activeModal)
    return <div></div>;

  return (
    <IndexBuyLaunchModal />
  );
}
