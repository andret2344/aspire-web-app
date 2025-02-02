import {
	addWishlist,
	getReadonlyWishlistByUUID,
	getWishlist,
	getWishlists,
	removeWishlist,
	updateWishlistName
} from '../../Services/WishListService';
import {waitFor} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import apiInstance, {getApiConfig} from '../../Services/ApiInstance';
import axios, {AxiosError} from 'axios';
import {WishList, WishListDto} from '../../Entity/WishList';
import {headers} from '../../Services/AuthService';

describe('WishListService', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockWishlistDto: WishListDto = {
		id: 1,
		uuid: 'random-uuid',
		name: 'Mock Wishlist',
		wishlist_items: [
			{
				id: 1,
				wishlist_id: 1,
				description: 'test description',
				name: 'Item 1',
				priority_id: 3
			}
		]
	};

	const mockWishlist: WishList = {
		id: 1,
		uuid: 'random-uuid',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'test description',
				name: 'Item 1',
				priorityId: 3
			}
		]
	};

	test('get wishlists', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlist').reply(200, [mockWishlistDto]);

		// act
		await waitFor(getWishlists).then((wishlists: WishList[]): void =>
			// assert
			expect(wishlists).toStrictEqual([mockWishlist])
		);
	});

	test('get wishlists rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlist').reply(500);

		// act
		await getWishlists().catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual(
				'Request failed with status code 500'
			);
		});
	});

	test('get wishlist by id', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlist/1').reply(200, mockWishlistDto);

		// act
		await getWishlist(1).then((wishlist: WishList | null): void => {
			// assert
			expect(wishlist).toEqual(mockWishlist);
		});
	});

	test('get wishlist by id rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlist/1').reply(500);

		// act
		await getWishlist(1).catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual(
				'Request failed with status code 500'
			);
		});
	});

	test('get readonly wishlist by uuid', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
		mock.onGet(`${baseUrl}/wishlist/by_uuid/uuid`, {headers}).reply(
			200,
			mockWishlistDto
		);

		// act
		await getReadonlyWishlistByUUID('uuid').then(
			(wishlist: WishList | null): void => {
				// assert
				expect(wishlist).toEqual(mockWishlist);
			}
		);
	});

	test('get readonly wishlist by uuid rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
		mock.onGet(`${baseUrl}/wishlist/by_uuid/uuid`, {headers}).reply(500);

		// act
		await getReadonlyWishlistByUUID('uuid').catch(
			(error: AxiosError): void => {
				// assert
				expect(error.message).toEqual(
					'Request failed with status code 500'
				);
			}
		);
	});

	test('add wishlist', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onPost('/wishlist').reply(200, mockWishlist);

		// act
		await waitFor((): Promise<WishList | null> => addWishlist('test')).then(
			(wishlist: WishList | null): void => {
				// assert
				expect(wishlist).toEqual(mockWishlist);
			}
		);
	});

	test('add wishlist rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onPost('/wishlist').reply(500);

		// act
		await addWishlist('test').catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual(
				'Request failed with status code 500'
			);
		});
	});

	test('remove wishlist', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const idToRemove = 1;
		mock.onDelete(`/wishlist/${idToRemove}`).reply(200);

		// act
		await waitFor((): void => {
			removeWishlist(1);
			expect(mock.history.delete.length).toBe(1);
			expect(mock.history.delete[0].url).toEqual(
				`/wishlist/${idToRemove}`
			);
		});
	});

	test('remove wishlist rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const idToRemove = 1;
		mock.onDelete(`/wishlist/${idToRemove}`).reply(500);

		// act
		await removeWishlist(1).catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual(
				'Request failed with status code 500'
			);
		});
	});

	test('update wishlist name', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const newName = 'Updated wishlist name';
		const updatedWishlist = {id: wishlistId, name: newName};
		mock.onPut(`/wishlist/${wishlistId}`).reply(200, updatedWishlist);

		// act
		await waitFor(async (): Promise<void> => {
			const result = await updateWishlistName(wishlistId, newName);

			// assert
			expect(result).toEqual(updatedWishlist);
		});

		mock.restore();
	});
});
