import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {mockedGetWishlistHiddenItems} from '../__mocks__/MockWishlistItemService';
import {mockedGetReadonlyWishlistByUUID} from '../__mocks__/MockWishlistService';
import '../__mocks__/MockMDXEditor';
import {GENERIC_UUID, getSampleWishlistDto} from '../__utils__/DataFactory';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {fireEvent, screen} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import {ReadonlyWishlistPage} from '@page/ReadonlyWishlistPage';

describe('ReadonlyWishlistPage', (): void => {
	test('renders correctly with wishlist data', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(getSampleWishlistDto());

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
		});
	});

	test('redirects to error page on fetch failure', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockRejectedValue(new Error('Fetch failed'));

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/error', {
				replace: true
			});
		});
	});

	test('sets wishlist when data is fetched successfully', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(getSampleWishlistDto());

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
		});
	});

	test('fetchSelectedWishlist fetches data correctly', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(getSampleWishlistDto());

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// arrange
		await waitFor((): void => {
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
		});
	});

	test('fetchSelectedWishlist handles fetch error', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockRejectedValue(new Error('Fetch failed'));

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/error', {
				replace: true
			});
		});
	});

	test('visibility button works correctly', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto({
				has_password: true
			})
		);
		renderForTest(<ReadonlyWishlistPage />);

		// act
		await waitFor((): void => {
			fireEvent.click(screen.getByTestId('hidden-items-icon-button'));
		});

		// assert
		expect(screen.getByText('common.confirm')).toBeInTheDocument();
	});

	test('cancel button works correctly in the password modal', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto({
				has_password: true
			})
		);
		renderForTest(<ReadonlyWishlistPage />);

		// act
		await waitFor((): void => {
			fireEvent.click(screen.getByTestId('hidden-items-icon-button'));
		});

		// assert
		expect(screen.getByText('common.confirm')).toBeInTheDocument();
		fireEvent.click(screen.getByTestId('wishlist-password-modal-cancel'));
	});

	test('confirm button returns error when password is incorrect', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto({
				has_password: true
			})
		);
		mockedGetWishlistHiddenItems.mockRejectedValue(404);
		renderForTest(<ReadonlyWishlistPage />);

		// act
		await waitFor((): void => {
			fireEvent.click(screen.getByTestId('hidden-items-icon-button'));
		});
		fireEvent.change(screen.getByPlaceholderText('wishlist.access-code'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.click(screen.getByTestId('wishlist-password-modal-confirm'));

		// assert
		await waitFor((): void => expect(screen.getByText('wishlist.access-code-invalid')).toBeInTheDocument());
	});

	test('confirm button retrieves hidden items when password is correct', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			uuid: GENERIC_UUID
		});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto({
				has_password: true
			})
		);
		const hiddenItem = {
			id: 2,
			name: 'Hidden Item',
			description: '<p>Hidden description</p>',
			priority: 2,
			hidden: true
		};
		mockedGetWishlistHiddenItems.mockResolvedValue([hiddenItem]);
		renderForTest(<ReadonlyWishlistPage />);

		// act
		await waitFor((): void => {
			fireEvent.click(screen.getByTestId('hidden-items-icon-button'));
		});
		fireEvent.change(screen.getByPlaceholderText('wishlist.access-code'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.click(screen.getByTestId('wishlist-password-modal-confirm'));

		// assert
		await waitFor((): void => {
			expect(mockedGetWishlistHiddenItems).toHaveBeenCalledWith(GENERIC_UUID, 'password123');
			expect(screen.getByText('Hidden Item')).toBeInTheDocument();
		});
	});
});
