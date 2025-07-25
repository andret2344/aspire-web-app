import apiInstance from './ApiInstance';
import {
	mapWishlistItemFromDto,
	WishlistItem,
	WishlistItemDto
} from '../Entity/WishlistItem';
import {AxiosResponse} from 'axios';

export async function getWishlistHiddenItems(
	id: number,
	password: string
): Promise<WishlistItem[]> {
	const result: AxiosResponse<WishlistItemDto[]> = await apiInstance.get(
		`/${id}/wishlistitem/hidden_items`,
		{headers: {'Access-Code': password}}
	);
	return result.data.map(mapWishlistItemFromDto);
}

export async function addWishlistItem(
	wishlistId: number,
	item: Omit<WishlistItemDto, 'id'>
): Promise<WishlistItemDto> {
	const result: AxiosResponse<WishlistItemDto> = await apiInstance.post(
		`/${wishlistId}/wishlistitem`,
		item
	);
	return result.data;
}

export async function updateWishlistItem(
	wishlistId: number,
	item: WishlistItemDto
): Promise<WishlistItemDto> {
	const {id, ...rest} = item;
	const result: AxiosResponse<WishlistItemDto> = await apiInstance.put(
		`/${wishlistId}/wishlistitem/${id}`,
		rest
	);
	return result.data;
}

export async function removeWishlistItem(
	wishlistId: number,
	wishlistItemId: number
): Promise<void> {
	return apiInstance.delete(`/${wishlistId}/wishlistitem/${wishlistItemId}`);
}
