
import { useAtom } from "jotai";
import { rampDataAtom } from "../rampAtom";
import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { networkBeautify, tokenBeautify } from "../Utils";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";
import { ITokenChain } from "../Hooks/user";
import { useEffect, useRef } from "react";

export const TokensDropDown = ({ chain, setToken, token }: { chain: string; setToken: any; token: ITokenChain }) => {
    const [rampData] = useAtom(rampDataAtom);
    const firstLoad = useRef(true);
    useEffect(() => {
        if (!firstLoad.current) {
            setToken('');
            //console.log("resetting token");
        }
        else
            firstLoad.current = false
    }, [chain]);

    if (!chain)
        return <></>

    let tokens: ITokenChain[] = [];
    rampData.allowedCurrencies.forEach(c => {
        c.network_name.forEach(n => {
            if (n == chain)
                tokens.push({ token: c.currency_label, chain: n });
        })
    });

    //console.log("Tokens dropdown", tokens);

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
                        {tokenBeautify(token.token)}
                    </div>
                    <DropdownArrow open={open} />
                </div>
            )}
            items={tokens}
            item={(tab, handleClose, onChange, isActive, index) => {
                //console.log("Drawing tab", tab);
                return (
                    <div key={`token_${tab.token}_${tab.chain}`}
                        className={`${classes.itemFontSize} whitespace-nowrap ${index === tokens.length - 1 ? '' : 'pb-[6px]'
                            } ${index === 0 ? '' : 'pt-[6px]'} ${(token.token === tab.token && token.chain === tab.chain) ? 'text-1' : 'text-2'
                            }`}
                        onClick={() => setToken(tab)}
                    >
                        <div className="flex">
                            {tokenBeautify(tab.token)} ({networkBeautify(tab.chain)})
                        </div>
                    </div>
                );
            }}
        />
    );
};