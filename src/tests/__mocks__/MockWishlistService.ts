import * as WishlistService from '../../main/Service/WishListService';

export const mockedGetReadonlyWishlistByUUID: jest.Mock = jest.fn();
export const mockedGetWishlists: jest.Mock = jest.fn();
export const mockedGetWishlist: jest.Mock = jest.fn();
export const mockedUpdateWishlistName: jest.Mock = jest.fn();
export const mockedAddWishlist: jest.Mock = jest.fn();
export const mockedRemoveWishlist: jest.Mock = jest.fn();
export const mockedSetWishlistPassword: jest.Mock = jest.fn();

jest.mock('../../main/Service/WishListService', () => ({
	...jest.requireActual<typeof WishlistService>(
		'../../main/Service/WishListService'
	),
	getReadonlyWishlistByUUID: mockedGetReadonlyWishlistByUUID,
	getWishlists: mockedGetWishlists,
	getWishlist: mockedGetWishlist,
	updateWishlistName: mockedUpdateWishlistName,
	addWishlist: mockedAddWishlist,
	removeWishlist: mockedRemoveWishlist,
	setWishlistPassword: mockedSetWishlistPassword
}));
