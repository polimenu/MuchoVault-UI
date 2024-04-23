
import { useAtom } from "jotai";
import { rampDataAtom } from "../rampAtom";
import { BufferDropdown } from "@Views/Common/Buffer-Dropdown";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow";

export const CountriesDropDown = ({ setCountry, country }: { setCountry: any; country: { country_code: string, country_name: string } }) => {
    const [rampData] = useAtom(rampDataAtom);
    const countries = rampData.allowedCountries;
    const defaultCountry = { country_code: "ES", country_name: "Spain" };
    //setCountry(defaultCountry);
    const classes = {
        fontSize: 'text-f15',
        itemFontSize: 'text-f14',
        verticalPadding: 'py-[6px]',
    };

    if (!countries)
        return <></>;

    return (
        <BufferDropdown
            rootClass="w-fit inline mt-5 mb-5 !y-auto"
            className="py-4 px-4 bg-2 h-[300px] !y-auto"
            dropdownBox={(a, open, disabled) => (
                <div
                    className={`flex items-center justify-between ${classes.fontSize} font-medium bg-[#2c2c41] pl-3 pr-[0] ${classes.verticalPadding} rounded-sm text-1`}
                >
                    <div className="flex items-center">
                        {country.country_name}
                    </div>
                    <DropdownArrow open={open} />
                </div>
            )}
            items={countries}
            item={(tab, handleClose, onChange, isActive, index) => {
                return (
                    <div key={`country_${tab.country_code}`}
                        className={`${classes.itemFontSize} whitespace-nowrap ${index === countries.length - 1 ? '' : 'pb-[6px]'
                            } ${index === 0 ? '' : 'pt-[6px]'} ${defaultCountry.country_name === tab.country_name ? 'text-1' : 'text-2'
                            }`}
                        onClick={() => setCountry(tab)}
                    >
                        <div className="flex">
                            {tab.country_name}
                        </div>
                    </div>
                );
            }}
        />
    );
};