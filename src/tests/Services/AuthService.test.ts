import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import apiInstance, {getBackendUrl} from '../../Services/ApiInstance';
import {
	changePassword,
	getRefreshTokenFromCookies,
	isTokenValid,
	logIn,
	logout,
	refreshToken,
	requestResetPassword,
	resetPassword,
	signUp
} from '../../Services/AuthService';
import {waitFor} from '@testing-library/react';
import Cookies from 'js-cookie';

describe('AuthService', (): void => {
	beforeEach((): void => localStorage.clear());

	test('return 401 if pass undefined login or password to login function', async () => {
		// act
		const response = await logIn('', '');

		// assert
		expect(response).toEqual(401);
	});

	test('return 401 if pass undefined password to login function', async () => {
		// act
		const response = await logIn('test', '');

		// assert
		expect(response).toEqual(401);
	});

	test('successful login', async () => {
		// arrange
		const mockResponseData = {
			access: 'access-token',
			refresh: 'refresh-token'
		};
		const email = 'test@example.com';
		const password = 'Testowe123!';
		const mock = new MockAdapter(axios);
		const baseUrl = getBackendUrl();
		mock.onPost(`${baseUrl}/account/login`, {
			email,
			password
		}).reply(200, mockResponseData);

		// act
		const response = await logIn(email, password);

		// assert
		expect(response).toEqual(200);
	});

	test('Handle error when login is not successful', async () => {
		// arrange
		const email = 'test@example.com';
		const password = 'Testowe123!';
		const mock = new MockAdapter(axios);
		const baseUrl = getBackendUrl();
		mock.onPost(`${baseUrl}/account/login`, {
			email,
			password
		}).reply(500);

		// act
		const response = await logIn(email, password);

		// assert
		expect(response).toEqual(401);
	});

	test('successful sign-up', async (): Promise<void> => {
		// arrange
		const email = 'test@example.com';
		const password = 'Testowe123!';
		const mock = new MockAdapter(axios);
		const baseUrl = getBackendUrl();
		mock.onPost(`${baseUrl}/account/register`, {
			email,
			password
		}).reply(200);

		// act
		const response = await signUp(email, password);

		// assert
		expect(response.status).toEqual(200);
	});

	test('logout successfully', async () => {
		// arrange
		const mockedHeader = btoa(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
		const mockedPayload = btoa(
			JSON.stringify({
				sub: '1234567890',
				name: 'John Doe',
				iat: 1516239022
			})
		);
		const mockedSignature = btoa('signature');
		const mockedToken = `${mockedHeader}.${mockedPayload}.${mockedSignature}`;
		localStorage.setItem('accessToken', mockedToken);
		Cookies.set('refreshToken', 'existing-refresh-token');
		const resultBefore = localStorage.getItem('accessToken');
		const cookiesResultBefore = Cookies.get('refreshToken');

		// assert
		await waitFor(() => {
			expect(resultBefore).toBe(mockedToken);
			expect(cookiesResultBefore).toBe('existing-refresh-token');
		});

		// act
		logout();

		// assert
		const resultAfter = localStorage.getItem('accessToken');
		expect(resultAfter).toBeNull();
		const resultCookiesAfter = Cookies.get('refreshToken');
		expect(resultCookiesAfter).toBeUndefined();
	});

	test('get refresh token', () => {
		// arrange
		Cookies.set('refreshToken', 'existing-refresh-token');

		// act
		const result = getRefreshTokenFromCookies();

		// assert
		expect(result).toEqual('existing-refresh-token');
	});

	test('try to request to reset password', async () => {
		// arrange
		const email = 'test@example.com';
		const mock = new MockAdapter(axios);
		const baseUrl = getBackendUrl();
		const url = `http://localhost/new-password`;
		mock.onPost(`${baseUrl}/account/password_reset`, {
			email,
			url
		}).reply(200);

		// act
		const response = await requestResetPassword(email);

		// assert
		expect(response.status).toEqual(200);
	});

	test('Successful reset password', async () => {
		// arrange
		const mock = new MockAdapter(axios);
		const password = 'Testowe123!';
		const passwordRepeat = 'Testowe123!';
		const token = 'accessToken';
		const baseUrl = getBackendUrl();
		mock.onPost(`${baseUrl}/account/password_reset/confirm`, {
			password,
			token,
			password_confirmation: passwordRepeat
		}).reply(200);

		// act
		const response = await resetPassword(password, token, passwordRepeat);

		// assert
		expect(response).toEqual(200);
	});

	test('Successful change-password', async () => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const newPassword = 'Testowe123!';
		const newPasswordConfirm = 'Testowe123!';
		const currentPassword = 'Testowe456!';
		const baseUrl = getBackendUrl();
		mock.onPost(`${baseUrl}/account/change_password`, {
			old_password: currentPassword,
			password: newPassword,
			password_confirmation: newPassword
		}).reply(200);

		// act
		const response = await changePassword(
			currentPassword,
			newPassword,
			newPasswordConfirm
		);

		// assert
		expect(response).toEqual(200);
	});

	test('refresh token', async (): Promise<void> => {
		// arrange
		const mockResponseData = {
			access: 'access-token'
		};
		const mock = new MockAdapter(apiInstance);
		mock.onPost('/account/login/refresh').reply(200, mockResponseData);

		// act
		await refreshToken().then((result): void => {
			// assert
			expect(result).toBeDefined();
			expect(result).toEqual(mockResponseData.access);
		});
	});

	test('refresh token rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const logSpy = jest.spyOn(console, 'error');
		mock.onPost('/account/login/refresh').reply(500);

		// act
		await refreshToken().then((result): void => {
			// assert
			expect(result).toBeUndefined();
			expect(logSpy).toHaveBeenCalled();
		});
	});

	test('is token valid should return false if the token has no exp field', (): void => {
		// arrange
		localStorage.setItem(
			'accessToken',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A'
		);

		// act && assert
		expect(isTokenValid()).toBe(false);
	});

	test('should return false if the token is expired', (): void => {
		// arrange
		localStorage.setItem(
			'accessToken',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNzA4MjA1NzQ0fQ.b_sUJMmYFPhJUcLC7vjlwDCqOImfxddCRgdzgOC6SNk'
		);

		// act && assert
		expect(isTokenValid()).toBe(false);
	});
});
