import { useMemo } from 'react';
import { getTabs } from 'src/Config/getTabs';
import { TabsDropdown } from './TabsDropDown';
import { Tab } from './Tab';
import { AccountDropdown } from './AccountDropdown';
import { MuchoFinanceLogoComponent } from './MuchoFinanceLogo'
/*import { activeMarketFromStorageAtom } from '@Views/BinaryOptions';*/


interface INavbar { }

export const Navbar: React.FC<INavbar> = () => {
  const tabs = getTabs();
  const VISIBLETABS = 2;
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

      <div className="flex items-center gap-[7px] whitespace-nowrap">

        <div id="dropdown-box" className="flex gap-4 items-center text-1">
          {/* <ChainDropdown /> */}
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
};
