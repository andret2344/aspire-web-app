import {WishList, WishListDto} from '../Entity/WishList';
import {AxiosResponse, isAxiosError} from 'axios';
import apiInstance from './ApiInstance';
import {mapWishlistItem} from '../Entity/WishlistItem';

export const getWishlists = async (): Promise<WishList[]> => {
	try {
		const result: AxiosResponse<WishListDto[]> =
			await apiInstance.get<WishListDto[]>('/wishlist');
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
		const result: AxiosResponse<WishListDto> =
			await apiInstance.get<WishListDto>(`/wishlist/${id}`);
		return mapWishlist(result.data);
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		return null;
	}
};

export const addWishlist = async (name: string): Promise<WishList | null> => {
	try {
		const result = await apiInstance.post('/wishlist', {
			name
		});
		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		return null;
	}
};

const mapWishlist = (wishlist: WishListDto): WishList => {
	return {
		...wishlist,
		wishlistItems: wishlist.wishlist_items.map(mapWishlistItem)
	};
};
