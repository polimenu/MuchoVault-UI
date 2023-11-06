import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nBackend from "i18next-http-backend";

const getCurrentLang = () => {
    return "es";
}

i18n
    .use(i18nBackend)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        lng: getCurrentLang(),
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: `${window.location.origin}/i18n/{{lng}}.json`,
        },
    });

export default i18n;
