import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations.json";

i18n.use(initReactI18next).init({
	resources: {
		vi: { translation: translations.vi },
		en: { translation: translations.en },
		fr: { translation: translations.fr },
	},
	fallbackLng: "en",
	interpolation: { escapeValue: false },
});

export default i18n;
