export interface WishlistItem {
	readonly id: number;
	readonly wishlistId: number;
	readonly name: string;
	readonly description: string;
	readonly priorityId: number;
}

export interface WishlistItemDto {
	readonly id: number;
	readonly wishlistId: number;
	readonly name: string;
	readonly description: string;
	readonly priority_id: number;
}

export const mapWishlistItem = (
	wishlistItem: WishlistItemDto
): WishlistItem => {
	return {
		...wishlistItem,
		priorityId: wishlistItem.priority_id
	};
};
