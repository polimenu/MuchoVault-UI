import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";
import { Dispatch } from "react";
import { SetStateAction } from "jotai";

export const TextMultipleDropDown = ({ name,
    placeHolder,
    list,
    selected,
    toggleSelected,
    containerClass = "",
    bgClass = "",
    bufferClass = "",
}:
    {
        name: string,
        placeHolder: string,
        list: string[],
        selected: string[],
        toggleSelected: Dispatch<SetStateAction<string[]>>,
        containerClass: string,
        bgClass: string,
        bufferClass: string
    }) => {
    if (!list)
        return <></>;

    list = ["all", ...list.sort((a, b) => selected.indexOf(b) - selected.indexOf(a))];

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
                            {selected.length > 0 ? (selected.length > 1 ? `${placeHolder} (${selected.length})` : selected[0]) : placeHolder}
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
                            onClick={() => {
                                const index = selected.indexOf(tab);
                                let newList = selected;
                                if (tab == "all") {
                                    newList = [];
                                }
                                else if (index >= 0) {
                                    newList = newList.filter((v, i) => i != index);
                                }
                                else {
                                    newList.push(tab);
                                }
                                toggleSelected(newList)
                            }}
                        >
                            <div className="flex">
                                {tab != "all" && <input type="checkbox" readOnly={true} checked={selected.find(s => s == tab)?.length > 0} />}
                                &nbsp;{tab}
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};