import * as WishlistService from '../../main/Services/WishListService';

export const mockedGetReadonlyWishlistByUUID: jest.Mock = jest.fn();
export const mockedGetWishlists: jest.Mock = jest.fn();
export const mockedGetWishlist: jest.Mock = jest.fn();
export const mockedUpdateWishlistName: jest.Mock = jest.fn();
export const mockedAddWishlist: jest.Mock = jest.fn();
export const mockedRemoveWishlist: jest.Mock = jest.fn();
export const mockedSetWishlistPassword: jest.Mock = jest.fn();

jest.mock('../../main/Services/WishListService', () => ({
	...jest.requireActual<typeof WishlistService>(
		'../../main/Services/WishListService'
	),
	getReadonlyWishlistByUUID: mockedGetReadonlyWishlistByUUID,
	getWishlists: mockedGetWishlists,
	getWishlist: mockedGetWishlist,
	updateWishlistName: mockedUpdateWishlistName,
	addWishlist: mockedAddWishlist,
	removeWishlist: mockedRemoveWishlist,
	setWishlistPassword: mockedSetWishlistPassword
}));
