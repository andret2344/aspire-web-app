import apiInstance from './ApiInstance';
import {AxiosResponse, isAxiosError} from 'axios';
import {WishlistItem} from '../Entity/WishlistItem';

export const getWishlistItems = async (): Promise<WishlistItem[]> => {
	try {
		const result: AxiosResponse<WishlistItem[]> =
			await apiInstance.get<WishlistItem[]>('/wishlist');
		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
		return [];
	}
};
