import styled from '@emotion/styled';
import { useContext, useEffect } from 'react';
import Drawer from '@Views/Common/V2-Drawer';
import { Section } from '../Common/Card/Section';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import EarnIcon from '@SVG/Elements/EarnIcon';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { ViewContext } from '.';
import assignation from "./Config/assignation.json";
import { useUserAccount } from '@Hooks/useUserAccount';
import { useNetwork } from 'wagmi';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { TableAligner } from '@Views/Common/TableAligner';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Common/Card/Card';

const Styles = styled.div`
  width: min(1200px, 100%);
  margin: 50px auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';
const noteStyles = 'w-[46rem] text-center m-auto tab:w-full font-weight:bold mt-5 mb-5';


const ViewContextProvider = ViewContext.Provider;



export const AirdropCheckPage = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = "(mucho) finance | airdrop";
  }, []);
  return (
    <Background>
      <Navbar />

      <div className="root w-[100vw]">
        <ArbitrumOnly>
          <ViewContextProvider value={{ activeChain }}>

            <AirdropCheckUserPage />

          </ViewContextProvider>
        </ArbitrumOnly>
      </div>

    </Background>
  );
};

const AirdropCheckUserPage = () => {

  return (
    <Styles>
      <Section
        Heading={<div className={topStyles}>
          <EarnIcon className="mr-3" /><MuchoWhite width={120} />
          &nbsp;Airdrop Elegibility Checker</div>}
        subHeading={<><div className={descStyles}>Conecta tu wallet para comprobar si eres elegible para el airdrop "{assignation.airdropName}"</div></>}
        className='mt-[100px]'
        other={<CheckAirdropBox />}
      />
    </Styles>
  );
};

const CheckAirdropBox = () => {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(ViewContext);
  const { chain } = useNetwork();
  const btnClasses = '!w-fit px-4 rounded-sm !h-7 m-auto';
  const keyClasses = '!text-f15 !text-2 !text-left !py-[6px] !pl-[0px]';
  const valueClasses = '!text-f15 text-1 !text-right !py-[6px] !pr-[0px]';
  const wrapperClasses = 'flex justify-end flex-wrap';

  if (!account || activeChain.id !== chain?.id) {
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );
  }

  const allocation = assignation.assignation.find(a => a.address?.toLowerCase() == account.toLowerCase());
  const total = allocation ? allocation.assignations.map(a => a.assignation).reduce((p, c) => p + c) : 0;



  if (!allocation || total <= 0) {
    return <div className='text-f16 m-auto flex content-center mt-[30px]'>Lo sentimos, no tienes asignación de {assignation.tokenName} en este airdrop.</div>
  }
  else {
    return <Card
      className='m-auto max-w-[500px]'
      top={<div className='flex-item'>¡Enhorabuena! tu asignación total es de <b>{total} {assignation.tokenName}:</b></div>}
      middle={<TableAligner
        keysName={
          allocation.assignations.map(a => a.name)
        }
        values={
          allocation.assignations.map(a => <div className={`${wrapperClasses}`}>

            <Display
              className="!justify-end"
              data={a.assignation}
              unit={assignation.tokenName}
              precision={2}
            />
          </div>)

        }
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />}
    />
  }


}