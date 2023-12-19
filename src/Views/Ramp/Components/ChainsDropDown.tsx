import { useAtom } from "jotai";
import { rampAtom, rampDataAtom } from "../rampAtom";
import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { networkBeautify } from "../Utils";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";

export const ChainsDropDown = ({ chain, setChain, defaultChain }: { chain: string; setChain: any, defaultChain: string }) => {
    const [rampData] = useAtom(rampDataAtom);
    const [pageState] = useAtom(rampAtom);
    let chains: string[] = [];
    rampData.allowedCurrencies.forEach(c => {
        c.network_name.forEach(n => {
            if (chains.indexOf(n) < 0)
                chains.push(n);
        })
    });

    const classes = {
        fontSize: 'text-f15',
        itemFontSize: 'text-f14',
        verticalPadding: 'py-[6px]',
    };

    if (!chains)
        return <></>;

    return (
        <BufferDropdown
            rootClass="w-fit inline mt-5 mb-5 !y-auto"
            className="py-4 px-4 bg-2 h-[10vw] !y-auto"
            dropdownBox={(a, open, disabled) => (
                <div
                    className={`flex items-center justify-between ${classes.fontSize} font-medium bg-[#2c2c41] pl-3 pr-[0] ${classes.verticalPadding} rounded-sm text-1`}
                >
                    <div className="flex items-center">
                        {networkBeautify(chain ? chain : defaultChain)}
                    </div>
                    <DropdownArrow open={open} />
                </div>
            )}
            items={chains}
            item={(tab, handleClose, onChange, isActive, index) => {
                //console.log("Drawing tab", tab);
                return (
                    <div key={`chain_${tab}`}
                        className={`${classes.itemFontSize} whitespace-nowrap ${index === chains.length - 1 ? '' : 'pb-[6px]'
                            } ${index === 0 ? '' : 'pt-[6px]'} ${(defaultChain === tab) ? 'text-1' : 'text-2'
                            }`}
                        onClick={() => setChain(tab)}
                    >
                        <div className="flex">
                            {networkBeautify(tab)}
                        </div>
                    </div>
                );
            }}
        />
    );
};