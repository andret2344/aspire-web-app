import {WishList, WishListDto} from '../Entity/WishList';
import {AxiosResponse, isAxiosError} from 'axios';
import apiInstance from './ApiInstance';

export const getWishlists = async (): Promise<WishList[]> => {
	try {
		const result: AxiosResponse<WishListDto[]> =
			await apiInstance.get<WishListDto[]>('/wishlist/');
		return result.data.map(mapWishlist);
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
		return [];
	}
};

export const getWishlist = async (id: number): Promise<WishList | null> => {
	try {
		console.log('test ', id);
		const result: AxiosResponse<WishListDto> =
			await apiInstance.get<WishListDto>(`/wishlist/${id}/`);
		return mapWishlist(result.data);
	} catch (err) {
		console.log('test');
		if (isAxiosError(err)) {
			console.log('test', err.response);
		}
		console.error(err);
		return null;
	}
};

export const addWishlist = async (): Promise<WishList | null> => {
	try {
		const result = await apiInstance.post('/wishlist/');
		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		console.error(err);
		return null;
	}
};

const mapWishlist = (wishlist: WishListDto): WishList => {
	return {
		...wishlist,
		wishlistItems: wishlist.wishlist_items
	};
};
