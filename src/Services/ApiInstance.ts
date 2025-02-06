import {getAccessToken, refreshToken, saveAccessToken} from './AuthService';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig
} from 'axios';
import {Config} from './EnvironmentHelper';

let fetchedConfig: Config | undefined = undefined;

function createTokenHeader(token: string): string {
	return `Bearer ${token}`;
}

function getDefaultConfig(): Config {
	return {
		backend: process.env.REACT_API_URL ?? 'http://localhost:8080',
		frontend: `${window.location.protocol}//${window.location.host}`
	};
}

export function getApiConfig(): Config {
	return fetchedConfig ?? getDefaultConfig();
}

const apiInstance: AxiosInstance = axios.create({
	baseURL: getApiConfig().backend,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

export function setConfig(config: Config | undefined): void {
	if (config) {
		fetchedConfig = config;
		apiInstance.defaults.baseURL = config.backend;
	}
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
apiInstance.interceptors.request.use(
	async (
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig<any>> => {
		const token: string | null = getAccessToken();
		if (token) {
			config.headers['Authorization'] = createTokenHeader(token);
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
			const newToken: string | undefined = await refreshToken();
			if (newToken) {
				originalRequest.headers['Authorization'] =
					createTokenHeader(newToken);
				saveAccessToken(newToken);
				return apiInstance(originalRequest);
			}
		}
		return Promise.reject(error);
	}
);
/* eslint-enable  @typescript-eslint/no-explicit-any */

export default apiInstance;
