import MockAdapter from 'axios-mock-adapter';
import {getConfig} from '../../Services/EnvironmentHelper';
import axios from 'axios';

describe('EnvironmentHelper', (): void => {
	test('get config and return undefined', async (): Promise<void> => {
		// act
		const config = await getConfig();

		// assert
		expect(config).toBe(undefined);
	});

	test('get config from server', async (): Promise<void> => {
		// arrange
		const mockConfig = {
			data: {
				frontend: 'https://frontend.example.com',
				backend: 'https://backend.example.com'
			}
		};

		const mock = new MockAdapter(axios);
		const uuidRegex = /^https:\/\/discovery\.andret\.eu\?uuid=[a-z0-9-]+$/i;
		mock.onGet(uuidRegex).reply(200, {data: mockConfig});

		process.env.NODE_ENV = 'production';
		process.env.REACT_APP_API_TOKEN = 'test-token';

		// act
		const config = await getConfig();

		// assert
		expect(config).toEqual(mockConfig);
		mock.restore();
	});

	test('returns undefined when API call fails', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(axios);
		mock.onGet('https://data.andret.eu').reply(500);
		process.env.NODE_ENV = 'production';

		// act
		const config = await getConfig();

		// assert
		expect(config).toBeUndefined();
	});
});
