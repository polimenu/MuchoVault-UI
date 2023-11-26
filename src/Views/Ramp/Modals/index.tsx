import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { rampAtom, rampDataAtom } from '../rampAtom';
import BufferInput from '@Views/Common/BufferInput';
import { useEffect, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { underLineClass } from '../Components/OnRampStatus';
import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import { DropdownArrow } from '@SVG/Elements/DropDownArrow';
import { ITokenChain, usePatchAddress, usePatchTokenPref } from '../Hooks/user';
import { IKYCRequest, useCreateKYC } from '../Hooks/kyc';
import snsWebSdk from '@sumsub/websdk';

export const RampModals = () => {
    const [pageState, setPageState] = useAtom(rampAtom);

    const closeModal = () =>
        setPageState({
            ...pageState,
            isModalOpen: false,
            activeModal: "",
        });
    return (
        <Dialog open={pageState.isModalOpen} onClose={closeModal} className='w-full'>
            <div className="text-1 bg-2 p-6 rounded-md relative w-full">
                <IconButton
                    className="!absolute text-1 top-[20px] right-[20px]"
                    onClick={closeModal}
                >
                    <CloseOutlined />
                </IconButton>
                {pageState.isModalOpen && <ModalChild />}
            </div>
        </Dialog>
    );
};

function ModalChild() {
    const [pageState, setPageState] = useAtom(rampAtom);
    const activeModal = pageState.activeModal;


    if (!activeModal)
        return <div>No modal</div>;

    if (activeModal == "TARGET_ADDRESS")
        return <TargetAddressModal />;

    if (activeModal == "ONRAMP_PREF")
        return <TargetTokenModal />;

    if (activeModal == "KYC")
        return <CreateKYCModal />;


    return <div>{activeModal}</div>;
}

function TargetAddressModal() {
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const currentAddress = pageState.auxModalData && pageState.auxModalData.currentAddress ? pageState.auxModalData.currentAddress : "";
    const [val, setVal] = useState(currentAddress);
    const [addr, setAddr] = useState('');
    const { state } = useGlobal();
    const [isPatched] = usePatchAddress(pageState.sessionId, addr);
    if (isPatched) {
        window.location.reload();
    }
    return (
        <>
            <div>
                <div className="text-f15 mb-5">Change target address</div>
                <BufferInput
                    placeholder={"Enter your new address"}
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={val}
                    onChange={(val) => {
                        setVal(val);
                    }}
                />
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setAddr(val); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    Change address
                </BlueBtn>
            </div>
        </>
    );
}

function TargetTokenModal() {
    const [pageState, setPageState] = useAtom(rampAtom);
    const [rampData, setRampData] = useAtom(rampDataAtom);
    const current = rampData.tokenPreferences ? rampData.tokenPreferences.find(t => t.currency == pageState.auxModalData.currency) : null;
    const defaultToken = current ? { token: current.token, chain: current.chain } : { token: "", chain: "" };
    const [chain, setChain] = useState(defaultToken.chain);
    const [token, setToken] = useState<ITokenChain>({ token: '', chain: '' });
    const [tokenChain, setTokenChain] = useState<ITokenChain>({ token: '', chain: '' });
    const [isPatched] = usePatchTokenPref(pageState.sessionId, pageState.auxModalData.currency, tokenChain);

    useEffect(() => {
        if (isPatched) {
            window.location.reload();
            //setPageState({ ...pageState, isModalOpen: false, activeModal: "", auxModalData: null })
        }
    }, [isPatched]);

    return (
        <>
            <div className='mr-5'>
                <div className="text-f15 mb-5 mr-5">Select {pageState.auxModalData.currency} target token:</div>
                <div className="text-f12 mb-5 mr-5">Chain:
                    <ChainsDropDown setChain={setChain} chain={chain} />
                </div>
                <div className="text-f12 mb-5 mr-5">Token:
                    <TokensDropDown chain={chain} setToken={setToken} token={token} />
                </div>
                <div className="text-f15 mb-5 mr-5">&nbsp;</div>
                <div className="text-f15 mb-5 mr-5 m-auto"><BlueBtn onClick={() => { setTokenChain(token) }} >Change</BlueBtn></div>
            </div>
        </>
    );
}



function CreateKYCModal() {
    const [pageState] = useAtom(rampAtom);
    const [address_line_1, setAddr1] = useState('');
    const [address_line_2, setAddr2] = useState('');
    const [post_code, setPC] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState({ country_code: "ES", country_name: "Spain" });
    const [date_of_birth, setDob] = useState('');
    const [source_of_funds, setSof] = useState('SALARY');
    const [kycReq, setKycReq] = useState<IKYCRequest>();

    const { state } = useGlobal();
    const [isDone] = useCreateKYC(pageState.sessionId, kycReq);
    if (isDone) {
        window.location.reload();
    }
    return (
        <>
            <div className="text-f14">
                <div className="text-f15 mb-5">Enter your data:</div>
                <span>Address:</span>
                <BufferInput placeholder={"Line 1"} bgClass="!bg-1" ipClass="mt-1" value={address_line_1} onChange={(val) => { setAddr1(val); }} />
                <BufferInput placeholder={"Line 2"} bgClass="!bg-1" ipClass="mt-1" value={address_line_2} onChange={(val) => { setAddr2(val); }} />
                <div className='mt-5'>Source of funds:</div>
                <SofDropDown setSof={setSof} sof={source_of_funds} />
                <div className='mt-5'>Country:</div>
                <CountriesDropDown setCountry={setCountry} country={country} />
                <div className='mt-5'>Postal Code:</div>
                <BufferInput placeholder={"Postal code"} bgClass="!bg-1" ipClass="mt-1" value={post_code} onChange={(val) => { setPC(val); }} />
                <div className='mt-5'>City:</div>
                <BufferInput placeholder={"City"} bgClass="!bg-1" ipClass="mt-1" value={city} onChange={(val) => { setCity(val); }} />
                <div className='mt-5'>Date of birth:</div>
                <BufferInput placeholder={"YYYY-MM-DD"} bgClass="!bg-1" ipClass="mt-1" value={date_of_birth} onChange={(val) => { setDob(val); }} />
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setKycReq({ address_line_1, address_line_2, post_code, city, country: country.country_code, date_of_birth, source_of_funds }); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    Start KYC
                </BlueBtn>
            </div>
        </>
    );
}


const ChainsDropDown = ({ chain, setChain }: { chain: string; setChain: any }) => {
    const [rampData] = useAtom(rampDataAtom);
    const [pageState] = useAtom(rampAtom);
    let chains: string[] = [];
    rampData.allowedCurrencies.forEach(c => {
        c.network_name.forEach(n => {
            if (chains.indexOf(n) < 0)
                chains.push(n);
        })
    });


    console.log("Chains dropdown", chains);
    const current = rampData.tokenPreferences ? rampData.tokenPreferences.find(t => t.currency == pageState.auxModalData.currency) : null;
    const defaultChain = current ? current.chain : "";
    //setToken(defaultToken);

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

export const networkBeautify = (network: string): string => {
    if (network == "mainnet")
        return "Ethereum";

    return network.charAt(0).toUpperCase() + network.slice(1);
}

export const tokenBeautify = (token: string): string => {
    if (token == "usdce")
        return "USDC.e";

    if (token.toLowerCase() == token)
        return token.toUpperCase();

    return token;
}

const TokensDropDown = ({ chain, setToken, token }: { chain: string; setToken: any; token: ITokenChain }) => {
    const [rampData] = useAtom(rampDataAtom);

    if (!chain)
        return <></>

    let tokens: ITokenChain[] = [];
    rampData.allowedCurrencies.forEach(c => {
        c.network_name.forEach(n => {
            if (n == chain)
                tokens.push({ token: c.currency_label, chain: n });
        })
    });


    console.log("Tokens dropdown", tokens);
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
                        {token.token ? `${tokenBeautify(token.token)} (${networkBeautify(token.chain)})` : ''}
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


const CountriesDropDown = ({ setCountry, country }: { setCountry: any; country: { country_code: string, country_name: string } }) => {
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
            className="py-4 px-4 bg-2 h-[10vw] !y-auto"
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



const SofDropDown = ({ setSof, sof }: { setSof: any; sof: string }) => {
    const defaultSof = "SALARY";
    const sources = ["SALARY", "BUSINESS_INCOME", "PENSION", "OTHER"];
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
                        {sof}
                    </div>
                    <DropdownArrow open={open} />
                </div>
            )}
            items={sources}
            item={(tab, handleClose, onChange, isActive, index) => {
                return (
                    <div key={`sof_${tab}`}
                        className={`${classes.itemFontSize} whitespace-nowrap ${index === sources.length - 1 ? '' : 'pb-[6px]'
                            } ${index === 0 ? '' : 'pt-[6px]'} ${defaultSof === tab ? 'text-1' : 'text-2'
                            }`}
                        onClick={() => setSof(tab)}
                    >
                        <div className="flex">
                            {tab}
                        </div>
                    </div>
                );
            }}
        />
    );
};
