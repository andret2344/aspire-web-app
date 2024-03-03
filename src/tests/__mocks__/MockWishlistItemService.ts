import * as WishlistItemService from '../../../src/Services/WishlistItemService';

export const mockedEditWishlistItem = jest.fn();
export const mockedAddWishlistItem = jest.fn();
export const mockedRemoveWishlistItem = jest.fn();

jest.mock('../../../src/Services/WishlistItemService', () => ({
	...jest.requireActual<typeof WishlistItemService>(
		'../../../src/Services/WishlistItemService'
	),
	editWishlistItem: mockedEditWishlistItem,
	addWishlistItem: mockedAddWishlistItem,
	removeWishlistItem: mockedRemoveWishlistItem
}));
