import {WishList, WishListDto} from '../Entity/WishList';
import axios, {AxiosResponse} from 'axios';
import apiInstance, {getApiConfig} from './ApiInstance';
import {mapWishlistItem} from '../Entity/WishlistItem';
import {requestConfig} from './AuthService';

export async function getWishlists(): Promise<WishList[]> {
	const result: AxiosResponse<WishListDto[]> =
		await apiInstance.get<WishListDto[]>('/wishlist');
	return result.data.map(mapWishlist);
}

export async function getWishlist(id: number): Promise<WishList> {
	const result: AxiosResponse<WishListDto> =
		await apiInstance.get<WishListDto>(`/wishlist/${id}`);
	return mapWishlist(result.data);
}

export async function getReadonlyWishlistByUUID(
	uuid: string
): Promise<WishList> {
	const baseUrl: string = getApiConfig().backend;
	const result: AxiosResponse<WishListDto> = await axios.get<WishListDto>(
		`${baseUrl}/wishlist/by_uuid/${uuid}`,
		requestConfig
	);
	return mapWishlist(result.data);
}

export async function addWishlist(name: string): Promise<WishList> {
	const result = await apiInstance.post('/wishlist', {
		name
	});
	return result.data;
}

export async function removeWishlist(id: number): Promise<void> {
	await apiInstance.delete(`/wishlist/${id}`);
}

export async function updateWishlistName(
	id: number,
	name: string
): Promise<WishList | null> {
	const result = await apiInstance.put(`/wishlist/${id}`, {
		name
	});

	return result.data;
}

export function mapWishlist(wishlist: WishListDto): WishList {
	const {wishlist_items, ...rest} = wishlist;
	return {
		...rest,
		wishlistItems: wishlist_items.map(mapWishlistItem)
	};
}
