import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {
	mockedAddWishlistItem,
	mockedRemoveWishlistItem,
	mockedUpdateWishlistItem
} from '../__mocks__/MockWishlistItemService';
import {mockedGetWishlist} from '../__mocks__/MockWishlistService';
import '../__mocks__/MockMDXEditor';
import {getSampleWishlistDto} from '../__utils__/DataFactory';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import user from '@testing-library/user-event';
import {WishlistPage} from '@page/WishlistPage';

describe('WishlistPage', (): void => {
	it('handles adding an item to a wishlist', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			id: '1'
		});
		mockedGetWishlist.mockResolvedValue(getSampleWishlistDto());
		mockedAddWishlistItem.mockResolvedValue(
			getSampleWishlistDto({
				id: 2
			})
		);

		renderForTest(<WishlistPage />);
		await screen.findByTestId('wishlist-page-grid-main');

		// act
		const addButton: HTMLButtonElement = await waitFor(
			(): HTMLButtonElement => screen.getByTestId('open-modal-button')
		);
		await user.click(addButton);

		// assert
		expect(mockedAddWishlistItem).toHaveBeenCalledTimes(1);
	});

	it('handles removing an item from a wishlist', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			id: '1'
		});
		mockedGetWishlist.mockResolvedValue(getSampleWishlistDto());
		mockedRemoveWishlistItem.mockResolvedValue(undefined);

		// act
		renderForTest(<WishlistPage />);
		await screen.findByTestId('wishlist-page-grid-main');

		const removeButton: HTMLButtonElement = await waitFor(
			(): HTMLButtonElement => screen.getByTestId('remove-wishlist-item-1-1')
		);
		await user.click(removeButton);

		// assert
		expect(mockedRemoveWishlistItem).toHaveBeenCalledTimes(1);
		expect(mockedRemoveWishlistItem).toHaveBeenCalledWith(1, 1);
	});

	it('handles visibility click', async (): Promise<void> => {
		// arrange
		mockedGetWishlist.mockResolvedValue(
			getSampleWishlistDto({
				has_password: true
			})
		);
		mockedUpdateWishlistItem.mockResolvedValue(void 0);

		renderForTest(<WishlistPage />);
		await screen.findByTestId('wishlist-page-grid-main');

		// act
		await user.click(screen.getByTestId('item-visible-icon'));

		// assert
		await waitFor((): void => {
			expect(screen.queryByText('Check out this link')).toBeNull();
			expect(screen.queryByTestId('item-visible-icon')).toBeNull();
			expect(screen.queryByTestId('item-hidden-icon')).not.toBeNull();
		});
	});

	it('navigates to /error when no wishlist is fetched', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			id: 1
		});
		mockedGetWishlist.mockRejectedValue(new Error('Test error'));

		// act
		renderForTest(<WishlistPage />);
		await screen.findByTestId('wishlist-page-grid-main');

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/error');
	});

	it('handles duplicating an item', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			id: '1'
		});
		mockedGetWishlist.mockResolvedValue(getSampleWishlistDto());
		mockedAddWishlistItem.mockResolvedValue(
			getSampleWishlistDto({
				id: 2
			})
		);

		renderForTest(<WishlistPage />);
		await screen.findByTestId('wishlist-page-grid-main');

		// act
		const moreButton: HTMLButtonElement = await waitFor(
			(): HTMLButtonElement => screen.getByTestId('wishlist-item-button-more')
		);
		await user.click(moreButton);

		const duplicateButton: HTMLElement = await waitFor(
			(): HTMLElement => screen.getByTestId('menu-item-duplicate')
		);
		await user.click(duplicateButton);

		// assert
		expect(mockedAddWishlistItem).toHaveBeenCalledTimes(1);
	});
});
