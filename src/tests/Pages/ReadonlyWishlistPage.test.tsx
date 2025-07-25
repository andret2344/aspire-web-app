import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {mockedGetReadonlyWishlistByUUID} from '../__mocks__/MockWishlistService';
import {mockedGetWishlistHiddenItems} from '../__mocks__/MockWishlistItemService';
import '../__mocks__/MockMDXEditor';

import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, screen} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import {ReadonlyWishlistPage} from '../../main/Page/ReadonlyWishlistPage';
import {renderForTest} from '../__utils__/RenderForTest';
import {GENERIC_UUID, getSampleWishlistDto} from '../__utils__/DataFactory';

describe('ReadonlyWishlistPage', (): void => {
	test('renders correctly with wishlist data', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto()
		);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
		});
	});

	test('redirects to error page on fetch failure', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
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
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto()
		);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// assert
		await waitFor((): void => {
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
		});
	});

	test('fetchSelectedWishlist fetches data correctly', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto()
		);

		// act
		renderForTest(<ReadonlyWishlistPage />);

		// arrange
		await waitFor((): void => {
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
		});
	});

	test('fetchSelectedWishlist handles fetch error', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
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
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto({has_password: true})
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
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto({has_password: true})
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
		mockedUseParams.mockReturnValue({uuid: GENERIC_UUID});
		mockedGetReadonlyWishlistByUUID.mockResolvedValue(
			getSampleWishlistDto({has_password: true})
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
