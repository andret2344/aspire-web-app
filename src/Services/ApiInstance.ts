import {
	getToken,
	refreshToken,
	saveAccessTokenInLocalStorage
} from './AuthService';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig
} from 'axios';
import '../config.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// prettier-ignore
export const baseUrl: string | undefined = window.appConfig.REACT_APP_API;

const apiInstance: AxiosInstance = axios.create({
	baseURL: `${baseUrl}/api`,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

/* eslint-disable  @typescript-eslint/no-explicit-any */
apiInstance.interceptors.request.use(
	async (
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig<any>> => {
		const token = getToken();
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	}
);

apiInstance.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse<any, any> => response,
	async (error: AxiosError): Promise<AxiosResponse<any>> => {
		const originalRequest: InternalAxiosRequestConfig<any> | undefined =
			error.config;

		if (error.response?.status === 401 && originalRequest) {
			const newToken = await refreshToken();
			if (newToken) {
				saveAccessTokenInLocalStorage(newToken);
				return apiInstance(originalRequest);
			}
		}
		return Promise.reject(error);
	}
);
/* eslint-enable  @typescript-eslint/no-explicit-any */

export default apiInstance;
