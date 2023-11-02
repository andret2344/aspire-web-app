import axios from 'axios';
import {getToken, refreshToken} from './AuthService';

const baseUrl: string | undefined = process.env.REACT_APP_API_URL;

const apiInstance = axios.create({
	baseURL: `${baseUrl}/api`,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

apiInstance.interceptors.request.use(async (config) => {
	const token = getToken();
	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}
	return config;
});

apiInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			const newToken = await refreshToken();
			if (newToken) {
				error.config.headers['Authorization'] = `Bearer ${newToken}`;
				return apiInstance(error.config);
			}
		}
		throw error;
	}
);

export default apiInstance;
