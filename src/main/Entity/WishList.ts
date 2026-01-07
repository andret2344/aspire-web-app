import {
	mapWishlistItemFromDto,
	WishlistItem,
	WishlistItemDto
} from './WishlistItem';

export interface WishList {
	readonly id: number;
	readonly uuid: string;
	readonly name: string;
	readonly items: WishlistItem[];
	readonly hasPassword: boolean;
}

export interface WishListDto {
	readonly id: number;
	readonly uuid: string;
	readonly name: string;
	readonly items: WishlistItemDto[];
	readonly has_password: boolean;
}

export function mapWishlistArrayFromDto(wishlists: WishListDto[]): WishList[] {
	return wishlists.map(mapWishlistFromDto);
}

export function mapWishlistFromDto(wishlist: WishListDto): WishList {
	const {items, has_password, ...rest} = wishlist;
	return {
		...rest,
		items: items.map(mapWishlistItemFromDto),
		hasPassword: has_password
	};
}
