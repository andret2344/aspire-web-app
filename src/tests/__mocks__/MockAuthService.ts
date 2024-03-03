import * as AuthService from '../../../src/Services/AuthService';

export const mockedLogIn = jest.fn();
export const mockedLogout = jest.fn();
export const mockedSignUp = jest.fn();
export const mockedGetToken = jest.fn();
export const mockedRefreshToken = jest.fn();
export const mockedIsTokenValid = jest.fn();
export const mockedSaveAccessTokenInLocalStorage = jest.fn();
export const mockedGetRefreshTokenFromCookies = jest.fn();

jest.mock('../../../src/Services/AuthService', () => ({
	...jest.requireActual<typeof AuthService>(
		'../../../src/Services/AuthService'
	),
	logIn: mockedLogIn,
	logout: mockedLogout,
	signUp: mockedSignUp,
	getToken: mockedGetToken,
	refreshToken: mockedRefreshToken,
	isTokenValid: mockedIsTokenValid,
	saveAccessTokenInLocalStorage: mockedSaveAccessTokenInLocalStorage,
	getRefreshTokenFromCookies: mockedGetRefreshTokenFromCookies
}));
