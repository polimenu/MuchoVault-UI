
import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";
import { t } from "i18next";

export const CorpTypeDropDown = ({ setCorpType, corpType }: { setCorpType: any; corpType: string }) => {
    const defaultCorpType = "LIMITED_LIABILITY";
    const sources = ["LIMITED_LIABILITY", "SOLE_TRADER", "PARTNERSHIP", "PUBLIC_LIMITED_COMPANY", "JOINT_STOCK_COMPANY", "CHARITY", "DECENTRALISED_AUTONOMOUS_ORGANISATION"];
    //setCountry(defaultCountry);
    const classes = {
        fontSize: 'text-f15',
        itemFontSize: 'text-f14',
        verticalPadding: 'py-[6px]',
    };

    return (
        <BufferDropdown
            rootClass="w-fit inline mt-5 mb-5 !y-auto"
            className="py-4 px-4 bg-2 h-[10vw] !y-auto"
            dropdownBox={(a, open, disabled) => (
                <div
                    className={`flex items-center justify-between ${classes.fontSize} font-medium bg-[#2c2c41] pl-3 pr-[0] ${classes.verticalPadding} rounded-sm text-1`}
                >
                    <div className="flex items-center">
                        {t("ramp." + corpType)}
                    </div>
                    <DropdownArrow open={open} />
                </div>
            )}
            items={sources}
            item={(tab, handleClose, onChange, isActive, index) => {
                return (
                    <div key={`corpType_${tab}`}
                        className={`${classes.itemFontSize} whitespace-nowrap ${index === sources.length - 1 ? '' : 'pb-[6px]'
                            } ${index === 0 ? '' : 'pt-[6px]'} ${corpType === tab ? 'text-1' : 'text-2'
                            }`}
                        onClick={() => setCorpType(tab)}
                    >
                        <div className="flex">
                            {t("ramp." + tab)}
                        </div>
                    </div>
                );
            }}
        />
    );
};