import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import si from './si.json';

// the translations
const resources = {
    en: {
        translation: en,
    },
    si: {
        translation: si,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Set a default language
        fallbackLng: 'en', // Fallback language if a translation is missing
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;