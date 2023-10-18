import axios from 'axios';

const TOKEN = 'token';
export const logIn = async (email: string, password: string) => {
	if (!email || !password) {
		return null;
	}

	try {
		const result = await axios.post(
			'http://localhost:8080/api/account/login/',
			{
				email,
				password,
			},
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			}
		);

		saveToken(result.data.access);
		return result.status;
	} catch (err) {
		return 401;
	}
};

const saveToken = (token: string) => {
	localStorage.setItem(TOKEN, token);
};

export const getToken = () => {
	return getItemFromStorage(TOKEN);
};

export const getItemFromStorage = (key: string): string | null => {
	return localStorage.getItem(key);
};
