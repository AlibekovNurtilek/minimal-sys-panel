import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import ky from './locales/ky.json';

const resources = {
  ru: {
    translation: ru
  },
  ky: {
    translation: ky
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ky',
    fallbackLng: 'ky',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  });

export default i18n;

