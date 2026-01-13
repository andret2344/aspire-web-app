import {waitFor} from '@testing-library/react';
import {UserData, UserDataResponse} from '@entity/UserData';
import apiInstance, {getApiConfig} from '@service/ApiInstance';
import {
	changePassword,
	confirmEmail,
	getRefreshToken,
	getUserData,
	isTokenValid,
	logIn,
	logout,
	refreshToken,
	requestResetPassword,
	resetPassword,
	signUp,
	verifyEmail
} from '@service/AuthService';
import axios, {AxiosError, AxiosResponse} from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('AuthService', (): void => {
	it('return 401 if pass undefined login or password to login function', async () => {
		// act
		const response = await logIn('', '');

		// assert
		expect(response).toEqual(401);
	});

	it('return 401 if pass undefined password to login function', async () => {
		// act
		const response = await logIn('it', '');

		// assert
		expect(response).toEqual(401);
	});

	it('successful login', async () => {
		// arrange
		const mockResponseData = {
			access: 'access-token',
			refresh: 'refresh-token'
		};
		const email = 'it@example.com';
		const password = 'Testowe123!';
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
		mock.onPost(`${baseUrl}/account/login`, {
			email,
			password
		}).reply(200, mockResponseData);
		jest.spyOn(console, 'error').mockImplementation();

		// act
		const response = await logIn(email, password);

		// assert
		expect(response).toEqual(200);
	});

	it('handle error when login is not successful', async () => {
		// arrange
		const email = 'it@example.com';
		const password = 'Testowe123!';
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
		mock.onPost(`${baseUrl}/account/login`, {
			email,
			password
		}).reply(500);

		// act
		const response = await logIn(email, password);

		// assert
		expect(response).toEqual(401);
	});

	it('successful sign-up', async (): Promise<void> => {
		// arrange
		const email = 'it@example.com';
		const password = 'Testowe123!';
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
		mock.onPost(`${baseUrl}/account/register`, {
			email,
			password
		}).reply(200);

		// act
		signUp(email, password).then((result: AxiosResponse): void => {
			// assert
			expect(result.status).toEqual(200);
		});
	});

	it('logout successfully', async () => {
		// arrange
		const mockedHeader = btoa(
			JSON.stringify({
				alg: 'HS256',
				typ: 'JWT'
			})
		);
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
		localStorage.setItem('refreshToken', 'existing-refresh-token');
		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');

		// assert
		await waitFor(() => {
			expect(accessToken).toBe(mockedToken);
			expect(refreshToken).toBe('existing-refresh-token');
		});

		// act
		logout();

		// assert
		const resultAccessToken = localStorage.getItem('accessToken');
		expect(resultAccessToken).toBeNull();
		const resultRefreshToken = localStorage.getItem('refreshToken');
		expect(resultRefreshToken).toBeNull();
	});

	it('get refresh token', () => {
		// arrange
		localStorage.setItem('refreshToken', 'existing-refresh-token');

		// act
		const result = getRefreshToken();

		// assert
		expect(result).toEqual('existing-refresh-token');
	});

	it('try to request to reset password', async () => {
		// arrange
		const email = 'it@example.com';
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
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

	it('Successful reset password', async () => {
		// arrange
		const mock = new MockAdapter(axios);
		const password = 'Testowe123!';
		const passwordRepeat = 'Testowe123!';
		const token = 'accessToken';
		const baseUrl = getApiConfig().backend;
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

	it('Successful change-password', async () => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const newPassword = 'Testowe123!';
		const newPasswordConfirm = 'Testowe123!';
		const currentPassword = 'Testowe456!';
		const baseUrl = getApiConfig().backend;
		mock.onPost(`${baseUrl}/account/change_password`, {
			old_password: currentPassword,
			password: newPassword,
			password_confirmation: newPassword
		}).reply(200);

		// act
		const response = await changePassword(currentPassword, newPassword, newPasswordConfirm);

		// assert
		expect(response).toEqual(200);
	});

	it('refresh token', async (): Promise<void> => {
		// arrange
		const mockResponseData = {
			token: 'access-token'
		};
		localStorage.setItem('refreshToken', 'existing-refresh-token');
		const mock = new MockAdapter(axios);
		mock.onPost(`${getApiConfig().backend}/account/token/refresh`).reply(200, mockResponseData);

		// act
		const result: string | undefined = await refreshToken();

		//assert
		expect(result).toEqual(mockResponseData.token);
	});

	it('refresh token rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(axios);
		localStorage.setItem('refreshToken', 'existing-refresh-token');
		mock.onPost(`${getApiConfig().backend}/account/token/refresh`).reply(500);

		// act
		await expect(refreshToken()).rejects.toBeInstanceOf(AxiosError);
	});

	it('refresh token returns undefined when no refresh token exists', async (): Promise<void> => {
		// arrange
		localStorage.removeItem('refreshToken');

		// act
		const result: string | undefined = await refreshToken();

		// assert
		expect(result).toBeUndefined();
	});

	it('is token valid should return false if the token has no exp field', (): void => {
		// arrange
		localStorage.setItem(
			'accessToken',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.Gfx6VO9tcxwk6xqx9yYzSfebfeakZp5JYIgP_edcw_A'
		);

		// act && assert
		expect(isTokenValid()).toBe(false);
	});

	it('should return false if the token is expired', (): void => {
		// arrange
		localStorage.setItem(
			'accessToken',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNzA4MjA1NzQ0fQ.b_sUJMmYFPhJUcLC7vjlwDCqOImfxddCRgdzgOC6SNk'
		);

		// act && assert
		expect(isTokenValid()).toBe(false);
	});

	it('should return false if no token provided', (): void => {
		// arrange
		localStorage.removeItem('accessToken');

		// act && assert
		expect(isTokenValid()).toBe(false);
	});

	it('getUserData returns user data successfully', async (): Promise<void> => {
		// arrange
		const mockResponseData: UserDataResponse = {
			id: 1,
			email: 'test@example.com',
			is_verified: true,
			last_login: '2024-01-01T12:00:00Z'
		};
		const mock = new MockAdapter(apiInstance);
		const baseUrl = getApiConfig().backend;
		mock.onGet(`${baseUrl}/account/me`).reply(200, mockResponseData);

		// act
		const result: UserDataResponse = await getUserData();

		// assert
		expect(result).toEqual(mockResponseData);
		expect(result.id).toBe(1);
		expect(result.email).toBe('test@example.com');
		expect(result.is_verified).toBe(true);
		expect(result.last_login).toBe('2024-01-01T12:00:00Z');
	});

	it('verifyEmail sends correct request', async (): Promise<void> => {
		// arrange
		const user: UserData = {
			id: 1,
			email: 'test@example.com',
			isVerified: false,
			lastLogin: new Date()
		};
		const mock = new MockAdapter(apiInstance);
		const baseUrl = getApiConfig().backend;
		mock.onPost(`${baseUrl}/account/verify_email`, {
			user_id: 1
		}).reply(200);

		// act
		const response: AxiosResponse = await verifyEmail(user);

		// assert
		expect(response.status).toBe(200);
	});

	it('confirmEmail sends correct request', async (): Promise<void> => {
		// arrange
		const token = 'test-confirmation-token';
		const mock = new MockAdapter(apiInstance);
		const baseUrl = getApiConfig().backend;
		mock.onPost(`${baseUrl}/account/confirm`, {
			token
		}).reply(200);

		// act
		const response: AxiosResponse = await confirmEmail(token);

		// assert
		expect(response.status).toBe(200);
	});

	it('confirmEmail handles error response', async (): Promise<void> => {
		// arrange
		const token = 'invalid-token';
		const mock = new MockAdapter(apiInstance);
		const baseUrl = getApiConfig().backend;
		mock.onPost(`${baseUrl}/account/confirm`, {
			token
		}).reply(400, {error: 'Invalid token'});

		// act & assert
		await expect(confirmEmail(token)).rejects.toThrow();
	});
});
