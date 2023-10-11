import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import EarnIcon from 'src/SVG/Elements/EarnIcon';
//import FrontArrow from 'src/SVG/frontArrow';
// import { HeadTitle } from 'Views/Common/TitleHead';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getEarnCards } from './Components/EarnCards';
import { Section } from '../Common/Card/Section';
import { IEarn, writeEarnData } from './earnAtom';
import { useGetTokenomics } from './Hooks/useTokenomicsMulticall';
import { EarnModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  ArbitrumOnly,
} from '@Views/Common/ChainNotSupported';
import MuchoWhite from '@SVG/Elements/MuchoWhite';
import ErrorIcon from '@SVG/Elements/ErrorIcon';
import { AlignHorizontalCenter } from '@mui/icons-material';
import { BlueBtn } from '@Views/Common/V2-Button';
import { btnClasses } from '@Views/Earn/Components/EarnButtons';

const EarnStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const HeaderStyled = styled.h1`-webkit-text-size-adjust: 100%;
tab-size: 4;
--bg-1: #000;
--bg-2: #18191d;
--bg-3: #23262f;
--bg-4: #2f3241;
--bg-5: #34384c;
--bg-6: #34384c;
--bg-7: #323642;
--bg-8: #242731;
--bg-9: #101724;
--shadow: var(--bg-9);
--bg-10: #9757d7;
--bg-11: #ef466f;
--bg-12: #45b26b;
--bg-13: #22232b;
--bg-14: #353945;
--bg-15: var(--bg-8);
--bg-16: rgba(14,16,20,0.3);
--text-5: #fcfcfd;
--text-4: #5d6588;
--text-3: #777e90;
--text-2: #a5adcf;
--red: #fa2256;
--green: #11cabe;
--text-6: #808191;
--text-1: #fff;
--primary: #3772ff;
--social-text: var(--text-1);
--social-shadow: #2aaecce7;
--feature-0: var(--bg-6);
--feature-1: var(--bg-6);
--feature-2: var(--bg-6);
--feature-3: var(--bg-6);
--feature-4: var(--bg-6);
--zer0: 0;
--sxxx: 0.4rem;
--sxx: 0.6rem;
--sx: 0.8rem;
--s: 1rem;
--xs: 1.2rem;
--xxs: 1.4rem;
--xxxs: 1.6rem;
--mxx: 1.6rem;
--mx: 1.8rem;
--m: 2rem;
--xm: 2.2rem;
--xxm: 2.4rem;
--xxxm: 2.6rem;
--l: 3rem;
--xl: 3.2rem;
--xxl: 3.4rem;
--xxxl: 3.6rem;
--b: 4rem;
--xb: 4.2rem;
--xxb: 4.4rem;
--xxxb: 4.6rem;
--v: 6rem;
--z: 10rem;
--zoom: 300ms cubic-bezier(0.32,0.6,0.35,0.85);
line-height: inherit;
text-align: center;
border: 0 solid;
--tw-border-spacing-x: 0;
--tw-border-spacing-y: 0;
--tw-translate-x: 0;
--tw-translate-y: 0;
--tw-rotate: 0;
--tw-skew-x: 0;
--tw-skew-y: 0;
--tw-scale-x: 1;
--tw-scale-y: 1;
--tw-pan-x: ;
--tw-pan-y: ;
--tw-pinch-zoom: ;
--tw-scroll-snap-strictness: proximity;
--tw-ordinal: ;
--tw-slashed-zero: ;
--tw-numeric-figure: ;
--tw-numeric-spacing: ;
--tw-numeric-fraction: ;
--tw-ring-inset: ;
--tw-ring-offset-width: 0px;
--tw-ring-offset-color: #fff;
--tw-ring-color: rgb(59 130 246/0.5);
--tw-ring-offset-shadow: 0 0 #0000;
--tw-ring-shadow: 0 0 #0000;
--tw-shadow: 0 0 #0000;
--tw-shadow-colored: 0 0 #0000;
--tw-blur: ;
--tw-brightness: ;
--tw-contrast: ;
--tw-grayscale: ;
--tw-hue-rotate: ;
--tw-invert: ;
--tw-saturate: ;
--tw-sepia: ;
--tw-drop-shadow: ;
--tw-backdrop-blur: ;
--tw-backdrop-brightness: ;
--tw-backdrop-contrast: ;
--tw-backdrop-grayscale: ;
--tw-backdrop-hue-rotate: ;
--tw-backdrop-invert: ;
--tw-backdrop-opacity: ;
--tw-backdrop-saturate: ;
--tw-backdrop-sepia: ;
box-sizing: border-box;
font-feature-settings: "zero" 1!important;
font-family: Relative Mono,Relative Pro!important;
padding-top: 0;
font-size: 4.5vw;
font-weight: 500;
margin: 6vw 0 0 0;
color: var(--text-1);`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full mb-5';

const btnHeroClasses = 'w-60 px-4 rounded-sm mt-5 mb-5';


export const FrontPage = () => {

  const styleRotate = {
    transform: 'rotateX(10deg) rotateY(-6.42149deg)'
  }

  return (
    <EarnStyles>
      <div className="body-bg">
        <div className="sc-jRQBWg MAibN">
          <div className="w-full pl-3 pr-5"></div>
          <div className="sc-dkPtRN edJbPX">
            <div className="full-width content-sbw main-wrapper persp">
              <div className="hero-wrapper m-auto max-w-screen-sm text-center">
                <HeaderStyled>Your Gateway to Earning <span style={{ color: "#3B82F6" }} >(mucho)</span> Profits</HeaderStyled>
                <div className="subtxt text-f18 text-2 mt-5 sm:text-f16">Our mission is to empower you to grow your wealth through secure and profitable investments. With Mucho Vault, you can deposit your tokens, and we'll take care of the rest, maximizing your earnings.
                </div>
                <div className="h-7 overflow-hidden my-5">
                  <div className="animate-[roll-over_25s_ease-in-out_infinite]">
                    <div className="text-f18 text-1 font-bold">Earn USDC, WETH or WBTC with no Impermanent Loss</div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap justify-center items-stretch whitespace-nowrap" style={{ paddingLeft: "25%", paddingRight: "25%" }}>
                  <BlueBtn onClick={() => window.location.href = "/#/v2"} className={btnHeroClasses + " w-[365px]"}>Start Earning Yield (V2)</BlueBtn>
                </div>
                <div className="flex gap-3 flex-wrap justify-center items-stretch whitespace-nowrap">
                  <a className='text-f14 underline mt-5' href='/#/v1'>Go to vaults v1</a>
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
  );
};
