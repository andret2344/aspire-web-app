import * as WishlistItemService from '@service/WishlistItemService';

export const mockedUpdateWishlistItem: jest.Mock = jest.fn();
export const mockedAddWishlistItem: jest.Mock = jest.fn();
export const mockedRemoveWishlistItem: jest.Mock = jest.fn();
export const mockedGetWishlistHiddenItems: jest.Mock = jest.fn();

jest.mock('@service/WishlistItemService', () => ({
	...jest.requireActual<typeof WishlistItemService>('@service/WishlistItemService'),
	updateWishlistItem: mockedUpdateWishlistItem,
	addWishlistItem: mockedAddWishlistItem,
	removeWishlistItem: mockedRemoveWishlistItem,
	getWishlistHiddenItems: mockedGetWishlistHiddenItems
}));
