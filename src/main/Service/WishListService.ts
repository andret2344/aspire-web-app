import {WishList, WishListDto} from '@entity/WishList';
import axios, {AxiosResponse} from 'axios';
import apiInstance, {getApiConfig} from './ApiInstance';
import {requestConfig} from './AuthService';

function getWishlistsUrl(id?: number = undefined): string {
	if (id) {
		return `/wishlists/${id}`;
	}
	return '/wishlists';
}

export async function getWishlists(): Promise<WishListDto[]> {
	const result: AxiosResponse<WishListDto[]> =
		await apiInstance.get<WishListDto[]>(getWishlistsUrl());
	return result.data;
}

export async function getWishlist(id: number): Promise<WishListDto> {
	const result: AxiosResponse<WishListDto> =
		await apiInstance.get<WishListDto>(getWishlistsUrl(id));
	return result.data;
}

export async function getReadonlyWishlistByUUID(
	uuid: string
): Promise<WishListDto> {
	const baseUrl: string = getApiConfig().backend;
	const result: AxiosResponse<WishListDto> = await axios.get<WishListDto>(
		`${baseUrl}/wishlists?uuid=${uuid}`,
		requestConfig
	);
	return result.data;
}

export async function addWishlist(name: string): Promise<WishListDto> {
	const result: AxiosResponse<WishListDto> = await apiInstance.post(
		getWishlistsUrl(),
		{name}
	);
	return result.data;
}

export async function setWishlistPassword(
	id: number,
	password: string
): Promise<number> {
	const result: AxiosResponse<string> = await apiInstance.post(
		`${getWishlistsUrl(id)}/set_access_code`,
		{access_code: password}
	);
	return result.status;
}

export async function removeWishlist(id: number): Promise<void> {
	await apiInstance.delete(getWishlistsUrl(id));
}

export async function updateWishlistName(
	id: number,
	name: string
): Promise<WishList | null> {
	const result: AxiosResponse<WishList | null> = await apiInstance.put(
		getWishlistsUrl(id),
		{name}
	);

	return result.data;
}
