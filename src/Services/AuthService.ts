import {isAxiosError} from 'axios';
import Cookies from 'js-cookie';
import apiInstance from './ApiInstance';

const ACCESS_TOKEN: string = 'accessToken';
const REFRESH_TOKEN: string = 'refreshToken';

export const logIn = async (
	email: string,
	password: string
): Promise<number> => {
	if (!email || !password) {
		return 401;
	}
	try {
		const result = await apiInstance.post(`/account/login/`, {
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

const saveAccessTokenInLocalStorage = (accessToken: string): void => {
	localStorage.setItem(ACCESS_TOKEN, accessToken);
};

const saveRefreshTokenInCookies = (refreshToken: string): void => {
	Cookies.set(REFRESH_TOKEN, refreshToken);
};

const getRefreshTokenFromCookies = (): string | undefined => {
	return Cookies.get(REFRESH_TOKEN);
};

export const getToken = () => {
	return getItemFromStorage(ACCESS_TOKEN);
};

export const refreshToken = async () => {
	try {
		const result = await apiInstance.post('/account/login/refresh/', {
			refresh: getRefreshTokenFromCookies()
		});

		saveAccessTokenInLocalStorage(result.data.access);
		return result.data.access;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
		return [];
	}
};

export const getItemFromStorage = (key: string): string | null => {
	return localStorage.getItem(key);
};
