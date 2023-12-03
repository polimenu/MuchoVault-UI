import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import { rampAtom, rampDataAtom } from '../rampAtom';
import BufferInput from '@Views/Common/BufferInput';
import { useEffect, useRef, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useGlobal } from '@Contexts/Global';
import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import { DropdownArrow } from '@SVG/Elements/DropDownArrow';
import { INewUserRequest, ITokenChain, useAddAccount, useCreateUser, usePatchAddress, usePatchTokenPref, useSetMainBankAccount } from '../Hooks/user';
import { IKYCRequest, useCreateKYC } from '../Hooks/kyc';
import { networkBeautify, tokenBeautify } from '../Utils';
import { useToast } from '@Contexts/Toast';
import { useGetOnRampQuote, useOnRampAccounts } from '../Hooks/onramp';
import { RAMP_CONFIG } from '../Config/rampConfig';
import { useGetAmountInWallet, useGetOffRampQuote, useOffRampWallet, useSendToken } from '../Hooks/offramp';
import { useActiveChain } from '@Hooks/useActiveChain';
import { t } from 'i18next';
import { Display } from '@Views/Common/Tooltips/Display';

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
        return <CompleteKYCModal />;

    if (activeModal == "NEWUSER")
        return <NewUserModal />;

    if (activeModal == "BANK_MAIN")
        return <BankMainModal />;

    if (activeModal == "BANK_ADD")
        return <BankAddModal />;

    if (activeModal == "ONRAMP")
        return <OnRampModal />;

    if (activeModal == "OFFRAMP")
        return <OffRampModal />;

    return <div>{activeModal}</div>;
}

