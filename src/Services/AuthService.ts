import axios, {AxiosResponse, isAxiosError} from 'axios';
import Cookies from 'js-cookie';
import apiInstance, {baseUrl} from './ApiInstance';

const ACCESS_TOKEN: string = 'accessToken';
const REFRESH_TOKEN: string = 'refreshToken';
const headers: {[key: string]: string} = {
	Accept: 'application/json',
	'Content-Type': 'application/json'
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
		const result = await apiInstance.post(`/account/login`, {
			email,
			password
		});

		saveAccessTokenInLocalStorage(result.data.access);
		saveRefreshTokenInCookies(result.data.refresh);
		return result.status;
	} catch (err) {
		return 401;
	}
};

export const signUp = async (
	email: string,
	password: string
): Promise<AxiosResponse> => {
	return await axios.post(
		`${baseUrl}/api/account/register`,
		{
			email,
			password
		},
		{headers}
	);
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

const getRefreshTokenFromCookies = (): string | undefined => {
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
