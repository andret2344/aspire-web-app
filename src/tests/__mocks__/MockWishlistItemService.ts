import * as WishlistItemService from '../../main/Service/WishlistItemService';

export const mockedUpdateWishlistItem: jest.Mock = jest.fn();
export const mockedAddWishlistItem: jest.Mock = jest.fn();
export const mockedRemoveWishlistItem: jest.Mock = jest.fn();
export const mockedGetWishlistHiddenItems: jest.Mock = jest.fn();

jest.mock('../../main/Service/WishlistItemService', () => ({
	...jest.requireActual<typeof WishlistItemService>(
		'../../main/Service/WishlistItemService'
	),
	updateWishlistItem: mockedUpdateWishlistItem,
	addWishlistItem: mockedAddWishlistItem,
	removeWishlistItem: mockedRemoveWishlistItem,
	getWishlistHiddenItems: mockedGetWishlistHiddenItems
}));
