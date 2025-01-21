import * as WishlistService from '../../../src/Services/WishListService';

export const mockedGetReadonlyWishlistByUUID = jest.fn();
export const mockedGetWishlists = jest.fn();
export const mockedGetWishlist = jest.fn();
export const mockedUpdateWishlistName = jest.fn();
export const mockedAddWishlist = jest.fn();
export const mockedRemoveWishlist = jest.fn();
export const mockedSetWishlistPassword = jest.fn();

jest.mock('../../../src/Services/WishListService', () => ({
	...jest.requireActual<typeof WishlistService>(
		'../../../src/Services/WishListService'
	),
	getReadonlyWishlistByUUID: mockedGetReadonlyWishlistByUUID,
	getWishlists: mockedGetWishlists,
	getWishlist: mockedGetWishlist,
	updateWishlistName: mockedUpdateWishlistName,
	addWishlist: mockedAddWishlist,
	removeWishlist: mockedRemoveWishlist,
	setWishlistPassword: mockedSetWishlistPassword
}));
