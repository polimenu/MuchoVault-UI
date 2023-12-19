import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";
import { tokenBeautify } from "../Utils";

export const OfframpTokensDropDown = ({ setToken, token, tokenList }: { setToken: any; token: { symbol: string, address: string, decimals: number }; tokenList: { symbol: string, address: string, decimals: number }[] }) => {

    const tokens = tokenList;
    //console.log("Tokens dropdown", tokens);

    //setToken(defaultToken);
    const classes = {
        fontSize: 'text-f15',
        itemFontSize: 'text-f14',
        verticalPadding: 'py-[6px]',
    };

    if (!tokens)
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
                        {tokenBeautify(token.symbol)}
                    </div>
                    <DropdownArrow open={open} />
                </div>
            )}
            items={tokens}
            item={(tab, handleClose, onChange, isActive, index) => {
                //console.log("Drawing tab", tab);
                return (
                    <div key={`token_${tab.symbol}`}
                        className={`${classes.itemFontSize} whitespace-nowrap ${index === tokens.length - 1 ? '' : 'pb-[6px]'
                            } ${index === 0 ? '' : 'pt-[6px]'} ${(token.symbol === tab.symbol) ? 'text-1' : 'text-2'
                            }`}
                        onClick={() => setToken(tab)}
                    >
                        <div className="flex">
                            {tokenBeautify(tab.symbol)}
                        </div>
                    </div>
                );
            }}
        />
    );
};