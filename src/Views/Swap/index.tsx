import { Section } from '@Views/Common/Card/Section';
import { Navbar } from '@Views/Common/Navbar';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Background from 'src/AppStyles';
import { LANGUAGES } from 'src/constants';

const Styles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const SwapPage = () => {
  useEffect(() => {
    document.title = "(mucho) finance | Cross-chain swap";
  }, []);

  const { i18n, t } = useTranslation();

  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", 'https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js');
    head.appendChild(script);

    return () => {
      head.removeChild(script);
    };
  }, []);

  const locale = LANGUAGES.find(l => l.code == i18n.language)?.swapLocale;

  const iframeLink = `https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=true&amount=100&amountFiat&backgroundColor=ffff&darkMode=false&from=usdcarb&horizontal=false&isFiat=false&lang=${locale}&link_id=974fa688a3baba&locales=true&logo=false&primaryColor=3772FF&to=eth&toTheMoon=false`;

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
                Heading={<div className={topStyles}>(mucho) Swap</div>}
                Cards={[]}
                subHeading={<div className={descStyles}>{t("swap.hero")}</div>}
              />
              <iframe id='iframe-widget' src={iframeLink} style={{ height: '356px', width: '100%', border: 'none' }}></iframe>


            </Styles>
          </main>
        </div>
      </Background>
    </>
  );
};