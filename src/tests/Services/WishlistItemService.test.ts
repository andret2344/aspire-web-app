import MockAdapter from 'axios-mock-adapter';
import apiInstance from '../../Services/ApiInstance';
import {waitFor} from '@testing-library/react';
import {WishlistItemDto} from '../../Entity/WishlistItem';
import {
	addWishlistItem,
	editWishlistItem,
	getWishlistHiddenItems,
	removeWishlistItem
} from '../../Services/WishlistItemService';

describe('WishListItemService', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockWishlistItemDto: WishlistItemDto = {
		id: 1,
		wishlist_id: 1,
		description: 'test description',
		name: 'Item 1',
		priority_id: 3,
		hidden: false
	};

	const mockUpdatedWishlistItemDto: WishlistItemDto = {
		id: 1,
		wishlist_id: 1,
		description: 'updated test description',
		name: 'updated',
		priority_id: 3,
		hidden: false
	};

	test('add wishlist item', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const name = 'test name';
		const description = 'test description';
		const priorityId = 1;
		const hidden = false;
		mock.onPost(`/${wishlistId}/wishlistitem`).reply(
			200,
			mockWishlistItemDto
		);

		// act
		await waitFor(
			(): Promise<WishlistItemDto | null> =>
				addWishlistItem(
					wishlistId,
					name,
					description,
					priorityId,
					hidden
				)
		).then((wishlistItemDto: WishlistItemDto | null): void => {
			// assert
			expect(wishlistItemDto).toStrictEqual(mockWishlistItemDto);
		});
	});

	test('get wishlist hidden items', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const password = 'test';
		mock.onGet(`/${wishlistId}/wishlistitem/hidden_items`).reply(200, []);

		// act
		const result = await getWishlistHiddenItems(wishlistId, password);

		// assert
		expect(result).toEqual([]);
	});

	test('add wishlist item rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const name = 'test name';
		const description = 'test description';
		const priorityId = 1;
		const hidden = false;
		mock.onPost(`/${wishlistId}/wishlistitem`).reply(500);

		// act
		await waitFor(
			(): Promise<WishlistItemDto | null> =>
				addWishlistItem(
					wishlistId,
					name,
					description,
					priorityId,
					hidden
				)
		).then((result: WishlistItemDto | null): void => {
			// assert
			expect(result).toBeNull();
		});
	});

	test('edit wishlist item', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		const name = 'test name';
		const description = 'test description';
		const priorityId = 1;
		const hidden = false;
		mock.onPut(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			200,
			mockUpdatedWishlistItemDto
		);

		// act
		await waitFor(
			(): Promise<WishlistItemDto | null> =>
				editWishlistItem(
					wishlistId,
					wishlistItemId,
					name,
					description,
					priorityId,
					hidden
				)
		).then((wishlistItemDto: WishlistItemDto | null): void => {
			// assert
			expect(wishlistItemDto).toStrictEqual(mockUpdatedWishlistItemDto);
		});
	});

	test('edit wishlist item rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		const name = 'test name';
		const description = 'test description';
		const priorityId = 1;
		const hidden = false;
		mock.onPut(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			500,
			mockUpdatedWishlistItemDto
		);
		const logSpy = jest.spyOn(console, 'error');

		// act
		await waitFor(
			(): Promise<WishlistItemDto | null> =>
				editWishlistItem(
					wishlistId,
					wishlistItemId,
					name,
					description,
					priorityId,
					hidden
				)
		).then((): void => {
			// assert
			expect(logSpy).toHaveBeenCalled();
		});
	});

	test('remove wishlist item', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		mock.onDelete(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			200
		);

		// act
		await waitFor(
			(): Promise<void> => removeWishlistItem(wishlistId, wishlistItemId)
		).then((): void => {
			// assert
			expect(mock.history.delete.length).toBe(1);
			expect(mock.history.delete[0].url).toEqual(
				`/${wishlistId}/wishlistitem/${wishlistItemId}`
			);
		});
	});

	test('remove wishlist item rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		mock.onDelete(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			500
		);
		const logSpy = jest.spyOn(console, 'error');

		// act
		await waitFor(
			(): Promise<void> => removeWishlistItem(wishlistId, wishlistItemId)
		).then((): void => {
			// assert
			expect(logSpy).toHaveBeenCalled();
		});
	});
});
