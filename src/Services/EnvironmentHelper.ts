import axios, {AxiosResponse} from 'axios';

export interface Config {
	readonly backend?: string;
	readonly frontend: string;
}

type ConfigResponse = {
	readonly wishlist: Config;
};

export const getConfig = async (): Promise<Config | undefined> => {
	if (process.env.NODE_ENV !== 'production') {
		return undefined;
	}

	try {
		const response: AxiosResponse<ConfigResponse> =
			await axios.get<ConfigResponse>('https://data.andret.eu');
		return response.data.wishlist;
	} catch (error) {
		console.error('Error fetching production config:', error);
		return undefined;
	}
};
