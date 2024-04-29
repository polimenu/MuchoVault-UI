import styled from '@emotion/styled';
import { BlueBtn } from '@Views/Common/V2-Button';
import Background from 'src/AppStyles';
import { Navbar } from '@Views/Common/Navbar';
import { useTranslation } from 'react-i18next';


const EarnStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const HeaderStyled = styled.h1`-webkit-text-size-adjust: 100%;
line-height: normal;
border: 0 solid;
box-sizing: border-box;
font-feature-settings: "zero" 1!important;
font-family: Relative Mono,Relative Pro!important;
padding-top: 0;
font-size: 80px;
font-weight: 500;
margin: 6vw 0 0 0;
color: var(--text-1);`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full mb-5';

const btnHeroClasses = 'w-60 px-4 rounded-sm mt-5 mb-5';


export const FrontPage = () => {
  const { i18n, t } = useTranslation();

  const styleRotate = {
    transform: 'rotateX(10deg) rotateY(-6.42149deg)'
  }

  return (
    <Background>
      <Navbar hideAccount={true} />

      <div className="root w-[100vw]">
        <EarnStyles>
          <div className="body-bg">
            <div className="sc-jRQBWg MAibN">
              <div className="w-full pl-3 pr-5"></div>
              <div className="sc-dkPtRN edJbPX">
                <div className="full-width content-sbw main-wrapper persp">
                  <div className="hero-wrapper m-auto max-w-screen-sm text-center">
                    <HeaderStyled>
                      <div dangerouslySetInnerHTML={
                        { __html: t("frontpage.title") }} />
                    </HeaderStyled>
                    <div className="subtxt text-f18 text-2 mt-5 sm:text-f16">
                      {t("frontpage.description")}
                    </div>
                    <div className="h-7 overflow-hidden my-5">
                      <div className="animate-[roll-over_25s_ease-in-out_infinite]">
                        <div className="text-f18 text-1 font-bold">{t("frontpage.Earn USDC, WETH or WBTC with no Impermanent Loss")}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap justify-center items-stretch whitespace-nowrap" style={{ paddingLeft: "25%", paddingRight: "25%" }}>
                      <BlueBtn onClick={() => window.location.href = "/#/v2"} className={btnHeroClasses + " w-[365px]"}>{t("frontpage.Start Earning Yield")}</BlueBtn>
                    </div>
                  </div>
                  <div className="pp relative !mt-8 traa" id="hero-image" style={styleRotate}>
                    <img src="/muchoVaultHero.png" alt="hero image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EarnStyles >
      </div >
    </Background >
  );
};


const FrontService = ({ title, imageUrl, subtitle, cta, url }: { title: string, imageUrl: string, subtitle: string, cta: string, url: string }) => {
  return <div className={"service w-[255px] mb-[50px] m-auto"}>
    <img className='img-fact' src={imageUrl} alt={title} />
    <div className="content">
      <h2 className='text-[28px] mt-[10px] bold'>{title}</h2>
      <div className="subtxt text-f18 text-2 sm:text-f16 min-h-[60px]">{subtitle}</div>
      <BlueBtn onClick={() => { document.location = url }} className='mt-5 w-[50%]'>{cta}</BlueBtn>
    </div>
  </div>;
}

export const FrontPageNew = () => {
  const { i18n, t } = useTranslation();

  const styleRotate = {
    transform: 'rotateX(10deg) rotateY(-6.42149deg)'
  }

  return (
    <Background>
      <Navbar hideAccount={true} />

      <div className="root w-full">
        <EarnStyles>
          <div className="container">

            <div className="hero-wrapper max-w-screen-sm flex flex-wrap">
              <div className='w-[50%]'>
                <HeaderStyled>
                  <div dangerouslySetInnerHTML={
                    { __html: t("frontpage.title") }} />
                </HeaderStyled>
                <div className="subtxt text-[24px] text-2 mt-5 sm:text-f16">
                  {t("frontpage.description")}
                </div>
              </div>
              <div className='w-[40%] m-auto mt-[6vw]'>
                <img src='hero-removebg.png' alt='mucho finance' />
              </div>
            </div>

            <div className='facts-wrapper mt-[100px] flex flex-wrap m-auto w-full'>
              <FrontService title='OnRamp'
                subtitle='Mueve tus fondos entre FIAT y Crypto en pocos clicks.'
                cta='Empezar'
                url='/#/ramp'
                imageUrl='rampt-removebg-preview.png' />

              <FrontService title='Vaults'
                subtitle='Deposita y genera un 8-20% APR a largo plazo'
                cta='Depositar'
                url='/#/v2'
                imageUrl='vaults-removebg-preview.png' />

              <FrontService title='Index'
                subtitle='Indéxate a las estrategias DeFi más prometedoras.'
                cta='Indexar'
                url='/#/index'
                imageUrl='index-removebg-preview.png' />

              <FrontService title='Pools'
                subtitle='Las mejores estrategias de Liquidez Concentrada.'
                cta='Analizar'
                url='/#/pools'
                imageUrl='pools.webp' />
            </div>

          </div>
        </EarnStyles >
      </div >
    </Background >
  );
};
