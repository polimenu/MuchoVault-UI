import { useMemo } from 'react';
import { getTabs } from 'src/Config/getTabs';
import { TabsDropdown } from './TabsDropDown';
import { Tab } from './Tab';
import { AccountDropdown } from './AccountDropdown';
import { MuchoFinanceLogoComponent } from './MuchoFinanceLogo'
import { LANGUAGES } from 'src/constants';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { LanguageDataAtom } from '../ModalLanguage';
/*import { activeMarketFromStorageAtom } from '@Views/BinaryOptions';*/


interface INavbar { }

export const Navbar: React.FC<INavbar> = ({ hideAccount }: { hideAccount: boolean }) => {
  const tabs = getTabs();
  const { t, i18n } = useTranslation();
  const [pageState, setPageState] = useAtom(LanguageDataAtom);
  const VISIBLETABS = 4;
  return (
    <header className="bg-primary flex justify-between w-full h-[45px] pr-[8px] header top-0 border-b-2 border-solid border-1 relative z-[102]">
      <div className=" flex items-center gap-[24px]">
        <div
          role={'button'}
          onClick={() => window.open('https://mucho.finance/', '_blank')}
        >
          {<MuchoFinanceLogoComponent
            className="h-[30px] ml-[8px] sm:mx-[2px]"
            hideText
          />}
        </div>

        <div className="tab:hidden flex gap-[6px] b1200:!hidden ">
          {tabs.slice(0, VISIBLETABS).map((tab, index) => {
            if (tab.isExternalLink) {
              return (
                <button
                  key={tab.name}
                  className={`font-normal text-4 text-f15  px-4 py-[4px] rounded-md hover:bg-1 hover:text-1 hover:brightness-125 transition-colors 
                 
                      : "hover:bg-1 hover:brightness-125"
                  `}
                  onClick={() => {
                    window.open(tab.to, '_blank');
                  }}
                >
                  {tab.name}
                </button>
              );
            }
            return <Tab tab={tab} key={tab.name} />;
          })}

          {tabs.length > VISIBLETABS && (
            <TabsDropdown tabs={tabs.slice(VISIBLETABS)} defaultName="More" />
          )}
        </div>
      </div>

      {/*<select defaultValue={"es"} onChange={(e) => {
        console.log("newlang", e.target.value);
        i18n.changeLanguage(e.target.value);
      }}>
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>*/}
      <div className="flex items-center gap-[7px] whitespace-nowrap">

        <img src={`/public/lang_${i18n.language}.png`} className='hover:bg-1 hover:text-1 hover:brightness-125 cursor-pointer mt-2' width={"20px"} height={"20px"} onClick={() => {
          setPageState({
            ...pageState,
            isModalOpen: true,
          });
        }} />

        {!hideAccount &&

          <div id="dropdown-box" className="flex gap-4 items-center text-1">
            {/* <ChainDropdown /> */}
            <AccountDropdown />
          </div>}




      </div>


    </header>
  );
};
