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
import {Config} from './EnvironmentHelper';

let urlConfig: Config = {
	backend: process.env.REACT_API_URL,
	frontend: `${window.location.protocol}//${window.location.host}`
};

export function getBackendUrl(): string {
	return urlConfig.backend ?? 'localhost:8080';
}

export function getFrontendUrl(): string {
	return urlConfig.frontend;
}

const apiInstance: AxiosInstance = axios.create({
	baseURL: `${getBackendUrl()}`,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

export function setConfig(config: Config | undefined): void {
	if (config) {
		urlConfig = config;
		apiInstance.defaults.baseURL = config.backend;
	}
}

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
