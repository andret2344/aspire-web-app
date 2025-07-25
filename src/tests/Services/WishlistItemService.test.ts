import MockAdapter from 'axios-mock-adapter';
import apiInstance from '@service/ApiInstance';
import {WishlistItem, WishlistItemDto} from '@entity/WishlistItem';
import {
	addWishlistItem,
	getWishlistHiddenItems,
	removeWishlistItem,
	updateWishlistItem
} from '@service/WishlistItemService';
import {
	getSampleWishlistItemDto,
	getSampleWishlistItemDtoWithoutId
} from '../__utils__/DataFactory';
import {isAxiosError} from 'axios';

describe('WishListItemService', (): void => {
	beforeEach((): void => localStorage.clear());

	it('adds wishlist item', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;

		mock.onPost(`/${wishlistId}/wishlistitem`).reply(
			200,
			getSampleWishlistItemDto()
		);

		// act
		addWishlistItem(wishlistId, getSampleWishlistItemDtoWithoutId()).then(
			(wishlistItemDto: WishlistItemDto | null): void => {
				// assert
				expect(wishlistItemDto).toStrictEqual(
					getSampleWishlistItemDto()
				);
			}
		);
	});

	it('gets wishlist hidden items', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const password = 'test';
		mock.onGet(`/${wishlistId}/wishlistitem/hidden_items`).reply(200, []);

		// act
		const result: WishlistItem[] = await getWishlistHiddenItems(
			wishlistId,
			password
		);

		// assert
		expect(result).toEqual([]);
	});

	it('adds wishlist item with fail', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		mock.onPost(`/${wishlistId}/wishlistitem`).reply(500);

		// act
		await addWishlistItem(wishlistId, getSampleWishlistItemDtoWithoutId())
			// assert
			.then((): void => fail('Should not reach this point'))
			.catch((error: Error): void =>
				expect(isAxiosError(error)).toBeTruthy()
			);
	});

	it('edits wishlist item with success', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		mock.onPut(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			200,
			getSampleWishlistItemDto({name: 'updated name'})
		);

		// act
		await updateWishlistItem(wishlistId, getSampleWishlistItemDto()).catch(
			(): void => fail('Should not reach this point')
		);
	});

	it('edits wishlist item with fail', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		mock.onPut(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			500,
			getSampleWishlistItemDto({name: 'updated name'})
		);

		// act
		await updateWishlistItem(wishlistId, getSampleWishlistItemDto())
			// assert
			.then((): void => fail('Should not reach this point'))
			.catch((error: Error): void =>
				expect(isAxiosError(error)).toBeTruthy()
			);
	});

	it('removes wishlist item with success', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		mock.onDelete(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			200
		);

		// act
		await removeWishlistItem(wishlistId, wishlistItemId).then((): void => {
			// assert
			expect(mock.history.delete.length).toBe(1);
			expect(mock.history.delete[0].url).toEqual(
				`/${wishlistId}/wishlistitem/${wishlistItemId}`
			);
		});
	});

	it('removes wishlist item with fail', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const wishlistItemId = 1;
		mock.onDelete(`/${wishlistId}/wishlistitem/${wishlistItemId}`).reply(
			500
		);

		// act
		await removeWishlistItem(wishlistId, wishlistItemId)
			// assert
			.then((): void => fail('Should not reach this point'))
			.catch((error: Error): void =>
				expect(isAxiosError(error)).toBeTruthy()
			);
	});
});
