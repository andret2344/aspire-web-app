import {getSampleWishlist, getSampleWishlistDto} from '../__utils__/DataFactory';
import {waitFor} from '@testing-library/react';
import {mapWishlistArrayFromDto, mapWishlistFromDto, WishList, WishListDto} from '@entity/WishList';
import {headers} from '@service/AuthService';
import {
	addWishlist,
	getReadonlyWishlistByUUID,
	getWishlist,
	getWishlists,
	removeWishlist,
	setWishlistPassword,
	updateWishlistName
} from '@service/WishListService';
import axios, {AxiosError} from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiInstance, {getApiConfig} from '../../main/Service/ApiInstance';

describe('WishListService', (): void => {
	it('get wishlists', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlists').reply(200, [getSampleWishlistDto()]);

		// act
		await waitFor(getWishlists)
			.then(mapWishlistArrayFromDto)
			.then((wishlists: WishList[]): void =>
				// assert
				expect(wishlists).toStrictEqual([getSampleWishlist()])
			);
	});

	it('get wishlists rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlists').reply(500);

		// act
		await getWishlists().catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual('Request failed with status code 500');
		});
	});

	it('get wishlist by id', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlists/1').reply(200, getSampleWishlistDto());

		// act
		await getWishlist(1)
			.then(mapWishlistFromDto)
			.then((wishlist: WishList | null): void => {
				// assert
				expect(wishlist).toEqual(getSampleWishlist());
			});
	});

	it('get wishlist by id rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onGet('/wishlists/1').reply(500);

		// act
		await getWishlist(1).catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual('Request failed with status code 500');
		});
	});

	it('get readonly wishlist by uuid', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
		mock.onGet(`${baseUrl}/readonly/test-uuid`, {
			headers
		}).reply(200, getSampleWishlistDto());

		// act
		await getReadonlyWishlistByUUID('test-uuid')
			.then(mapWishlistFromDto)
			.then((wishlist: WishList | null): void => {
				// assert
				expect(wishlist).toEqual(getSampleWishlist());
			});
	});

	it('get readonly wishlist by uuid rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(axios);
		const baseUrl = getApiConfig().backend;
		mock.onGet(`${baseUrl}/readonly/test-uuid`, {
			headers
		}).reply(500);

		// act
		await getReadonlyWishlistByUUID('test-uuid').catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual('Request failed with status code 500');
		});
	});

	it('add wishlist', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onPost('/wishlists').reply(200, getSampleWishlistDto());

		// act
		await waitFor((): Promise<WishListDto | null> => addWishlist('test')).then(
			(wishlist: WishListDto | null): void => {
				// assert
				expect(wishlist).toEqual(getSampleWishlistDto());
			}
		);
	});

	it('add wishlist rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		mock.onPost('/wishlists').reply(500);

		// act
		await addWishlist('test').catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual('Request failed with status code 500');
		});
	});

	it('remove wishlist', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const idToRemove = 1;
		mock.onDelete(`/wishlists/${idToRemove}`).reply(200);

		// act
		await waitFor((): void => {
			removeWishlist(1);
			expect(mock.history.delete.length).toBe(1);
			expect(mock.history.delete[0].url).toEqual(`/wishlists/${idToRemove}`);
		});
	});

	it('remove wishlist rejected', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const idToRemove = 1;
		mock.onDelete(`/wishlists/${idToRemove}`).reply(500);

		// act
		await removeWishlist(1).catch((error: AxiosError): void => {
			// assert
			expect(error.message).toEqual('Request failed with status code 500');
		});
	});

	it('update wishlist name', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const newName = 'Updated wishlist name';
		const updatedWishlist = {
			id: wishlistId,
			name: newName
		};
		mock.onPut(`/wishlists/${wishlistId}`).reply(200, updatedWishlist);

		// act
		await waitFor(async (): Promise<void> => {
			const result = await updateWishlistName(wishlistId, newName);

			// assert
			expect(result).toEqual(updatedWishlist);
		});

		mock.restore();
	});

	it('set wishlist password correctly', async (): Promise<void> => {
		// arrange
		const mock = new MockAdapter(apiInstance);
		const wishlistId = 1;
		const password = 'pass123';
		const message = 'Access code set successfully';
		mock.onPost(`/wishlists/${wishlistId}/set-access-code`).reply(200, message);

		// act
		await waitFor(async (): Promise<void> => {
			const result: number = await setWishlistPassword(wishlistId, password);

			// assert
			expect(result).toBe(200);
		});
	});
});
