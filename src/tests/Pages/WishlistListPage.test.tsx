import {
	mockedAddWishlist,
	mockedGetWishlists,
	mockedRemoveWishlist,
	mockedSetWishlistPassword
} from '../__mocks__/MockWishlistService';
import {
	mockedAddWishlistItem,
	mockedRemoveWishlistItem,
	mockedUpdateWishlistItem
} from '../__mocks__/MockWishlistItemService';
import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {mockedIsTokenValid} from '../__mocks__/MockAuthService';
import '../__mocks__/MockMDXEditor';

import user from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {act, RenderResult, waitFor} from '@testing-library/react';
import {WishlistListPage} from '../../main/Pages/WishlistListPage';
import {WishList} from '../../main/Entity/WishList';
import {renderForTest} from '../__utils__/RenderForTest';
import {
	getSampleUpdatedWishlist,
	getSampleWishlist,
	getSampleWishlistWithPassword
} from '../__utils__/DataFactory';

describe('WishlistListPage', (): void => {
	describe('wishlist', (): void => {
		it('handles adding new wishlist correctly', async (): Promise<void> => {
			// arrange
			const newWishlist: WishList = {
				id: 2,
				uuid: 'b838027b-9177-43d6-918e-67917f1d9b16',
				name: 'New Mock Wishlist',
				wishlistItems: [],
				hasPassword: false
			};
			user.setup();
			mockedUseParams.mockReturnValue({id: '1'});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedAddWishlist.mockResolvedValue(newWishlist);
			mockedIsTokenValid.mockReturnValue(true);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));
			const addNewWishlistButton: HTMLElement =
				screen.getByTestId('open-modal-button');
			await user.click(addNewWishlistButton);
			const input: HTMLInputElement = screen
				.getByTestId('input-wishlist-name')
				.querySelector('input') as HTMLInputElement;
			await user.type(input, newWishlist.name);
			const saveButton: HTMLElement = screen.getByTestId('button-save');
			await act(async (): Promise<void> => user.click(saveButton));

			// assert
			await waitFor((): void =>
				expect(
					screen.getAllByText(newWishlist.name).length
				).toBeGreaterThan(0)
			);
		});

		it('handles removing wishlist accept', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: 1});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedIsTokenValid.mockReturnValue(true);
			mockedRemoveWishlist.mockResolvedValue(void 0);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			await act(
				(): Promise<void> =>
					user.click(screen.getByTestId('delete-wishlist-1'))
			);

			await user.click(
				screen.getByTestId('delete-wishlist-modal-button-delete')
			);

			// assert
			expect(screen.getByText('wishlist-removed')).toBeInTheDocument();
			expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
			expect(mockedNavigate).toHaveBeenCalledWith('/wishlists');
		});

		it('handles removing wishlist cancel', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: 1});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedIsTokenValid.mockReturnValue(true);
			mockedRemoveWishlist.mockResolvedValue(void 0);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

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
			mockedUseParams.mockReturnValue({id: 1});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedIsTokenValid.mockReturnValue(true);
			mockedRemoveWishlist.mockRejectedValue(void 0);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			await user.click(screen.getByLabelText('delete-wishlist-1'));
			await user.click(
				screen.getByTestId('delete-wishlist-modal-button-delete')
			);

			// assert
			expect(
				screen.getByText('something-went-wrong')
			).toBeInTheDocument();
			expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
			expect(mockedNavigate).toHaveBeenCalledTimes(0);
		});

		it('handles renaming wishlist', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: 1});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedIsTokenValid.mockReturnValue(true);
			mockedRemoveWishlist.mockRejectedValue(void 0);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			await user.click(screen.getByTestId('wishlist-name'));
			const input: HTMLInputElement = screen
				.getByTestId('wishlist-edit-name-input')
				.querySelector('input') as HTMLInputElement;
			await user.type(input, ' updated');
			await user.click(screen.getByTestId('wishlist-edit-done'));

			// assert
			expect(
				screen.getByText('Mock Wishlist updated')
			).toBeInTheDocument();
		});

		it('handles password change', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: 1});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedIsTokenValid.mockReturnValue(true);
			mockedSetWishlistPassword.mockResolvedValue(void 0);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			await user.click(screen.getByTestId('hidden-items-icon-button'));
			const input: HTMLInputElement = screen
				.getByTestId('wishlist-password-modal-input')
				.querySelector('input') as HTMLInputElement;
			await user.type(input, ' updated');
			await user.click(
				screen.getByTestId('wishlist-password-modal-confirm')
			);

			// assert
			expect(screen.queryByTestId('icon-lock-open')).toBeNull();
			expect(screen.queryByTestId('icon-lock')).not.toBeNull();
		});

		it('handles visibility click', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: 1});
			mockedGetWishlists.mockResolvedValue([
				getSampleWishlistWithPassword()
			]);
			mockedIsTokenValid.mockReturnValue(true);
			mockedUpdateWishlistItem.mockResolvedValue(void 0);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			await user.click(screen.getByTestId('item-visible-icon'));

			// assert
			await waitFor((): void => {
				expect(screen.queryByText('Check out this link')).toBeNull();
				expect(screen.queryByTestId('item-visible-icon')).toBeNull();
				expect(screen.queryByTestId('item-hidden-icon')).not.toBeNull();
			});
		});
	});

	describe('item', (): void => {
		it('handles adding an item to a wishlist', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: '1'});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedAddWishlistItem.mockResolvedValue(getSampleWishlist());
			mockedIsTokenValid.mockReturnValue(true);

			// act
			renderForTest(<WishlistListPage />);

			const addButton: HTMLButtonElement = await waitFor(
				(): HTMLButtonElement => screen.getByTestId('add-item-button')
			);
			await act(async (): Promise<void> => user.click(addButton));

			const input: HTMLInputElement = screen
				.getByTestId('edit-item-modal-input-name')
				.querySelector('input') as HTMLInputElement;
			await user.type(input, 'New item');
			const confirmButton: HTMLElement = screen.getByTestId(
				'edit-item-modal-confirm'
			);
			await user.click(confirmButton);

			// assert
			expect(mockedAddWishlistItem).toHaveBeenCalledTimes(1);
		});

		it('handles item name change accept', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: '1'});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedUpdateWishlistItem.mockResolvedValue(
				getSampleUpdatedWishlist()
			);
			mockedIsTokenValid.mockReturnValue(true);
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			// act
			const editButton: HTMLElement = await waitFor(
				async (): Promise<HTMLElement> =>
					screen.getByTestId('edit-wishlist-item-1-1')
			);
			await act(async (): Promise<void> => user.click(editButton));
			const input: HTMLInputElement = screen.getByTestId(
				'edit-item-modal-input-name'
			);
			await user.type(input, ' updated');
			const confirmButton: HTMLElement = screen.getByTestId(
				'edit-item-modal-confirm'
			);
			await user.click(confirmButton);

			// assert
			expect(mockedUpdateWishlistItem).toHaveBeenCalledTimes(1);
		});

		it('handles item name change cancel', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: '1'});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedIsTokenValid.mockReturnValue(true);
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			// act
			const editButton: HTMLElement = await waitFor(
				async (): Promise<HTMLElement> =>
					screen.getByTestId('edit-wishlist-item-1-1')
			);
			await user.click(editButton);

			const cancelButton: HTMLElement = screen.getByTestId(
				'edit-item-modal-cancel'
			);
			await user.click(cancelButton);

			// assert
			expect(cancelButton).not.toBeInTheDocument();
		});

		it('handles removing an item from a wishlist', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({id: '1'});
			mockedGetWishlists.mockResolvedValue([getSampleWishlist()]);
			mockedRemoveWishlistItem.mockResolvedValue(undefined);
			mockedIsTokenValid.mockReturnValue(true);

			// act
			renderForTest(<WishlistListPage />);

			const removeButton: HTMLButtonElement = await waitFor(
				(): HTMLButtonElement =>
					screen.getByTestId('remove-wishlist-item-1-1')
			);
			await user.click(removeButton);

			// assert
			expect(mockedRemoveWishlistItem).toHaveBeenCalledTimes(1);
			expect(mockedRemoveWishlistItem).toHaveBeenCalledWith(1, 1);
		});
	});

	describe('routing', (): void => {
		it('redirects successfully to index page if not logged in', async (): Promise<void> => {
			// arrange
			mockedIsTokenValid.mockReturnValue(false);
			mockedGetWishlists.mockResolvedValue([]);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			// assert
			expect(mockedNavigate).toHaveBeenCalledTimes(1);
			expect(mockedNavigate).toHaveBeenCalledWith('/');
		});

		it('navigates to /error when no wishlist is fetched', async (): Promise<void> => {
			// arrange
			user.setup();
			mockedUseParams.mockReturnValue({
				id: 1
			});
			mockedGetWishlists.mockRejectedValue(new Error('Test error'));
			mockedIsTokenValid.mockReturnValue(true);

			// act
			await act((): RenderResult => renderForTest(<WishlistListPage />));

			// assert
			expect(mockedNavigate).toHaveBeenCalledTimes(1);
			expect(mockedNavigate).toHaveBeenCalledWith('/error');
		});
	});
});