function TargetAddressModal() {
    const [pageState] = useAtom(rampAtom);
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


function OnRampModal() {
    const [val, setVal] = useState("");
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const { state } = useGlobal();
    const { currency } = pageState.auxModalData;
    const [inputAccount] = useOnRampAccounts(pageState.sessionId, currency);
    const [visibleAccount, setVisibleAccount] = useState(false);

    if (!rampData.tokenPreferences)
        return <></>;

    const { chain, token } = rampData.tokenPreferences.find(tp => tp.currency == currency);
    const [quote] = useGetOnRampQuote(currency, token, val);

    return (
        <div>
            <div hidden={visibleAccount}>
                <div className="text-f15 mb-5">Enter {currency} amount:</div>
                <BufferInput

                    numericValidations={{
                        decimals: { val: 6 },
                        min: { val: '0', error: 'Enter a positive value' },
                    }}
                    placeholder="0.0"
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={val}
                    onChange={(val) => {
                        setVal(val);
                    }}
                    unit={
                        <span className="text-f16 flex justify-between w-fit">
                            {currency}
                        </span>
                    }
                />
                <div className="text-f15">&nbsp;</div>
                <div className="text-f15 mt-5 mb-5">Estimated return amount:</div>
                <BufferInput
                    placeholder="0.0"
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    isDisabled={true}
                    value={quote}
                    onChange={() => { }}
                    unit={
                        <span className="text-f16 flex justify-between w-fit">
                            {tokenBeautify(token)} ({networkBeautify(chain)})
                        </span>
                    }
                />
                <div className="flex whitespace-nowrap mt-5">
                    <BlueBtn
                        onClick={() => { setVisibleAccount(true); }}
                        className="mr-4 rounded"
                        isLoading={state.txnLoading === 1}
                        isDisabled={val <= 0}

                    >
                        Convert to {tokenBeautify(token)} ({networkBeautify(chain)})
                    </BlueBtn>
                </div>
            </div>
            <div className="mt-5" hidden={!visibleAccount}>
                {inputAccount && <>
                    <div className="flex whitespace-nowrap mt-5 text-f18 strong">Next step:</div>
                    <div className="flex mt-5 text-f16">Transfer {val} {currency} to the next account and your transaction will be processed shortly. </div>
                    <div className="green mt-5 ml-5 text-f16">
                        <ul>
                            <li>IBAN: {inputAccount.iban}</li>
                            <li>BIC: {inputAccount.bic}</li>
                            <li>Country: {inputAccount.bank_country}</li>
                        </ul>
                    </div>
                    <div className="flex mt-5 text-f14">
                        Note: we cannot guarantee exact exchange amount, due to fluctuations the stablecoin price may have.</div>
                </>}
                {!inputAccount && <>
                    <div className="flex whitespace-nowrap mt-5 text-f18 strong">No bank account</div>
                    <div className="flex mt-5 text-f16">Sorry, we could not generate a bank account for your onramping. Maybe fiinishing your KYC is needed. Please contact us for more help. </div>
                </>}
            </div>
        </div >
    );
}

//ToDo softcode chain
function OffRampModal() {
    const [rampState] = useAtom(rampAtom);
    const [val, setVal] = useState("");
    const { state } = useGlobal();
    const currency = RAMP_CONFIG.AllowedFiatCurrencies[0];
    const tokenList = RAMP_CONFIG.AllowedOffRampTokens;
    const [token, setToken] = useState(tokenList[0]);
    const [quote] = useGetOffRampQuote(token.symbol, currency, val);
    const { activeChain } = useActiveChain();
    const chain = activeChain.network;
    const [destinationWallet] = useOffRampWallet(rampState.sessionId, chain);
    const [max] = useGetAmountInWallet(token.address, token.decimals);
    const [send] = useSendToken(token.address, destinationWallet, val, token.decimals);


    return (
        <div>
            <div>
                <div className="text-f15 mb-5">Enter amount:</div>
                <BufferInput
                    header={
                        <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
                            <span className="flex flex-row items-center">
                                Max:
                                <Display data={max} unit={token.symbol} precision={2} />
                            </span>
                        </div>
                    }
                    numericValidations={{
                        decimals: { val: 6 },
                        max: {
                            val: max.toString(),
                            error: t('v2.Not enough funds'),
                        },
                        min: { val: '0', error: t('v2.Enter a positive value') },
                    }}
                    placeholder="0.0"
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    value={val}
                    onChange={(val) => {
                        setVal(val);
                    }}
                    unit={
                        <span className="text-f16 flex justify-between w-fit">
                            <OfframpTokensDropDown token={token} setToken={setToken} tokenList={tokenList} />
                        </span>
                    }
                />
                <div className="text-f15">&nbsp;</div>
                <div className="text-f15 mt-5 mb-5">Estimated return amount:</div>
                <BufferInput
                    placeholder="0.0"
                    bgClass="!bg-1"
                    ipClass="mt-1"
                    isDisabled={true}
                    value={quote}
                    onChange={() => { }}
                    unit={
                        <span className="text-f16 flex justify-between w-fit">
                            {currency}
                        </span>
                    }
                />
                <div className="flex whitespace-nowrap mt-5">
                    <BlueBtn
                        onClick={() => { send() }}
                        className="mr-4 rounded"
                        isLoading={state.txnLoading === 1}

                    >
                        Convert to {currency}
                    </BlueBtn>
                </div>
            </div>
        </div >
    );
}


function BankAddModal() {
    const [pageState] = useAtom(rampAtom);
    const [rampData] = useAtom(rampDataAtom);
    const [val, setVal] = useState('');
    const [account, setAccount] = useState('');
    const { state } = useGlobal();
    const [isAdded] = useAddAccount(pageState.sessionId, account, pageState.auxModalData.currency);
    if (isAdded) {
        window.location.reload();
    }
    return (
        <>
            <div>
                <div className="text-f15 mb-5">Add bank account for {pageState.auxModalData.currency}</div>
                <BufferInput
                    placeholder={"Enter IBAN"}
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
                    onClick={() => { setAccount(val); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    Add account
                </BlueBtn>
            </div>
        </>
    );
}

function TargetTokenModal() {
    const { state } = useGlobal();
    const [pageState, setPageState] = useAtom(rampAtom);
    const [rampData, setRampData] = useAtom(rampDataAtom);
    const current = rampData.tokenPreferences ? rampData.tokenPreferences.find(t => t.currency == pageState.auxModalData.currency) : null;
    const defaultToken = current ? { token: current.token, chain: current.chain } : { token: "", chain: "" };
    const [chain, setChain] = useState(defaultToken.chain);
    const [token, setToken] = useState<ITokenChain>(defaultToken);
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
                    <ChainsDropDown setChain={setChain} chain={chain} defaultChain={defaultToken.chain} />
                </div>
                <div className="text-f12 mb-5 mr-5">Token:
                    <TokensDropDown chain={chain} setToken={setToken} token={token} />
                </div>
                <div className="text-f15 mb-5 mr-5">&nbsp;</div>
                <div className="text-f15 mb-5 mr-5 m-auto"><BlueBtn
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1} onClick={() => { setTokenChain(token) }} >Save</BlueBtn></div>
            </div>
        </>
    );
}


function NewUserModal() {
    const [pageState] = useAtom(rampAtom);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [req, setReq] = useState<INewUserRequest>();
    const [country, setCountry] = useState({ country_code: "ES", country_name: "Spain" });

    const { state } = useGlobal();
    const [isDone] = useCreateUser(req);

    if (isDone) {
        window.location.reload();
    }
    return (
        <>
            <div className="text-f14">
                <div className="text-f15 mb-5">Enter your data:</div>
                <div className='mt-5'>E-mail:</div>
                <BufferInput placeholder={"Name"} bgClass="!bg-1" ipClass="mt-1" value={email} onChange={(val) => { setEmail(val); }} />
                <div className='mt-5'>Country:</div>
                <CountriesDropDown setCountry={setCountry} country={country} />
                <div className='mt-5'>First Name:</div>
                <BufferInput placeholder={"Name"} bgClass="!bg-1" ipClass="mt-1" value={firstName} onChange={(val) => { setFirstName(val); }} />
                <div className='mt-5'>Last Name:</div>
                <BufferInput placeholder={"Name"} bgClass="!bg-1" ipClass="mt-1" value={lastName} onChange={(val) => { setLastName(val); }} />


            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setReq({ email, first_name: firstName, last_name: lastName, country: country.country_code }); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    New User
                </BlueBtn>
            </div>
        </>
    );
}


function BankMainModal() {
    const [pageState] = useAtom(rampAtom);
    const [update, setUpdate] = useState(false);
    const toastify = useToast();
    const [result] = useSetMainBankAccount(pageState.sessionId, pageState.auxModalData.uuid, update, toastify)
    const { state } = useGlobal();

    if (result.done && result.status) {
        toastify("Main bank account updated successfully");
        window.location.reload();
        return <></>;
    }
    else if (result.done) {
        toastify({ type: "error", message: result.errorMessage })
        return <></>;
    }
    return (
        <>
            <div className="text-f14">
                <div className="text-f15 mb-5">Account IBAN:</div>
                <div className='mt-5'>{pageState.auxModalData.iban}</div>
            </div>
            <div className="flex whitespace-nowrap mt-5">
                <BlueBtn
                    onClick={() => { setUpdate(true); }}
                    className="rounded"
                    isDisabled={state.txnLoading > 1}
                    isLoading={state.txnLoading === 1}
                >
                    Set as main account
                </BlueBtn>
            </div>
        </>
    );
}


function CompleteKYCModal() {
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
                <div className='mt-5'>Address:</div>
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

const ChainsDropDown = ({ chain, setChain, defaultChain }: { chain: string; setChain: any, defaultChain: string }) => {
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

const TokensDropDown = ({ chain, setToken, token }: { chain: string; setToken: any; token: ITokenChain }) => {
    const [rampData] = useAtom(rampDataAtom);
    const firstLoad = useRef(true);
    useEffect(() => {
        if (!firstLoad.current) {
            setToken('');
            console.log("resetting token");
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



const OfframpTokensDropDown = ({ setToken, token, tokenList }: { setToken: any; token: { symbol: string, address: string, decimals: number }; tokenList: { symbol: string, address: string, decimals: number }[] }) => {

    const tokens = tokenList;
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
