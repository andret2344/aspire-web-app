import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {mockedGetReadonlyWishlistByUUID} from '../__mocks__/MockWishlistService';

import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import {ReadonlyWishlistPage} from '../../Pages/ReadonlyWishlistPage';
import {renderForTest} from '../Utils/RenderForTest';

describe('ReadonlyWishlistPage', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockWishlistData = {
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

	const anotherMockWishlistData = {
		id: 2,
		uuid: '2',
		name: 'Another Mock Wishlist',
		wishlistItems: [
			{
				id: 2,
				wishlistId: 2,
				description: 'test2 description',
				name: 'Item 2',
				priorityId: 2
			}
		]
	};

	test('renders correctly with wishlist data', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: '1'
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(mockWishlistData);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(screen.getByText(mockWishlistData.name)).toBeInTheDocument();
		});
	});

	test('sets wishlist to null if uuid is undefined', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: undefined});

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(screen.queryByText('Mock Wishlist')).not.toBeInTheDocument();
		});
	});

	test('redirects to error page on fetch failure', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: 'test-uuid'});
		mockedGetReadonlyWishlistByUUID.mockRejectedValue(
			new Error('Fetch failed')
		);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/error');
		});
	});

	test('sets wishlist when data is fetched successfully', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: 'test-uuid'});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(mockWishlistData);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(screen.getByText(mockWishlistData.name)).toBeInTheDocument();
		});
	});

	test('redirects to error page when fetched wishlist is null', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: 'test-uuid'});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(null);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/error');
		});
	});

	test('useEffect fetches wishlist data on uuid change', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: 'new-uuid'});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(mockWishlistData);

		// act
		renderForTest(<ReadonlyWishlistPage />);
		mockedUseParams.mockReturnValue({uuid: 'changed-uuid'});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			anotherMockWishlistData
		);
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(
				screen.getByText(anotherMockWishlistData.name)
			).toBeInTheDocument();
		});
	});

	test('fetchSelectedWishlist fetches data correctly', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: 'test-uuid'});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(mockWishlistData);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// arrange
		await waitFor((): void => {
			expect(screen.getByText(mockWishlistData.name)).toBeInTheDocument();
		});
	});

	test('fetchSelectedWishlist handles null response', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: 'test-uuid'});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(null);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/error');
		});
	});

	test('fetchSelectedWishlist handles fetch error', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: 'test-uuid'});
		mockedGetReadonlyWishlistByUUID.mockRejectedValue(
			new Error('Fetch failed')
		);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/error');
		});
	});
});
