import {WishList, WishListDto} from '../Entity/WishList';
import axios, {AxiosResponse, isAxiosError} from 'axios';
import apiInstance, {baseUrl} from './ApiInstance';
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

export const getReadonlyWishlistByUUID = async (
	uuid: string
): Promise<WishList | null> => {
	try {
		const result: AxiosResponse<WishListDto> = await axios.get<WishListDto>(
			`${baseUrl}/api/wishlist/by_uuid/${uuid}`
		);
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

export const removeWishlist = async (id?: number): Promise<void> => {
	if (id) {
		try {
			await apiInstance.delete(`/wishlist/${id}`);
		} catch (err) {
			if (isAxiosError(err)) {
				console.error(err.response);
			}
		}
	}
};

export const updateWishlistName = async (
	id?: number,
	name?: string
): Promise<WishList | null> => {
	if (!(id || name)) {
		return null;
	}
	try {
		const result = await apiInstance.put(`/wishlist/${id}`, {
			name
		});

		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
	}
	return null;
};

const mapWishlist = (wishlist: WishListDto): WishList => {
	const {wishlist_items, ...rest} = wishlist;
	return {
		...rest,
		wishlistItems: wishlist_items.map(mapWishlistItem)
	};
};
