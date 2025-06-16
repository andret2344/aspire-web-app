import {WishList, WishListDto} from '../../main/Entity/WishList';
import {WishlistItem, WishlistItemDto} from '../../main/Entity/WishlistItem';

// for future use
export function generateWishlistTestData(...itemsCount: number[]): WishList[] {
	return itemsCount.map(
		(itemsCount: number, currentId: number): WishList => ({
			id: currentId,
			uuid: `b838027b-9177-43d6-918e-${String(currentId).padStart(12, '0')}`,
			name: `Mock Wishlist ${currentId}`,
			wishlistItems: Array.from(Array(itemsCount).keys()).map(
				(id: number): WishlistItem => ({
					id,
					wishlistId: currentId,
					description: `Check out this link: https://example.com/${currentId}/${id}`,
					name: `Item ${id}`,
					priorityId: 3,
					hidden: false
				})
			),
			hasPassword: false
		})
	);
}

export function getSampleWishlistDto(): WishListDto {
	return {
		id: 1,
		uuid: 'random-uuid',
		name: 'Mock Wishlist',
		wishlist_items: [
			{
				id: 1,
				wishlist_id: 1,
				description: 'test description',
				name: 'Item 1',
				priority_id: 3,
				hidden: false
			}
		],
		has_password: false
	};
}

export function getSampleWishlist(): WishList {
	return {
		id: 1,
		uuid: 'random-uuid',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'test description',
				name: 'Item 1',
				priorityId: 3,
				hidden: false
			}
		],
		hasPassword: false
	};
}

export function getSampleWishlistItemDto(name?: string): WishlistItemDto {
	return {
		id: 1,
		wishlist_id: 1,
		description: name ?? 'Item description',
		name: 'Item 1',
		priority_id: 3,
		hidden: false
	};
}
