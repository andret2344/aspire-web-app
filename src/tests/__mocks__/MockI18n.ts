export function useTranslation() {
	return {
		t: (str: string): string => str,
		i18n: {
			language: 'en',
			changeLanguage: jest.fn()
		}
	};
}
