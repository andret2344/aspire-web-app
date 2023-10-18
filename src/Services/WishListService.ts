import axios, { isAxiosError } from 'axios';
import { getToken } from './AuthService';
import { WishList } from '../Entity/WishList';

const axiosInstance = axios.create();

export const getWishlists = async (): Promise<WishList[]> => {
	const token = await getToken();

	try {
		const result = await axiosInstance.get<WishList[]>(
			'http://localhost:8080/api/wishlist/',
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
		return [];
	}
};
