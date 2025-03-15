import {WishlistItem, WishlistItemDto} from './WishlistItem';

export interface WishList {
	readonly id: number;
	readonly uuid: string;
	readonly name: string;
	readonly wishlistItems: WishlistItem[];
	readonly hasPassword: boolean;
}

export interface WishListDto {
	readonly id: number;
	readonly uuid: string;
	readonly name: string;
	readonly wishlist_items: WishlistItemDto[];
	readonly has_password: boolean;
}
