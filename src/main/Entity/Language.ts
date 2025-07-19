export interface Language {
	readonly code: string;
	readonly iconCode: string;
	readonly name: string;
}

export const LANGUAGE_POLISH: Language = {
	code: 'pl-PL',
	iconCode: 'pl',
	name: 'Polski'
};

export const LANGUAGE_ENGLISH: Language = {
	code: 'en-US',
	iconCode: 'gb',
	name: 'English'
};

export function getLanguages(): Language[] {
	return [LANGUAGE_ENGLISH, LANGUAGE_POLISH];
}

export function getLanguageByCode(code: string): Language | undefined {
	const language = getLanguages().find(
		(language: Language): boolean => language.code === code
	);
	return language;
}
