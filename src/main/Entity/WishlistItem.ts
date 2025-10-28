export interface WishlistItem {
	readonly id: number;
	readonly name: string;
	readonly description: string;
	readonly priority: number;
	readonly hidden: boolean;
}

export interface WishlistItemDto {
	readonly id: number;
	readonly name: string;
	readonly description: string;
	readonly priority: number;
	readonly hidden: boolean;
}

export function mapWishlistItemFromDto(
	wishlistItem: WishlistItemDto
): WishlistItem {
	const {...rest} = wishlistItem;
	return {...rest};
}

export function mapWishlistItemToDto(
	wishlistItem: WishlistItem,
	overrides: Partial<WishlistItemDto> = {}
): WishlistItemDto {
	const {...rest} = wishlistItem;
	return {...rest, ...overrides};
}
