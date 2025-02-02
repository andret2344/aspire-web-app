import * as i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		debug: false, //process.env.NODE_ENV === 'development',
		interpolation: {
			escapeValue: false
		},
		react: {
			// https://react.i18next.com/latest/trans-component#trans-props
			transSupportBasicHtmlNodes: true,
			transKeepBasicHtmlNodesFor: ['br', 'strong', 'u', 'em']
		}
	});

export default i18n;
