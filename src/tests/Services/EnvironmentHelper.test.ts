import axios from 'axios';
import {Config, getConfig} from '@service/EnvironmentHelper';
import MockAdapter from 'axios-mock-adapter';

describe('EnvironmentHelper', (): void => {
	it('gets config from the server', async (): Promise<void> => {
		// arrange
		const mockConfig = {
			data: {
				frontend: 'https://frontend.example.com',
				backend: 'https://backend.example.com'
			}
		};

		const mock = new MockAdapter(axios);
		mock.onGet(/discovery\.andret\.eu/).reply(200, {
			data: mockConfig
		});

		process.env.NODE_ENV = 'production';
		process.env.REACT_APP_API_TOKEN = 'test-token';

		// act
		const config: Config | undefined = await getConfig();

		// assert
		expect(config).toEqual(mockConfig);
		mock.restore();
	});

	it('returns undefined when API call fails', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(axios);
		mock.onGet(/discovery\.andret\.eu/).reply(500);
		process.env.NODE_ENV = 'production';

		// act & assert
		getConfig()
			.then((): void => fail('should not reach this point'))
			.catch((error: Error): void => expect(error).toBeDefined());
	});
});
