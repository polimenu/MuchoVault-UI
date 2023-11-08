import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { atom, useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from 'src/constants';

export interface ILanguageAtom {
    isModalOpen: boolean;
}

export const LanguageDataAtom = atom<ILanguageAtom>({
    isModalOpen: false,
});

export const LanguageModal = ({ }: {}) => {
    const [pageState, setPageState] = useAtom(LanguageDataAtom);
    const { i18n } = useTranslation();

    const closeModal = () => {
        setPageState({
            ...pageState,
            isModalOpen: false,
        });
    }
    return (
        <Dialog open={pageState.isModalOpen} onClose={closeModal}>
            <div className="text-1 bg-2 p-6 rounded-md relative">
                {pageState.isModalOpen && <div>
                    <div className="text-f22 mb-5 mt-5">Select your language:</div>
                    <div className="flex items-center gap-[24px] whitespace-nowrap ml-[8px]">
                        {LANGUAGES.map(l => <img src={`/lang_${l.code}.png`} className='hover:bg-1 hover:text-1 hover:brightness-125 cursor-pointer mt-2' width={"75px"} height={"75px"} onClick={() => {
                            i18n.changeLanguage(l.code);
                            localStorage.setItem("lang", l.code);
                            closeModal();
                        }} />)}
                    </div>
                </div>}
            </div>
        </Dialog>
    );
};