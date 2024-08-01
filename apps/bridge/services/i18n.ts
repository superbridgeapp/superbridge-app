import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ar from "../public/locales/ar/translation.json";
import de from "../public/locales/de/translation.json";
import en from "../public/locales/en/translation.json";
import es from "../public/locales/es/translation.json";
import fr from "../public/locales/fr/translation.json";
import hi from "../public/locales/hi/translation.json";
import id from "../public/locales/id/translation.json";
import ja from "../public/locales/ja/translation.json";
import kr from "../public/locales/kr/translation.json";
import pl from "../public/locales/pl/translation.json";
import pt from "../public/locales/pt/translation.json";
import th from "../public/locales/th/translation.json";
import tr from "../public/locales/tr/translation.json";
import vi from "../public/locales/vi/translation.json";
import zhCN from "../public/locales/zh-CN/translation.json";
import zhTW from "../public/locales/zh-TW/translation.json";

i18n
  // https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  // https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    debug: false,

    resources: {
      ar: { translation: ar },
      de: { translation: de },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      hi: { translation: hi },
      id: { translation: id },
      ja: { translation: ja },
      kr: { translation: kr },
      pl: { translation: pl },
      pt: { translation: pt },
      th: { translation: th },
      tr: { translation: tr },
      vi: { translation: vi },
      "zh-CN": { translation: zhCN },
      "zh-TW": { translation: zhTW },
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
