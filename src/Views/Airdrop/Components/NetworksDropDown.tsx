import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";
import { MAIRDROP_FARM_NETWORKS } from "../Config/mAirdropConfig";

export const NetworksDropDown = ({ chain, setChain, defaultChain }: { chain: string; setChain: any, defaultChain: string }) => {
    const chains: string[] = MAIRDROP_FARM_NETWORKS;

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
                        {(chain ? chain : defaultChain)}
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
                            {(tab)}
                        </div>
                    </div>
                );
            }}
        />
    );
};