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

export async function logIn(email: string, password: string): Promise<number> {
	if (!email || !password) {
		return 401;
	}
	try {
		const baseUrl: string = getBackendUrl();
		const result: AxiosResponse = await axios.post(
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
}

export async function signUp(
	email: string,
	password: string
): Promise<AxiosResponse> {
	const baseUrl: string = getBackendUrl();
	return await axios.post(
		`${baseUrl}/account/register`,
		{
			email,
			password
		},
		requestConfig
	);
}

export async function requestResetPassword(
	email: string
): Promise<AxiosResponse> {
	const baseUrl: string = getBackendUrl();
	const url: string = `${getFrontendUrl()}/new-password`;
	return await axios.post(
		`${baseUrl}/account/password_reset`,
		{
			email,
			url
		},
		requestConfig
	);
}

export async function resetPassword(
	password: string,
	token: string,
	passwordRepeat: string
): Promise<number> {
	const baseUrl: string = getBackendUrl();
	const response: AxiosResponse = await axios.post(
		`${baseUrl}/account/password_reset/confirm`,
		{
			password,
			token,
			password_confirmation: passwordRepeat
		},
		requestConfig
	);
	return response.status;
}

export async function changePassword(
	currentPassword: string,
	newPassword: string,
	newPasswordConfirm: string
): Promise<number> {
	const baseUrl = getBackendUrl();
	const response: AxiosResponse = await apiInstance.post(
		`${baseUrl}/account/change_password`,
		{
			old_password: currentPassword,
			password: newPassword,
			password_confirmation: newPasswordConfirm
		},
		requestConfig
	);

	return response.status;
}

export function logout(): void {
	localStorage.removeItem(ACCESS_TOKEN);
	Cookies.remove(REFRESH_TOKEN);
}

export function saveAccessTokenInLocalStorage(accessToken: string): void {
	localStorage.setItem(ACCESS_TOKEN, accessToken);
}

function saveRefreshTokenInCookies(refreshToken: string): void {
	Cookies.set(REFRESH_TOKEN, refreshToken);
}

export function getRefreshTokenFromCookies(): string | undefined {
	return Cookies.get(REFRESH_TOKEN);
}

export function getToken(): string | null {
	return getItemFromStorage(ACCESS_TOKEN);
}

export async function refreshToken(): Promise<string | undefined> {
	try {
		const result: AxiosResponse = await apiInstance.post(
			'/account/login/refresh',
			{
				refresh: getRefreshTokenFromCookies()
			}
		);

		saveAccessTokenInLocalStorage(result.data.access);
		return result.data.access;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
	}
}

export function getItemFromStorage(key: string): string | null {
	return localStorage.getItem(key);
}

export function isTokenValid(): boolean {
	const token: string | null = getToken();

	if (!token) {
		return false;
	}

	const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
	if (!decodedToken.exp) {
		return false;
	}

	const currentTime: number = Date.now() / 1000;
	return decodedToken.exp > currentTime;
}
