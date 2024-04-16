import axios, {AxiosRequestConfig, AxiosResponse, isAxiosError} from 'axios';
import Cookies from 'js-cookie';
import apiInstance, {getBackendUrl, getFrontendUrl} from './ApiInstance';
import {jwtDecode, JwtPayload} from 'jwt-decode';

const ACCESS_TOKEN: string = 'accessToken';
const REFRESH_TOKEN: string = 'refreshToken';

export const headers: {[key: string]: string} = {
	Accept: 'application/json',
	'Content-Type': 'application/json'
};

export const requestConfig: AxiosRequestConfig = {
	headers
};

export interface RegisterApiError {
	readonly email?: string;
	readonly password?: string;
}

export const logIn = async (
	email: string,
	password: string
): Promise<number> => {
	if (!email || !password) {
		return 401;
	}
	try {
		const baseUrl = getBackendUrl();
		const result = await axios.post(
			`${baseUrl}/account/login`,
			{
				email,
				password
			},
			requestConfig
		);

		saveAccessTokenInLocalStorage(result.data.access);
		saveRefreshTokenInCookies(result.data.refresh);
		return result.status;
	} catch (err) {
		console.log(err);
		return 401;
	}
};

export const signUp = async (
	email: string,
	password: string
): Promise<AxiosResponse> => {
	const baseUrl = getBackendUrl();
	return await axios.post(
		`${baseUrl}/account/register`,
		{
			email,
			password
		},
		requestConfig
	);
};

export const requestResetPassword = async (
	email: string
): Promise<AxiosResponse> => {
	const baseUrl = getBackendUrl();
	const url = `${getFrontendUrl()}/new-password`;
	return await axios.post(
		`${baseUrl}/account/password_reset`,
		{
			email,
			url
		},
		requestConfig
	);
};

export const resetPassword = async (
	password: string,
	token: string,
	passwordRepeat: string
): Promise<number> => {
	const baseUrl = getBackendUrl();
	const response = await axios.post(
		`${baseUrl}/account/password_reset/confirm`,
		{
			password,
			token,
			password_confirmation: passwordRepeat
		},
		requestConfig
	);

	return response.status;
};

export const changePassword = async (
	currentPassword: string,
	newPassword: string,
	newPasswordConfirm: string
): Promise<number> => {
	const baseUrl = getBackendUrl();
	const response = await apiInstance.post(
		`${baseUrl}/account/change_password`,
		{
			old_password: currentPassword,
			password: newPassword,
			password_confirmation: newPasswordConfirm
		},
		requestConfig
	);

	return response.status;
};

export const logout = (): void => {
	localStorage.removeItem(ACCESS_TOKEN);
	Cookies.remove(REFRESH_TOKEN);
};

export const saveAccessTokenInLocalStorage = (accessToken: string): void => {
	localStorage.setItem(ACCESS_TOKEN, accessToken);
};

const saveRefreshTokenInCookies = (refreshToken: string): void => {
	Cookies.set(REFRESH_TOKEN, refreshToken);
};

export const getRefreshTokenFromCookies = (): string | undefined => {
	return Cookies.get(REFRESH_TOKEN);
};

export const getToken = (): string | null => {
	return getItemFromStorage(ACCESS_TOKEN);
};

export const refreshToken = async (): Promise<string | undefined> => {
	try {
		const result = await apiInstance.post('/account/login/refresh', {
			refresh: getRefreshTokenFromCookies()
		});

		saveAccessTokenInLocalStorage(result.data.access);
		return result.data.access;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
	}
};

export const getItemFromStorage = (key: string): string | null => {
	return localStorage.getItem(key);
};

export const isTokenValid = (): boolean => {
	const token = getToken();

	if (!token) {
		return false;
	}

	const decodedToken = jwtDecode<JwtPayload>(token);
	if (!decodedToken.exp) {
		return false;
	}

	const currentTime = Date.now() / 1000;
	return decodedToken.exp > currentTime;
};
