import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";
import { Dispatch } from "react";
import { SetStateAction } from "jotai";

export const TextDropDown = ({ name,
    placeHolder,
    list,
    selected,
    setSelected,
    containerClass = "",
    bgClass = "",
    bufferClass = "",
}:
    {
        name: string,
        placeHolder: string,
        list: string[],
        selected: string,
        setSelected: Dispatch<SetStateAction<string>>,
        containerClass: string,
        bgClass: string,
        bufferClass: string
    }) => {
    if (!list)
        return <></>;

    list = ["all", ...list];

    //console.log("LIST", list);
    //console.log("selected ?? placeHolder", Boolean(selected), placeHolder, selected ?? placeHolder)

    return (
        <div className={containerClass}>
            <BufferDropdown
                rootClass="inline mt-5 !bg-2 mb-5 !y-auto w-[150px]"
                className={bufferClass}
                dropdownBox={(a, open, disabled) => (
                    <div
                        className={bgClass}
                    >
                        <div className="flex items-center">
                            {selected ? selected : placeHolder}
                        </div>
                        <DropdownArrow open={open} />
                    </div>
                )}
                items={list}
                item={(tab, handleClose, onChange, isActive, index) => {
                    //console.log("Drawing tab", tab);
                    return (
                        <div key={`${name}_${tab}`}
                            className={`text-f14 whitespace-nowrap ${index === list.length - 1 ? '' : 'pb-[6px]'
                                } ${index === 0 ? '' : 'pt-[6px]'} ${(selected === tab) ? 'text-1' : 'text-2'
                                }`}
                            onClick={() => setSelected(tab === "all" ? "" : tab)}
                        >
                            <div className="flex">
                                {tab}
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};