import axios, {AxiosResponse} from 'axios';

const URL_DISCOVERY = `https://discovery.andret.eu`;

export interface Config {
	readonly backend: string;
	readonly frontend: string;
}

type ConfigResponse = {
	readonly data: Config;
};

export async function getConfig(): Promise<Config | undefined> {
	const productionMode: boolean = process.env.NODE_ENV === 'production';
	if (!productionMode) {
		return undefined;
	}

	const token: string | undefined = process.env.REACT_APP_API_TOKEN;

	const response: AxiosResponse<ConfigResponse> = await axios.get<ConfigResponse>(`${URL_DISCOVERY}?uuid=${token}`);
	return response.data.data;
}
