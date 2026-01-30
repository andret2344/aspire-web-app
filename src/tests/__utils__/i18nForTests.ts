import {initReactI18next} from 'react-i18next';
import i18n from 'i18next';

i18n.use(initReactI18next).init({
	lng: 'en',
	fallbackLng: 'en',
	resources: {
		en: {
			translation: {},
			faq: {
				title: 'FAQ',
				items: [
					{
						q: 'Question 1',
						a: 'Answer 1'
					},
					{
						q: 'Question 2',
						a: 'Answer 2'
					}
				]
			}
		}
	},
	interpolation: {
		escapeValue: false
	}
});

export default i18n;
