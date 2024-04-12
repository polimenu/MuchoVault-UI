import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import Background from 'src/AppStyles';

const Styles = styled.div`
  width: 100%;
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const PoolsPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | Liquidity pools";
  }, []);


  const iframeLink = 'https://mango-moss-045ef401e.4.azurestaticapps.net/#';

  /*
  <script defer type='text/javascript'
    src='https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js'></script>*/
  return (
    <>
      <Background>
        <Navbar hideAccount={true} />

        <div className="root w-[100vw]">
          <main className="content-drawer">
            <Styles>
              <Section
                Heading={<div className={topStyles}>(mucho) Pools</div>}
                Cards={[]}
                subHeading={<div className={descStyles}>Top Liquidity Pools</div>}
              />
              <iframe id='iframe-widget' src={iframeLink} style={{ height: '80656px', width: '100%', border: 'none' }}></iframe>


            </Styles>
          </main>
        </div>
      </Background>
    </>
  );
};