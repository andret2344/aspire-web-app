export interface Language {
	readonly code: string;
	readonly iconCode: string;
	readonly name: string;
}

export const LANGUAGE_POLISH: Language = {
	code: 'pl',
	iconCode: 'pl',
	name: 'Polski'
};

export const LANGUAGE_ENGLISH: Language = {
	code: 'en',
	iconCode: 'gb',
	name: 'English'
};

export function getLanguages(): Language[] {
	return [LANGUAGE_ENGLISH, LANGUAGE_POLISH];
}
