import {WishList} from '../../Entity/WishList';
import {WishlistItem} from '../../Entity/WishlistItem';

export function getWishlistTestData(...itemsCount: number[]): WishList[] {
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
