import {WishlistItem} from './WishlistItem';

export interface WishList {
	readonly id: number;
	readonly uuid: string;
	readonly name: string;
	readonly wishlistItems: WishlistItem[];
}

export interface WishListDto {
	readonly id: number;
	readonly uuid: string;
	readonly name: string;
	readonly wishlist_items: WishlistItem[];
}
