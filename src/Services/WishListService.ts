import {WishList, WishListDto} from '../Entity/WishList';
import axios, {AxiosResponse} from 'axios';
import apiInstance, {getBackendUrl} from './ApiInstance';
import {mapWishlistItem} from '../Entity/WishlistItem';
import {requestConfig} from './AuthService';

export const getWishlists = async (): Promise<WishList[]> => {
	const result: AxiosResponse<WishListDto[]> =
		await apiInstance.get<WishListDto[]>('/wishlist');
	return result.data.map(mapWishlist);
};

export const getWishlist = async (id: number): Promise<WishList> => {
	const result: AxiosResponse<WishListDto> =
		await apiInstance.get<WishListDto>(`/wishlist/${id}`);
	return mapWishlist(result.data);
};

export const getReadonlyWishlistByUUID = async (
	uuid: string
): Promise<WishList> => {
	const baseUrl = getBackendUrl();
	const result: AxiosResponse<WishListDto> = await axios.get<WishListDto>(
		`${baseUrl}/wishlist/by_uuid/${uuid}`,
		requestConfig
	);
	return mapWishlist(result.data);
};

export const addWishlist = async (name: string): Promise<WishList> => {
	const result = await apiInstance.post('/wishlist', {
		name
	});
	return result.data;
};

export const setWishlistPassword = async (
	id: number,
	password: string
): Promise<WishList> => {
	const result = await apiInstance.post(`/wishlist/${id}/set_access_code`, {
		access_code: password
	});
	return result.data;
};

export const removeWishlist = async (id: number): Promise<void> => {
	await apiInstance.delete(`/wishlist/${id}`);
};

export const updateWishlistName = async (
	id: number,
	name: string
): Promise<WishList | null> => {
	const result = await apiInstance.put(`/wishlist/${id}`, {
		name
	});

	return result.data;
};

export const mapWishlist = (wishlist: WishListDto): WishList => {
	const {wishlist_items, ...rest} = wishlist;
	return {
		...rest,
		wishlistItems: wishlist_items.map(mapWishlistItem)
	};
};
