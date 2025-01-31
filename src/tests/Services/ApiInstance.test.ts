import MockAdapter from 'axios-mock-adapter';
import {
	mockedGetAccessToken,
	mockedRefreshToken,
	mockedSaveAccessToken
} from '../__mocks__/MockAuthService';
import apiInstance, {
	getBackendUrl,
	setConfig
} from '../../Services/ApiInstance';
import {AxiosRequestConfig} from 'axios';

describe('ApiInstance', (): void => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach((): void => {
		originalEnv = {...process.env};
	});

	afterEach((): void => {
		process.env = originalEnv;
	});

	test('should use default value when REACT_API_URL is not set', (): void => {
		delete process.env.REACT_API_URL;
		expect(getBackendUrl()).toBe('localhost:8080');
	});

	test('should update urlConfig and apiInstance defaults when config is provided', () => {
		// arrange
		const mockConfig = {
			backend: 'http://localhost',
			frontend: 'http://localhost'
		};

		// act
		setConfig(mockConfig);

		// assert
		expect(apiInstance.defaults.baseURL).toEqual(mockConfig.backend);
	});

	test('should add Authorization header if token is present', async (): Promise<void> => {
		// assert
		const mock = new MockAdapter(apiInstance);
		const token = 'test-token';
		mockedGetAccessToken.mockReturnValue(token);

		let capturedConfig: AxiosRequestConfig | undefined;
		mock.onPost('/test').reply((config) => {
			capturedConfig = config;
			return [200, {}];
		});

		// act
		await apiInstance.post('/test');

		// assert
		expect(capturedConfig).toBeDefined();
		expect(capturedConfig?.headers?.['Authorization']).toEqual(
			`Bearer ${token}`
		);
	});

	test('should refresh token and retry the original request on 401 response', async () => {
		// assert
		const mock = new MockAdapter(apiInstance);
		const originalRequestConfig = {url: '/test', method: 'get'};

		localStorage.setItem('refreshToken', 'existing-refresh-token');

		mock.onGet('/test').replyOnce(401);
		mock.onGet('/test').reply(200, {data: 'success'});

		mockedRefreshToken.mockResolvedValue('new-token');

		// act
		const result = await apiInstance(originalRequestConfig);

		// assert
		expect(mockedRefreshToken).toHaveBeenCalledTimes(1);
		expect(mockedSaveAccessToken).toHaveBeenCalledWith('new-token');
		expect(result).toHaveProperty('data', {data: 'success'});
	});

	test('should refresh token and retry the original request on no response', async () => {
		// assert
		const mock = new MockAdapter(apiInstance);
		const originalRequestConfig = {url: '/test', method: 'get'};

		mock.onGet('/test').networkError();

		// act
		try {
			await apiInstance(originalRequestConfig);
		} catch (error) {
			// assert
			expect(mockedRefreshToken).toHaveBeenCalledTimes(0);
		}
	});
});
