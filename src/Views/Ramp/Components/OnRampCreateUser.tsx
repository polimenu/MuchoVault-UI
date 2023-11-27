import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import { ERampStatus, rampAtom, rampDataAtom } from '../rampAtom';


export const OnRampCreateUser = () => {
  const { state } = useGlobal();
  const [rampState, setRampState] = useAtom(rampAtom);

  if (rampState.loginStatus == ERampStatus.NOT_LOGGED) {
    return <div className='w-[46rem] m-auto mt-5'>
      <BlueBtn
        onClick={() => { setRampState({ ...rampState, isModalOpen: true, activeModal: "NEWUSER" }) }}
        className="rounded mt-5"
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1}
      >
        Create New User
      </BlueBtn>
    </div>
      ;
  }

  return <></>;
}
