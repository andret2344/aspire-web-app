import MockAdapter from 'axios-mock-adapter';
import apiInstance from '../../main/Services/ApiInstance';
import {waitFor} from '@testing-library/react';
import {WishlistItemDto} from '../../main/Entity/WishlistItem';
import {
	addWishlistItem,
	editWishlistItem,
	getWishlistHiddenItems,
	removeWishlistItem
} from '../../main/Services/WishlistItemService';
import {getSampleWishlistItemDto} from '../__utils__/DataFactory';
import {isAxiosError} from 'axios';

describe('WishListItemService', (): void => {
	beforeEach((): void => localStorage.clear());

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
			getSampleWishlistItemDto()
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
			expect(wishlistItemDto).toStrictEqual(getSampleWishlistItemDto());
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
		)
			// assert
			.then((): void => fail('Should not reach this point'))
			.catch((error: Error): void =>
				expect(isAxiosError(error)).toBeTruthy()
			);
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
			getSampleWishlistItemDto('updated name')
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
			expect(wishlistItemDto).toStrictEqual(
				getSampleWishlistItemDto('updated name')
			);
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
			getSampleWishlistItemDto('updated name')
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
		)
			// assert
			.then((): void => fail('Should not reach this point'))
			.catch((error: Error): void =>
				expect(isAxiosError(error)).toBeTruthy()
			);
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

		// act
		await waitFor(
			(): Promise<void> => removeWishlistItem(wishlistId, wishlistItemId)
		)
			// assert
			.then((): void => fail('Should not reach this point'))
			.catch((error: Error): void =>
				expect(isAxiosError(error)).toBeTruthy()
			);
	});
});
