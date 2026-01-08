import {mockedGetAccessToken, mockedRefreshToken, mockedSaveAccessToken} from '../__mocks__/MockAuthService';
import apiInstance, {getApiConfig, setConfig} from '@service/ApiInstance';
import {Config} from '@service/EnvironmentHelper';
import {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('ApiInstance', (): void => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach((): void => {
		originalEnv = {
			...process.env
		};
	});

	afterEach((): void => {
		process.env = originalEnv;
	});

	it('should use the environment variable value', (): void => {
		// arrange
		process.env.REACT_API_URL = 'http://test.localhost:3000';

		// act & assert
		expect(getApiConfig()).toStrictEqual({
			backend: 'http://test.localhost:3000',
			frontend: 'http://localhost'
		});
	});

	it('should use the default value when REACT_API_URL is not set', (): void => {
		// arrange
		delete process.env.REACT_API_URL;

		// act & assert
		expect(getApiConfig()).toStrictEqual({
			backend: 'http://localhost:8080',
			frontend: 'http://localhost'
		});
	});

	it('should update urlConfig and apiInstance defaults when config is provided', (): void => {
		// arrange
		const mockConfig = {
			backend: 'http://backend.localhost',
			frontend: 'http://backend.localhost'
		};

		// act
		setConfig(mockConfig);

		// assert
		expect(getApiConfig()).toStrictEqual(mockConfig);
	});

	it('should add Authorization header if token is present', async (): Promise<void> => {
		// assert
		const mock = new MockAdapter(apiInstance);
		const token = 'test-token';
		mockedGetAccessToken.mockReturnValue(token);

		let capturedConfig: AxiosRequestConfig | undefined;
		mock.onPost('/test').reply((config: AxiosRequestConfig): [number, {}] => {
			capturedConfig = config;
			return [200, {}];
		});

		// act
		await apiInstance.post('/test');

		// assert
		expect(capturedConfig).toBeDefined();
		expect(capturedConfig?.headers?.['Authorization']).toEqual(`Bearer ${token}`);
	});

	it('should refresh token and retry the original request on 401 response', async (): Promise<void> => {
		// assert
		const mock = new MockAdapter(apiInstance);
		const originalRequestConfig = {
			url: '/test',
			method: 'get'
		};

		localStorage.setItem('refreshToken', 'existing-refresh-token');

		mock.onGet('/test').replyOnce(401);
		mock.onGet('/test').reply(200, {
			data: 'success'
		});

		mockedRefreshToken.mockResolvedValue('new-token');

		// act
		const result: AxiosResponse = await apiInstance(originalRequestConfig);

		// assert
		expect(mockedRefreshToken).toHaveBeenCalledTimes(1);
		expect(mockedSaveAccessToken).toHaveBeenCalledWith('new-token');
		expect(result).toHaveProperty('data', {
			data: 'success'
		});
	});

	it('should refresh token and retry the original request on no response', async (): Promise<void> => {
		// assert
		const mock = new MockAdapter(apiInstance);
		const originalRequestConfig = {
			url: '/test',
			method: 'get'
		};

		mock.onGet('/test').networkError();

		// act
		try {
			await apiInstance(originalRequestConfig);
		} catch (_ignored) {
			// assert
			expect(mockedRefreshToken).toHaveBeenCalledTimes(0);
		}
	});

	it('should throw error when refresh token returns undefined', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mockedRefreshToken.mockResolvedValue(undefined);

		mock.onGet('/test').reply(401);

		// act & assert
		await expect(apiInstance.get('/test')).rejects.toThrow();
		expect(mockedRefreshToken).toHaveBeenCalled();
	});

	it('should throw error when originalRequest is undefined', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);

		mock.onGet('/test').reply((): never => {
			throw Object.assign(new Error('Unauthorized'), {
				response: {status: 401},
				config: undefined
			});
		});

		// act & assert
		await expect(apiInstance.get('/test')).rejects.toThrow();
	});

	it('should throw error when retry flag is already set', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);

		mock.onGet('/test').replyOnce(401);
		mock.onGet('/test').reply((config: AxiosRequestConfig): never => {
			throw Object.assign(new Error('Unauthorized'), {
				response: {status: 401},
				config: {...config, _retry: true} as InternalAxiosRequestConfig & {_retry: boolean}
			});
		});

		mockedRefreshToken.mockResolvedValue('new-token');

		// act & assert
		await expect(apiInstance.get('/test')).rejects.toThrow();
	});

	it('should not update config when undefined is provided', (): void => {
		// arrange
		const initialConfig: Config = getApiConfig();

		// act
		setConfig(undefined);

		// assert
		expect(getApiConfig()).toStrictEqual(initialConfig);
	});
});
