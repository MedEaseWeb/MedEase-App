import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import zhCN from "./locales/zh-CN/translation.json";
import ko from "./locales/ko/translation.json";
import es from "./locales/es/translation.json";
import ja from "./locales/ja/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "zh-CN", "ko", "es", "ja"],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en:      { translation: en },
      "zh-CN": { translation: zhCN },
      ko:      { translation: ko },
      es:      { translation: es },
      ja:      { translation: ja },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "medease_lang",
    },
  });

export default i18n;
