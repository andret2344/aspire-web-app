import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {mockedGetReadonlyWishlistByUUID} from '../__mocks__/MockWishlistService';
import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, screen} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import {ReadonlyWishlistPage} from '../../Pages/ReadonlyWishlistPage';
import {renderForTest} from '../Utils/RenderForTest';
import {WishList} from '../../Entity/WishList';
import {mockedGetWishlistHiddenItems} from '../__mocks__/MockWishlistItemService';

describe('ReadonlyWishlistPage', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'random-uuid',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'test description',
				name: 'Item 1',
				priorityId: 3,
				hidden: false
			}
		],
		hasPassword: false
	};

	const anotherMockWishlistData: WishList = {
		id: 2,
		uuid: '2',
		name: 'Another Mock Wishlist',
		wishlistItems: [
			{
				id: 2,
				wishlistId: 2,
				description: 'test2 description',
				name: 'Item 2',
				priorityId: 2,
				hidden: true
			}
		],
		hasPassword: true
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

	test('visibility button works correctly', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: '2'
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			anotherMockWishlistData
		);
		renderForTest(<ReadonlyWishlistPage />);

		// act
		await waitFor((): void => {
			fireEvent.click(screen.getByTestId('hidden-items-icon-button'));
		});

		// assert
		expect(screen.getByText('confirm')).toBeInTheDocument();
	});

	test('cancel button works correctly in the password modal', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: '2'
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			anotherMockWishlistData
		);
		renderForTest(<ReadonlyWishlistPage />);

		// act
		await waitFor((): void => {
			fireEvent.click(screen.getByTestId('hidden-items-icon-button'));
		});

		// assert
		expect(screen.getByText('confirm')).toBeInTheDocument();
		fireEvent.click(screen.getByTestId('wishlist-password-modal-cancel'));
	});

	test('confirm button returns error when password is incorrect', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: '2'
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			anotherMockWishlistData
		);
		mockedGetWishlistHiddenItems.mockRejectedValue(404);
		renderForTest(<ReadonlyWishlistPage />);

		// act
		await waitFor((): void => {
			fireEvent.click(screen.getByTestId('hidden-items-icon-button'));
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByTestId('wishlist-password-modal-confirm'));

		// assert
		await waitFor((): void =>
			expect(screen.getByText('password-invalid')).toBeInTheDocument()
		);
	});
});
