import axios, {AxiosRequestConfig, AxiosResponse, isAxiosError} from 'axios';
import apiInstance, {getApiConfig} from './ApiInstance';
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
		const baseUrl: string = getApiConfig().backend;
		const result: AxiosResponse = await axios.post(
			`${baseUrl}/account/login`,
			{
				email,
				password
			},
			requestConfig
		);
		saveAccessToken(result.data.access);
		saveRefreshToken(result.data.refresh);
		return result.status;
	} catch (err) {
		return 401;
	}
}

export async function signUp(
	email: string,
	password: string
): Promise<AxiosResponse> {
	const baseUrl: string = getApiConfig().backend;
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
	const baseUrl: string = getApiConfig().backend;
	const url: string = `${getApiConfig().frontend}/new-password`;
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
	const baseUrl: string = getApiConfig().backend;
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
	const baseUrl = getApiConfig().backend;
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
	localStorage.removeItem(REFRESH_TOKEN);
}

export function saveAccessToken(accessToken: string): void {
	localStorage.setItem(ACCESS_TOKEN, accessToken);
}

function saveRefreshToken(refreshToken: string): void {
	localStorage.setItem(REFRESH_TOKEN, refreshToken);
}

export function getRefreshToken(): string | null {
	return localStorage.getItem(REFRESH_TOKEN);
}

export function getAccessToken(): string | null {
	return localStorage.getItem(ACCESS_TOKEN);
}

export async function refreshToken(): Promise<string | undefined> {
	try {
		const result: AxiosResponse = await apiInstance.post(
			'/account/login/refresh',
			{
				refresh: getRefreshToken()
			}
		);

		saveAccessToken(result.data.accessToken);
		return result.data.accessToken;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
	}
}

export function isTokenValid(): boolean {
	const token: string | null = getAccessToken();

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
