import { AxiosResponse, isAxiosError } from 'axios';
import { WishList } from '../Entity/WishList';
import apiInstance from './ApiInstance';

export const getWishlists = async (): Promise<WishList[]> => {
	try {
		const result: AxiosResponse<WishList[]> = await apiInstance.get<WishList[]>('/wishlist/');
		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
		return [];
	}
};
