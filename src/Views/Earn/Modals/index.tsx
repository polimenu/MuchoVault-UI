import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { earnAtom } from '../earnAtom';
import { DepositModal } from './deposit';
import { erc20ABI } from 'wagmi';

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
  const poolInfo = activeModal.poolInfo;

  if (!activeModal)
    return <div></div>;

  return (
    <DepositModal
      inWallet={poolInfo.userAvailableInWallet}
      staked={Number(poolInfo.muchoTotalSupply) > 0 ? Number(poolInfo.userMuchoInWallet * poolInfo.totalStaked / poolInfo.muchoTotalSupply) : 0}
      head={(activeModal.deposit ? 'Deposit ' : 'Withdraw ') + activeModal.primaryToken}
      deposit={activeModal.deposit}
      tokenContract={{
        abi: erc20ABI,
        contract: poolInfo.lpToken,
      }}
      unit={activeModal.primaryToken}
      allowance={poolInfo.userAllowed}
      vaultId={activeModal.vaultId}
      decimals={activeModal.decimals}
      precision={activeModal.precision}
      muchoConversion={Number(poolInfo.totalStaked) > 0 ? Number(poolInfo.muchoTotalSupply / poolInfo.totalStaked) : 1}
    />
  );
}
