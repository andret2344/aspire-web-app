import apiInstance from './ApiInstance';
import {WishlistItem} from '../Entity/WishlistItem';
import {isAxiosError} from 'axios';

export const addWishlistItem = async (
	wishlistId: number,
	name: string,
	description: string,
	priorityId: number | string
): Promise<WishlistItem | null> => {
	try {
		const result = await apiInstance.post(`/${wishlistId}/wishlistitem`, {
			name,
			description,
			priority_id: priorityId
		});
		return result.data;
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
		return null;
	}
};

export const editWishlistItem = async (
	wishlistId: number,
	wishlistItemId: number,
	name: string,
	description: string,
	priorityId: number | string
): Promise<WishlistItem | null> => {
	try {
		const result = await apiInstance.put(
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
};

export const removeWishlistItem = async (
	wishlistId: number,
	wishlistItemId: number
): Promise<void> => {
	try {
		await apiInstance.delete(
			`/${wishlistId}/wishlistitem/${wishlistItemId}`
		);
	} catch (err) {
		if (isAxiosError(err)) {
			console.error(err.response);
		}
	}
};
