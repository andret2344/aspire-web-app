import {
	getAccessToken,
	refreshToken,
	saveAccessToken
} from './AuthService';
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig
} from 'axios';
import {Config} from './EnvironmentHelper';
import {identity} from '@util/functions';

type RetryInternalAxiosRequestConfig = InternalAxiosRequestConfig & {
	readonly _retry: boolean;
};

let fetchedConfig: Config | undefined = undefined;

function createTokenHeader(token: string): string {
	return `Bearer ${token}`;
}

function getDefaultConfig(): Config {
	return {
		backend: process.env.REACT_API_URL ?? 'http://localhost:8080',
		frontend: `${globalThis.location.protocol}//${globalThis.location.host}`
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

apiInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const token: string | null = getAccessToken();
		if (token) {
			config.headers['Authorization'] = createTokenHeader(token);
		}
		return config;
	}
);

apiInstance.interceptors.response.use(
	identity<AxiosResponse>,
	async (error: AxiosError): Promise<AxiosResponse> => {
		const originalRequest: RetryInternalAxiosRequestConfig | undefined =
			error.config as RetryInternalAxiosRequestConfig | undefined;
		if (!originalRequest || originalRequest._retry) {
			throw error;
		}

		if (error.response?.status !== 401) {
			throw error;
		}

		const newToken: string | undefined = await refreshToken();
		if (!newToken) {
			throw error;
		}

		saveAccessToken(newToken);
		apiInstance.defaults.headers.common['Authorization'] =
			createTokenHeader(newToken);
		return apiInstance(originalRequest);
	}
);

export default apiInstance;
