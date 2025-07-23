import {WishList, WishListDto} from '../../main/Entity/WishList';
import {WishlistItem, WishlistItemDto} from '../../main/Entity/WishlistItem';

export const GENERIC_UUID: string = 'b838027b-9177-43d6-918e-67917f1d9b15';

export function getSampleWishlist(overrides: Partial<WishList> = {}): WishList {
	return {
		id: 1,
		uuid: GENERIC_UUID,
		name: 'Mock Wishlist',
		wishlistItems: [getSampleWishlistItem()],
		hasPassword: false,
		...overrides
	};
}

export function getSampleWishlistDto(
	overrides: Partial<WishListDto> = {}
): WishListDto {
	return {
		id: 1,
		uuid: GENERIC_UUID,
		name: 'Mock Wishlist',
		wishlist_items: [getSampleWishlistItemDto()],
		has_password: false,
		...overrides
	};
}

export function getSampleWishlistItemDto(
	overrides: Partial<WishlistItemDto> = {}
): WishlistItemDto {
	return {
		id: 1,
		name: 'Item name',
		description: '<p>Item description</p>',
		priority_id: 1,
		hidden: false,
		...overrides
	};
}

export function getSampleWishlistItemDtoWithoutId(
	overrides: Partial<Omit<WishlistItemDto, 'id'>> = {}
): Omit<WishlistItemDto, 'id'> {
	return {
		name: 'Item name',
		description: '<p>Item description</p>',
		priority_id: 1,
		hidden: false,
		...overrides
	};
}

export function getSampleWishlistItem(
	overrides: Partial<WishlistItem> = {}
): WishlistItem {
	return {
		id: 1,
		name: 'Item name',
		description: '<p>Item description</p>',
		priorityId: 1,
		hidden: false,
		...overrides
	};
}
