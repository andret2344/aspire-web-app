import {WishList, WishListDto} from '../../main/Entity/WishList';
import {WishlistItem, WishlistItemDto} from '../../main/Entity/WishlistItem';

export function getSampleWishlist(
	overrides: Partial<WishList> = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				description: 'Check out this link: https://example.com',
				name: 'Item 1',
				priorityId: 3,
				hidden: false
			}
		],
		hasPassword: false
	}
): WishList {
	return {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				description: 'Check out this link: https://example.com',
				name: 'Item 1',
				priorityId: 3,
				hidden: false
			}
		],
		hasPassword: false,
		...overrides
	};
}

export function getSampleWishlistDto(
	overrides: Partial<WishListDto> = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlist_items: [
			{
				id: 1,
				description: 'Check out this link: https://example.com',
				name: 'Item 1',
				priority_id: 3,
				hidden: false
			}
		],
		has_password: false
	}
): WishListDto {
	return {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlist_items: [
			{
				id: 1,
				description: 'Check out this link: https://example.com',
				name: 'Item 1',
				priority_id: 3,
				hidden: false
			}
		],
		has_password: false,
		...overrides
	};
}

export function getSampleWishlistItemDto(
	overrides: Partial<WishlistItemDto> = {
		id: 1,
		name: 'Item name',
		description: 'Item description',
		priority_id: 1,
		hidden: false
	}
): WishlistItemDto {
	return {
		id: 1,
		name: 'Item 1',
		description: 'Item description',
		priority_id: 3,
		hidden: false,
		...overrides
	};
}

export function getSampleWishlistItemDtoWithoutId(
	overrides: Partial<Omit<WishlistItemDto, 'id'>> = {
		name: 'Item name',
		description: 'Item description',
		priority_id: 1,
		hidden: false
	}
): Omit<WishlistItemDto, 'id'> {
	return {
		name: 'Item 1',
		description: 'Item description',
		priority_id: 3,
		hidden: false,
		...overrides
	};
}

export function getSampleWishlistItem(
	overrides: Partial<WishlistItem> = {
		id: 1,
		name: 'Item name',
		description: 'Item description',
		priorityId: 1,
		hidden: false
	}
): WishlistItem {
	return {
		id: 1,
		name: 'Item 1',
		description: 'Item description',
		priorityId: 3,
		hidden: false,
		...overrides
	};
}
