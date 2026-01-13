import {mockedNavigate} from '../__mocks__/MockCommonService';
import {
	mockedAddWishlist,
	mockedGetWishlists,
	mockedRemoveWishlist,
	mockedSetWishlistPassword,
	mockedUpdateWishlistName
} from '../__mocks__/MockWishlistService';
import {getSampleWishlist, getSampleWishlistDto} from '../__utils__/DataFactory';
import {renderForTest, withUserDataProvider} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import user from '@testing-library/user-event';
import {WishlistListPage} from '@page/WishlistListPage';

describe('WishlistListPage', (): void => {
	describe('render', (): void => {
		it('renders correctly', async (): Promise<void> => {
			// arrange
			mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);

			// act
			renderForTest(<WishlistListPage />, [withUserDataProvider]);
			await screen.findByTestId('wishlist-list-page-grid-main');

			// assert
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
			expect(screen.queryByText('something-went-wrong')).toBeNull();
		});

		it('renders with error', async (): Promise<void> => {
			// arrange
			mockedGetWishlists.mockRejectedValue(null);

			// act
			renderForTest(<WishlistListPage />, [withUserDataProvider]);
			await screen.findByTestId('wishlist-list-page-grid-main');

			// assert
			expect(mockedNavigate).toHaveBeenCalledTimes(1);
			expect(mockedNavigate).toHaveBeenCalledWith('/error', {
				replace: true
			});
			expect(screen.queryByText('something-went-wrong')).not.toBeNull();
			expect(screen.queryByText('Mock Wishlist')).toBeNull();
		});
	});

	describe('add', (): void => {
		it('handles adding new wishlist success', async (): Promise<void> => {
			// arrange
			mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
			mockedAddWishlist.mockResolvedValue(
				getSampleWishlistDto({
					id: 2,
					name: 'New Mock Wishlist',
					items: []
				})
			);

			renderForTest(<WishlistListPage />, [withUserDataProvider]);
			await screen.findByTestId('wishlist-list-page-grid-main');

			// act
			const addNewWishlistButton: HTMLElement = screen.getByTestId('open-modal-button');
			await user.click(addNewWishlistButton);
			const input: HTMLInputElement = screen
				.getByTestId('input-wishlist-name')
				.querySelector('input') as HTMLInputElement;
			await user.type(input, 'New Mock Wishlist');
			const saveButton: HTMLElement = screen.getByTestId('button-save');
			await user.click(saveButton);

			// assert
			await waitFor((): void => expect(screen.getAllByText('New Mock Wishlist').length).toBeGreaterThan(0));
		});

		it('handles adding new wishlist cancel', async (): Promise<void> => {
			// arrange
			mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);

			renderForTest(<WishlistListPage />, [withUserDataProvider]);
			await screen.findByTestId('wishlist-list-page-grid-main');

			// act
			const addNewWishlistButton: HTMLElement = screen.getByTestId('open-modal-button');
			await user.click(addNewWishlistButton);
			const cancelButton: HTMLElement = screen.getByTestId('button-cancel');
			await user.click(cancelButton);

			// assert
			expect(mockedAddWishlist).toHaveBeenCalledTimes(0);
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
		});
	});

	describe('remove', (): void => {
		it('handles removing wishlist accept', async (): Promise<void> => {
			// arrange
			mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
			mockedRemoveWishlist.mockResolvedValue(void 0);

			renderForTest(<WishlistListPage />, [withUserDataProvider]);
			await screen.findByTestId('wishlist-list-page-grid-main');

			// act
			await user.click(screen.getByTestId('delete-wishlist-1'));

			await user.click(screen.getByTestId('delete-wishlist-modal-button-delete'));

			// assert
			expect(screen.getByText('wishlist-removed')).toBeInTheDocument();
			expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
		});

		it('handles removing wishlist cancel', async (): Promise<void> => {
			// arrange
			mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
			mockedRemoveWishlist.mockResolvedValue(void 0);

			renderForTest(<WishlistListPage />, [withUserDataProvider]);
			await screen.findByTestId('wishlist-list-page-grid-main');

			// act
			await user.click(screen.getByTestId('delete-wishlist-1'));
			await user.click(screen.getByTestId('delete-wishlist-modal-button-cancel'));

			// assert
			expect(mockedRemoveWishlist).toHaveBeenCalledTimes(0);
		});

		it('handles removing wishlist reject', async (): Promise<void> => {
			// arrange
			mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
			mockedRemoveWishlist.mockRejectedValue(void 0);

			renderForTest(<WishlistListPage />, [withUserDataProvider]);
			await screen.findByTestId('wishlist-list-page-grid-main');

			// act
			await user.click(screen.getByTestId('delete-wishlist-1'));
			await user.click(screen.getByTestId('delete-wishlist-modal-button-delete'));

			// assert
			expect(screen.getByText('something-went-wrong')).toBeInTheDocument();
			expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
			expect(mockedNavigate).toHaveBeenCalledTimes(0);
		});
	});

	it('handles renaming wishlist', async (): Promise<void> => {
		// arrange
		mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
		mockedUpdateWishlistName.mockResolvedValue(
			getSampleWishlist({
				name: 'Mock Wishlist updated'
			})
		);

		renderForTest(<WishlistListPage />, [withUserDataProvider]);
		await screen.findByTestId('wishlist-list-page-grid-main');

		// act
		await user.click(screen.getByTestId('editable-name-button-edit'));
		const input: HTMLInputElement = screen
			.getByTestId('editable-name-input-name')
			.querySelector('input') as HTMLInputElement;
		await user.type(input, ' updated');
		await user.click(screen.getByTestId('editable-name-button-done'));

		// assert
		expect(screen.getByText('Mock Wishlist updated')).toBeInTheDocument();
	});

	it('handles password change', async (): Promise<void> => {
		// arrange
		mockedGetWishlists.mockResolvedValue([getSampleWishlistDto()]);
		mockedSetWishlistPassword.mockResolvedValue(void 0);

		renderForTest(<WishlistListPage />, [withUserDataProvider]);
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
