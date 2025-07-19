export interface WishlistItem {
	readonly id: number;
	readonly name: string;
	readonly description: string;
	readonly priorityId: number;
	readonly hidden: boolean;
}

export interface WishlistItemDto {
	readonly id: number;
	readonly name: string;
	readonly description: string;
	readonly priority_id: number;
	readonly hidden: boolean;
}

export function mapWishlistItemFromDto(
	wishlistItem: WishlistItemDto
): WishlistItem {
	const {priority_id, ...rest} = wishlistItem;
	return {
		...rest,
		priorityId: priority_id
	};
}

export function mapWishlistItemToDto(
	wishlistItem: WishlistItem,
	overrides: Partial<WishlistItemDto>
): WishlistItemDto {
	const {priorityId, ...rest} = wishlistItem;
	return {
		...rest,
		priority_id: priorityId,
		...overrides
	};
}
