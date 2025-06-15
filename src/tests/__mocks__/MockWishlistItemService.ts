import * as WishlistItemService from '../../main/Services/WishlistItemService';

export const mockedEditWishlistItem = jest.fn();
export const mockedAddWishlistItem = jest.fn();
export const mockedRemoveWishlistItem = jest.fn();
export const mockedGetWishlistHiddenItems = jest.fn();

jest.mock('../../main/Services/WishlistItemService', () => ({
	...jest.requireActual<typeof WishlistItemService>(
		'../../main/Services/WishlistItemService'
	),
	editWishlistItem: mockedEditWishlistItem,
	addWishlistItem: mockedAddWishlistItem,
	removeWishlistItem: mockedRemoveWishlistItem,
	getWishlistHiddenItems: mockedGetWishlistHiddenItems
}));
