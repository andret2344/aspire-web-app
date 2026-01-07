import {AxiosResponse} from 'axios';
import {mapWishlistItemFromDto, WishlistItem, WishlistItemDto} from '@entity/WishlistItem';
import apiInstance from './ApiInstance';

function getWishlistItemsUrl(wishlistId: number, id: number | undefined = undefined): string {
	if (id) {
		return `/wishlists/${wishlistId}/items/${id}`;
	}
	return `/wishlists/${wishlistId}/items`;
}

export async function getWishlistHiddenItems(uuid: string, password: string): Promise<WishlistItem[]> {
	const result: AxiosResponse<WishlistItemDto[]> = await apiInstance.get(`/hidden_items?uuid=${uuid}`, {
		headers: {
			'Access-Code': password
		}
	});
	return result.data.map(mapWishlistItemFromDto);
}

export async function addWishlistItem(wishlistId: number, item: Omit<WishlistItemDto, 'id'>): Promise<WishlistItemDto> {
	const result: AxiosResponse<WishlistItemDto> = await apiInstance.post(getWishlistItemsUrl(wishlistId), item);
	return result.data;
}

export async function updateWishlistItem(wishlistId: number, item: WishlistItemDto): Promise<WishlistItemDto> {
	const {id, ...rest} = item;
	const result: AxiosResponse<WishlistItemDto> = await apiInstance.put(getWishlistItemsUrl(wishlistId, id), rest);
	return result.data;
}

export async function removeWishlistItem(wishlistId: number, id: number): Promise<void> {
	return apiInstance.delete(getWishlistItemsUrl(wishlistId, id));
}
