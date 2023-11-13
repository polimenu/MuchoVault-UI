import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useState } from 'react';
import Background from 'src/AppStyles';
import { useCountries, useLoginByEmail } from './Hooks/rampHooks';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { OnRampLogin } from './Components/login';
import { OnRampStatus } from './Components/status';

const Styles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const RampContext = React.createContext<{ sessionId: string }>(
  { sessionId: '' }
);

const OnRamp = ({ setSession }: { setSession: any }) => {
  const { sessionId } = useContext(RampContext);

  //User not logged in
  if (!sessionId)
    return <OnRampLogin setSession={setSession} />;
  else
    return <OnRampStatus />;
}

export const RampPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | On ramp";
  }, []);

  //sessionStorage.setItem("ramp_session_id", "");
  const sessionId = sessionStorage.getItem("ramp_session_id");
  const [session, setSession] = useState(sessionId);

  return (
    <>
      <RampContext.Provider value={{ sessionId: session }}>
        <Background>
          <Navbar hideAccount={true} />

          <div className="root w-[100vw]">
            <main className="content-drawer">
              <Styles>
                <Section
                  Heading={<div className={topStyles}>On Ramp</div>}
                  Cards={[]}
                  subHeading={<div className={descStyles}>TEST</div>}
                />

                <OnRamp setSession={setSession} />
              </Styles>
            </main>
          </div>
        </Background>
      </RampContext.Provider >
    </>
  );
};