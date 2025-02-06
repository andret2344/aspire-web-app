export interface WishlistItem {
	readonly id: number;
	readonly wishlistId: number;
	readonly name: string;
	readonly description: string;
	readonly priorityId: number;
	readonly hidden: boolean | undefined;
}

export interface WishlistItemDto {
	readonly id: number;
	readonly wishlist_id: number;
	readonly name: string;
	readonly description: string;
	readonly priority_id: number;
	readonly hidden: boolean;
}

export function mapWishlistItem(wishlistItem: WishlistItemDto): WishlistItem {
	const {priority_id, wishlist_id, ...rest} = wishlistItem;
	return {
		...rest,
		wishlistId: wishlist_id,
		priorityId: priority_id
	};
}
