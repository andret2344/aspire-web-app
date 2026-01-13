import * as AuthService from '@service/AuthService';

export const mockedLogIn: jest.Mock = jest.fn();
export const mockedLogout: jest.Mock = jest.fn();
export const mockedSignUp: jest.Mock = jest.fn();
export const mockedRequestResetPassword: jest.Mock = jest.fn();
export const mockedResetPassword: jest.Mock = jest.fn();
export const mockedChangePassword: jest.Mock = jest.fn();
export const mockedGetAccessToken: jest.Mock = jest.fn();
export const mockedRefreshToken: jest.Mock = jest.fn();
export const mockedIsTokenValid: jest.Mock = jest.fn();
export const mockedSaveAccessToken: jest.Mock = jest.fn();
export const mockedGetRefreshToken: jest.Mock = jest.fn();
export const mockedVerifyEmail: jest.Mock = jest.fn();
export const mockedConfirmEmail: jest.Mock = jest.fn();
export const mockedGetUserData: jest.Mock = jest.fn();

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
	confirmEmail: mockedConfirmEmail,
	getUserData: mockedGetUserData
}));
