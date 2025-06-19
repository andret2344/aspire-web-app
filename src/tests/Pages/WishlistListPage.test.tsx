import {
	mockedAddWishlist,
	mockedGetWishlists,
	mockedRemoveWishlist
} from '../__mocks__/MockWishlistService';
import {
	mockedAddWishlistItem,
	mockedEditWishlistItem
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

describe('WishlistListPage', (): void => {
	beforeEach((): void => {
		Object.defineProperty(global.navigator, 'clipboard', {
			value: {
				writeText: jest.fn(),
				readText: jest.fn()
			},
			configurable: true
		});
		localStorage.clear();
	});

	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'Check out this link: https://example.com',
				name: 'Item 1',
				priorityId: 3,
				hidden: false
			}
		],
		hasPassword: false
	};

	it('renders correctly with wishlist data', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			id: 1
		});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);

		// assert
		await waitFor((): void => {
			expect(mockedGetWishlists).toHaveBeenCalled();
			expect(screen.getByText('Mock Wishlist')).toBeInTheDocument();
			expect(screen.getByText('Item 1')).toBeInTheDocument();
		});
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

	it('clicks save button on empty modal', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);

		const addNewWishlistItem: HTMLElement =
			screen.getByTestId('add-item-button');

		// assert
		expect(addNewWishlistItem).toBeInTheDocument();
	});

	it('adds an item to a wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedAddWishlistItem.mockResolvedValue(mockWishlistData);
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

	it('accepts wishlist name change', async (): Promise<void> => {
		// arrange
		const mockWishlistData: WishList = {
			id: 1,
			uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
			name: 'Mock Wishlist',
			wishlistItems: [
				{
					id: 1,
					wishlistId: 1,
					description: 'Check out this link: https://example.com',
					name: 'Item 1',
					priorityId: 3,
					hidden: false
				}
			],
			hasPassword: false
		};

		const mockWishlistDataUpdatedName: WishList = {
			id: 1,
			uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
			name: 'Mock Wishlist updated',
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
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedEditWishlistItem.mockResolvedValue(mockWishlistDataUpdatedName);
		mockedIsTokenValid.mockReturnValue(true);
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		screen.debug();
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
		expect(mockedEditWishlistItem).toHaveBeenCalledTimes(1);
	});

	it('cancels wishlist name change', async (): Promise<void> => {
		// arrange
		const mockWishlistData: WishList = {
			id: 1,
			uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
			name: 'Mock Wishlist',
			wishlistItems: [
				{
					id: 1,
					wishlistId: 1,
					description: 'Check out this link: https://example.com',
					name: 'Item 1',
					priorityId: 3,
					hidden: false
				}
			],
			hasPassword: false
		};

		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
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

	it('adds new wishlist', async (): Promise<void> => {
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
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
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

	it('removes wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: 1});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);
		mockedRemoveWishlist.mockResolvedValue(void 0);

		// act
		await act(
			async (): Promise<RenderResult> =>
				renderForTest(<WishlistListPage />)
		);

		await act(
			(): Promise<void> =>
				user.click(screen.getByTestId('delete-wishlist-1'))
		);

		await act(
			(): Promise<void> =>
				user.click(
					screen.getByTestId('delete-wishlist-modal-button-delete')
				)
		);

		// assert
		expect(screen.getByText('wishlist-removed')).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/wishlists');
	});

	it('cancels removing wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: 1});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);
		mockedRemoveWishlist.mockResolvedValue(void 0);

		// act
		await act(
			async (): Promise<RenderResult> =>
				renderForTest(<WishlistListPage />)
		);

		await user.click(screen.getByTestId('delete-wishlist-1'));

		await user.click(
			screen.getByTestId('delete-wishlist-modal-button-cancel')
		);

		// assert
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(0);
	});

	it('rejects removing wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: 1});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);
		mockedRemoveWishlist.mockRejectedValue(void 0);

		// act
		await act(
			async (): Promise<RenderResult> =>
				renderForTest(<WishlistListPage />)
		);

		await user.click(screen.getByLabelText('delete-wishlist-1'));

		// assert
		await user.click(
			screen.getByTestId('delete-wishlist-modal-button-delete')
		);
		expect(screen.getByText('something-went-wrong')).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledTimes(0);
	});

	it('copies url to clipboard', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const shareIcon: HTMLElement = await waitFor(
			(): HTMLElement => screen.getByTestId('share-icon-button-1')
		);
		await user.click(shareIcon);

		// assert
		const clipboardText: string = await navigator.clipboard.readText();
		expect(clipboardText).toBe(
			'http://localhost/wishlist/b838027b-9177-43d6-918e-67917f1d9b15'
		);
		expect(screen.getByText('url-copied')).toBeInTheDocument();
	});

	it('throws an exception when copying to clipboard', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		navigator.clipboard.writeText = jest
			.fn()
			.mockRejectedValue(new Error('Failed to write to clipboard'));
		const shareIcon: HTMLElement = await waitFor(
			(): HTMLElement => screen.getByTestId('share-icon-button-1')
		);
		await user.click(shareIcon);

		// assert
		expect(screen.getByText('something-went-wrong')).toBeInTheDocument();
	});

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
});
