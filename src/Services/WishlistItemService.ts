import apiInstance from './ApiInstance';
import {WishlistItem} from '../Entity/WishlistItem';
import {AxiosResponse, isAxiosError} from 'axios';

export const getWishlistHiddenItems = async (
	id: number
): Promise<WishlistItem[]> => {
	const result: AxiosResponse<WishlistItem[]> = await apiInstance.get<
		WishlistItem[]
	>(`/wishlist/${id}/hidden_items`);
	return result.data;
};

export const addWishlistItem = async (
	wishlistId: number,
	name: string,
	description: string,
	priorityId: number | string,
	hidden: boolean
): Promise<WishlistItem | null> => {
	try {
		const result = await apiInstance.post(`/${wishlistId}/wishlistitem`, {
			name,
			description,
			priority_id: priorityId,
			hidden
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
	priorityId: number | string,
	hidden: boolean
): Promise<WishlistItem | null> => {
	try {
		const result = await apiInstance.put(
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
