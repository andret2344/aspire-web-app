import apiInstance from './ApiInstance';
import {
	mapWishlistItem,
	WishlistItem,
	WishlistItemDto
} from '../Entity/WishlistItem';
import {AxiosResponse, isAxiosError} from 'axios';

export async function getWishlistHiddenItems(
	id: number,
	password: string
): Promise<WishlistItem[]> {
	const result: AxiosResponse<WishlistItemDto[]> = await apiInstance.get(
		`/${id}/wishlistitem/hidden_items`,
		{headers: {'Access-Code': password}}
	);
	return result.data.map(mapWishlistItem);
}

export async function addWishlistItem(
	wishlistId: number,
	name: string,
	description: string,
	priorityId: number,
	hidden?: boolean
): Promise<WishlistItem | null> {
	try {
		const result: AxiosResponse<WishlistItem> = await apiInstance.post(
			`/${wishlistId}/wishlistitem`,
			{
				name,
				description,
				priority_id: priorityId,
				hidden
			}
		);
		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		return null;
	}
}

export async function editWishlistItem(
	wishlistId: number,
	wishlistItemId: number,
	name: string,
	description: string,
	priorityId: number,
	hidden?: boolean
): Promise<WishlistItem | null> {
	try {
		const result: AxiosResponse<WishlistItem> = await apiInstance.put(
			`/${wishlistId}/wishlistitem/${wishlistItemId}`,
			{
				name,
				description,
				priority_id: priorityId,
				hidden
			}
		);
		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		return null;
	}
}

export async function removeWishlistItem(
	wishlistId: number,
	wishlistItemId: number
): Promise<void> {
	try {
		await apiInstance.delete(
			`/${wishlistId}/wishlistitem/${wishlistItemId}`
		);
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
	}
}
