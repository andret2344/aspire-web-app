import {WishList, WishListDto} from '@entity/WishList';
import axios, {AxiosResponse} from 'axios';
import apiInstance, {getApiConfig} from './ApiInstance';
import {requestConfig} from './AuthService';

export async function getWishlists(): Promise<WishListDto[]> {
	const result: AxiosResponse<WishListDto[]> =
		await apiInstance.get<WishListDto[]>('/wishlist');
	return result.data;
}

export async function getWishlist(id: number): Promise<WishListDto> {
	const result: AxiosResponse<WishListDto> =
		await apiInstance.get<WishListDto>(`/wishlist/${id}`);
	return result.data;
}

export async function getReadonlyWishlistByUUID(
	uuid: string
): Promise<WishListDto> {
	const baseUrl: string = getApiConfig().backend;
	const result: AxiosResponse<WishListDto> = await axios.get<WishListDto>(
		`${baseUrl}/wishlist/by_uuid/${uuid}`,
		requestConfig
	);
	return result.data;
}

export async function addWishlist(name: string): Promise<WishList> {
	const result: AxiosResponse<WishList> = await apiInstance.post(
		'/wishlist',
		{
			name
		}
	);
	return result.data;
}

export async function setWishlistPassword(
	id: number,
	password: string
): Promise<string> {
	const result: AxiosResponse<string> = await apiInstance.post(
		`/wishlist/${id}/set_access_code`,
		{
			access_code: password
		}
	);
	return result.data;
}

export async function removeWishlist(id: number): Promise<void> {
	await apiInstance.delete(`/wishlist/${id}`);
}

export async function updateWishlistName(
	id: number,
	name: string
): Promise<WishList | null> {
	const result: AxiosResponse<WishList | null> = await apiInstance.put(
		`/wishlist/${id}`,
		{
			name
		}
	);

	return result.data;
}
