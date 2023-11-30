import axios from 'axios';

interface Config {
	readonly backend: string;
}

export const getConfig = async (): Promise<string | undefined> => {
	if (process.env.NODE_ENV !== 'production') {
		return process.env.REACT_API_URL;
	}

	try {
		const response = await axios.get<{wishlist: Config}>(
			'https://data.andret.eu'
		);
		return `https://${response.data.wishlist.backend}/api`;
	} catch (error) {
		console.error('Error fetching production config:', error);
		return process.env.REACT_API_URL;
	}
};
