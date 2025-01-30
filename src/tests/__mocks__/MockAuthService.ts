import * as AuthService from '../../../src/Services/AuthService';

export const mockedLogIn = jest.fn();
export const mockedLogout = jest.fn();
export const mockedSignUp = jest.fn();
export const mockedRequestResetPassword = jest.fn();
export const mockedResetPassword = jest.fn();
export const mockedChangePassword = jest.fn();
export const mockedGetAccessToken = jest.fn();
export const mockedRefreshToken = jest.fn();
export const mockedIsTokenValid = jest.fn();
export const mockedsaveAccessToken = jest.fn();
export const mockedgetRefreshToken = jest.fn();

jest.mock('../../../src/Services/AuthService', () => ({
	...jest.requireActual<typeof AuthService>(
		'../../../src/Services/AuthService'
	),
	logIn: mockedLogIn,
	logout: mockedLogout,
	signUp: mockedSignUp,
	requestResetPassword: mockedRequestResetPassword,
	resetPassword: mockedResetPassword,
	changePassword: mockedChangePassword,
	getAccessToken: mockedGetAccessToken,
	refreshToken: mockedRefreshToken,
	isTokenValid: mockedIsTokenValid,
	saveAccessToken: mockedsaveAccessToken,
	getRefreshToken: mockedgetRefreshToken
}));
