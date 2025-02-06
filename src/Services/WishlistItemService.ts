import apiInstance from './ApiInstance';
import {WishlistItemDto} from '../Entity/WishlistItem';
import {AxiosResponse, isAxiosError} from 'axios';

export async function addWishlistItem(
	wishlistId: number,
	name: string,
	description: string,
	priorityId: number | string
): Promise<WishlistItemDto | null> {
	try {
		const result: AxiosResponse = await apiInstance.post(
			`/${wishlistId}/wishlistitem`,
			{
				name,
				description,
				priority_id: priorityId
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
	priorityId: number | string
): Promise<WishlistItemDto | null> {
	try {
		const result: AxiosResponse = await apiInstance.put(
			`/${wishlistId}/wishlistitem/${wishlistItemId}`,
			{
				name,
				description,
				priority_id: priorityId
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
