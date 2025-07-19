import {
	mockedAddWishlist,
	mockedGetWishlists,
	mockedRemoveWishlist,
	mockedSetWishlistPassword,
	mockedUpdateWishlistName
} from '../__mocks__/MockWishlistService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import '../__mocks__/MockMDXEditor';

import user from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import {WishlistListPage} from '../../main/Pages/WishlistListPage';
import {renderForTest} from '../__utils__/RenderForTest';
import {
	getSampleWishlist,
	getSampleWishlistDto
} from '../__utils__/DataFactory';

describe('WishlistListPage', (): void => {
	it('handles adding new wishlist correctly', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
		mockedAddWishlist.mockResolvedValue(
			getSampleWishlist({
				id: 2,
				name: 'New Mock Wishlist',
				wishlistItems: []
			})
		);

		renderForTest(<WishlistListPage />);
		await screen.findByTestId('wishlist-list-page-grid-main');

		// act
		const addNewWishlistButton: HTMLElement =
			screen.getByTestId('open-modal-button');
		await user.click(addNewWishlistButton);
		const input: HTMLInputElement = screen
			.getByTestId('input-wishlist-name')
			.querySelector('input') as HTMLInputElement;
		await user.type(input, 'New Mock Wishlist');
		const saveButton: HTMLElement = screen.getByTestId('button-save');
		await user.click(saveButton);

		// assert
		await waitFor((): void =>
			expect(
				screen.getAllByText('New Mock Wishlist').length
			).toBeGreaterThan(0)
		);
	});

	it('handles removing wishlist accept', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
		mockedRemoveWishlist.mockResolvedValue(void 0);

		renderForTest(<WishlistListPage />);
		await screen.findByTestId('wishlist-list-page-grid-main');

		// act
		await user.click(screen.getByTestId('delete-wishlist-1'));

		await user.click(
			screen.getByTestId('delete-wishlist-modal-button-delete')
		);

		// assert
		expect(screen.getByText('wishlist-removed')).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
	});

	it('handles removing wishlist cancel', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
		mockedRemoveWishlist.mockResolvedValue(void 0);

		renderForTest(<WishlistListPage />);
		await screen.findByTestId('wishlist-list-page-grid-main');

		// act
		await user.click(screen.getByTestId('delete-wishlist-1'));
		await user.click(
			screen.getByTestId('delete-wishlist-modal-button-cancel')
		);

		// assert
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(0);
	});

	it('handles removing wishlist reject', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
		mockedRemoveWishlist.mockRejectedValue(void 0);

		renderForTest(<WishlistListPage />);
		await screen.findByTestId('wishlist-list-page-grid-main');

		// act
		await user.click(screen.getByTestId('delete-wishlist-1'));
		await user.click(
			screen.getByTestId('delete-wishlist-modal-button-delete')
		);

		// assert
		expect(screen.getByText('something-went-wrong')).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledTimes(0);
	});

	it('handles renaming wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
		mockedUpdateWishlistName.mockResolvedValue(
			getSampleWishlist({name: 'Mock Wishlist updated'})
		);

		renderForTest(<WishlistListPage />);
		await screen.findByTestId('wishlist-list-page-grid-main');

		// act
		await user.click(screen.getByTestId('wishlist-item-name-edit'));
		const input: HTMLInputElement = screen
			.getByTestId('wishlist-edit-name-input')
			.querySelector('input') as HTMLInputElement;
		await user.type(input, ' updated');
		await user.click(screen.getByTestId('wishlist-edit-done'));

		// assert
		expect(screen.getByText('Mock Wishlist updated')).toBeInTheDocument();
	});

	it('handles password change', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
		mockedSetWishlistPassword.mockResolvedValue(void 0);

		renderForTest(<WishlistListPage />);
		await screen.findByTestId('wishlist-list-page-grid-main');

		// act
		await user.click(screen.getByTestId('hidden-items-icon-button'));
		const input: HTMLInputElement = screen
			.getByTestId('wishlist-password-modal-input')
			.querySelector('input') as HTMLInputElement;
		await user.type(input, ' updated');
		await user.click(screen.getByTestId('wishlist-password-modal-confirm'));

		// assert
		expect(screen.queryByTestId('icon-lock-open')).toBeNull();
		expect(screen.queryByTestId('icon-lock')).not.toBeNull();
	});
});
