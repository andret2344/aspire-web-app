import * as AuthService from '@service/AuthService';

export const mockedLogIn = jest.fn();
export const mockedLogout = jest.fn();
export const mockedSignUp = jest.fn();
export const mockedRequestResetPassword = jest.fn();
export const mockedResetPassword = jest.fn();
export const mockedChangePassword = jest.fn();
export const mockedGetAccessToken = jest.fn();
export const mockedRefreshToken = jest.fn();
export const mockedIsTokenValid = jest.fn();
export const mockedSaveAccessToken = jest.fn();
export const mockedGetRefreshToken = jest.fn();
export const mockedVerifyEmail = jest.fn();
export const mockedConfirmEmail = jest.fn();

jest.mock('@service/AuthService', () => ({
	...jest.requireActual<typeof AuthService>('@service/AuthService'),
	logIn: mockedLogIn,
	logout: mockedLogout,
	signUp: mockedSignUp,
	requestResetPassword: mockedRequestResetPassword,
	resetPassword: mockedResetPassword,
	changePassword: mockedChangePassword,
	getAccessToken: mockedGetAccessToken,
	refreshToken: mockedRefreshToken,
	isTokenValid: mockedIsTokenValid,
	saveAccessToken: mockedSaveAccessToken,
	getRefreshToken: mockedGetRefreshToken,
	verifyEmail: mockedVerifyEmail,
	confirmEmail: mockedConfirmEmail
}));
