import {
	mockedAddWishlist,
	mockedGetWishlist,
	mockedGetWishlists,
	mockedRemoveWishlist,
	mockedUpdateWishlistName
} from '../__mocks__/MockWishlistService';
import {
	mockedEditWishlistItem,
	mockedRemoveWishlistItem
} from '../__mocks__/MockWishlistItemService';
import {
	mockedUseNavigate,
	mockedUseParams
} from '../__mocks__/MockCommonService';
import {mockedIsTokenValid} from '../__mocks__/MockAuthService';
import user from '@testing-library/user-event';

import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {act, RenderResult, waitFor} from '@testing-library/react';
import {WishlistListPage} from '../../Pages/WishlistListPage';
import {WishList} from '../../Entity/WishList';
import {renderForTest} from '../Utils/RenderForTest';

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
		has_hidden_items: false
	};

	const updatedMockWishlistData: WishList = {
		id: 1,
		uuid: 'random uuid',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'updated test description',
				name: 'Item 1 updated',
				priorityId: 2,
				hidden: false
			}
		],
		has_hidden_items: false
	};

	const mockWishlistDataToFetchAgain: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'test description',
				name: 'Item 1',
				priorityId: 3,
				hidden: false
			},
			{
				id: 2,
				wishlistId: 1,
				description: 'test description 2',
				name: 'Item 2',
				priorityId: 2,
				hidden: false
			}
		],
		has_hidden_items: false
	};

	test('renders correctly with wishlist data', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			id: 1
		});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);

		// assert
		await waitFor((): void => {
			expect(screen.getByText(mockWishlistData.name)).toBeInTheDocument();
		});
	});

	test('sets wishlist to null if uuid is undefined', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({id: undefined});
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);

		// assert
		await waitFor((): void => {
			expect(
				screen.queryByText(mockWishlistData.name)
			).not.toBeInTheDocument();
		});
	});

	test('fetchWishlists correctly', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({
			id: 1
		});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);

		// assert
		await waitFor((): void => {
			expect(mockedGetWishlists).toHaveBeenCalled();
		});
	});

	test('remove wishlist item correctly', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({
			id: 1
		});
		mockedGetWishlists.mockResolvedValue([mockWishlistDataToFetchAgain]);
		mockedGetWishlist.mockResolvedValue(mockWishlistDataToFetchAgain);
		mockedRemoveWishlistItem.mockResolvedValue(void 0);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act(
			async (): Promise<RenderResult> =>
				renderForTest(<WishlistListPage />)
		);
		const removeItemButton: HTMLElement =
			screen.getAllByTestId('removeWishlistItem')[0];
		expect(removeItemButton).toBeInTheDocument();
		await user.click(removeItemButton);

		// assert
		expect(mockedGetWishlist).toHaveBeenCalled();
	});

	test('remove wishlist item with error', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({
			id: 1
		});
		mockedGetWishlists.mockResolvedValue([mockWishlistDataToFetchAgain]);
		mockedGetWishlist.mockResolvedValue(mockWishlistDataToFetchAgain);
		mockedRemoveWishlistItem.mockRejectedValue(new Error('test error'));
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const removeItemButton = await waitFor(
			(): HTMLElement => screen.getAllByTestId('removeWishlistItem')[0]
		);
		expect(removeItemButton).toBeInTheDocument();
		await user.click(removeItemButton);

		// assert
		expect(mockedGetWishlist).toHaveBeenCalled();
	});

	test('fetchAndSetWishlist navigates to /error when no wishlist is returned', async (): Promise<void> => {
		// Arrange
		user.setup();
		mockedUseParams.mockReturnValue({
			id: 1
		});
		mockedGetWishlist.mockRejectedValue(new Error('Test error'));
		mockedIsTokenValid.mockReturnValue(true);

		// Act
		await act((): RenderResult => renderForTest(<WishlistListPage />));

		// Assert
		expect(mockedGetWishlist).toHaveBeenCalledTimes(1);
		expect(mockedUseNavigate).toHaveBeenCalledWith('/error');
	});

	test('opens modal to add wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlist.mockResolvedValue(mockWishlistDataToFetchAgain);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);
		const addNewWishlistButton = screen.getByText('add-new-wishlist');

		// assert
		expect(addNewWishlistButton).toBeInTheDocument();
		await user.click(addNewWishlistButton);
	});

	test('opens wishlist item modal', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);

		// assert
		const addNewWishlistItem = await waitFor(
			(): HTMLElement => screen.getByLabelText('Add item')
		);
		expect(addNewWishlistItem).toBeInTheDocument();
		await waitFor(async (): Promise<void> => {
			await user.click(addNewWishlistItem);
		});

		const saveButton = screen.getByRole('button', {name: /confirm/i});
		expect(saveButton).toBeInTheDocument();
	});

	test('opens wishlist item modal edit existing item', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedEditWishlistItem.mockResolvedValue(updatedMockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));

		// assert
		await waitFor((): void => {
			const editExistingWishlistItem = screen.getByRole('button', {
				name: /edit/i
			});
			expect(editExistingWishlistItem).toBeInTheDocument();
			user.click(editExistingWishlistItem);
		});

		await waitFor((): void => {
			const itemNameInput = screen.getByPlaceholderText(
				mockWishlistData.wishlistItems[0].name
			);
			const descriptionSectionInModal = screen.getByRole('heading', {
				name: /description/i
			});
			const saveButton = screen.getByRole('button', {
				name: /confirm/i
			});

			expect(itemNameInput).toBeInTheDocument();
			expect(descriptionSectionInModal).toBeInTheDocument();

			user.click(itemNameInput);
			user.type(itemNameInput, 'New name test');
			user.click(saveButton);
		});
	});

	test('clicks save button on empty modal', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);

		await waitFor((): void => {
			const addNewWishlistItem = screen.getByRole('button', {
				name: /add item/i
			});

			// assert
			expect(addNewWishlistItem).toBeInTheDocument();
			user.click(addNewWishlistItem);
		});
	});

	test('handle name click', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const editWishlistName = await waitFor(
			(): HTMLElement => screen.getByLabelText('wishlist-name')
		);

		// assert
		expect(editWishlistName).toBeInTheDocument();
		await user.click(editWishlistName);
	});

	test('handle name change and show snackbar', async (): Promise<void> => {
		// arrange
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
			has_hidden_items: false
		};
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedUpdateWishlistName.mockResolvedValue(mockWishlistDataUpdatedName);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const editWishlistName = await waitFor(
			(): HTMLElement => screen.getByLabelText('wishlist-name')
		);
		expect(editWishlistName).toBeInTheDocument();
		await user.click(editWishlistName);
		await user.type(editWishlistName, ' updated');

		// assert
		expect(screen.getByText('wishlist-renamed')).toBeInTheDocument();
	});

	test('add new wishlist', async (): Promise<void> => {
		// arrange
		const newWishlist: WishList = {
			id: 2,
			uuid: 'b838027b-9177-43d6-918e-67917f1d9b16',
			name: 'New Mock Wishlist',
			wishlistItems: [],
			has_hidden_items: false
		};
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData, newWishlist]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedAddWishlist.mockResolvedValue(newWishlist);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const addNewWishlistButton = screen.getByText('add-new-wishlist');
		await user.click(addNewWishlistButton);
		const input = screen.getByPlaceholderText(/Name/i);
		await user.type(input, newWishlist.name);
		const saveButton = screen.getByRole('button', {name: 'save'});
		await user.click(saveButton);

		// assert
		await waitFor((): void =>
			expect(screen.getByText(/wishlist created/i)).toBeInTheDocument()
		);
		await waitFor((): void =>
			expect(
				screen.getAllByText(newWishlist.name).length
			).toBeGreaterThan(0)
		);
	});

	test('remove wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: 1});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedRemoveWishlist.mockResolvedValue(void 0);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const removeWishlistButton = await waitFor(
			(): HTMLElement => screen.getByLabelText('delete-wishlist-1')
		);
		expect(removeWishlistButton).toBeInTheDocument();

		await user.click(removeWishlistButton);

		const confirmationButton = screen.getByRole('button', {name: 'ok'});
		expect(confirmationButton).toBeInTheDocument();

		await user.click(confirmationButton);
		expect(screen.getByText('wishlist-removed')).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
	});

	test('remove wishlist rejected', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: 1});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedRemoveWishlist.mockRejectedValue(void 0);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const removeWishlistButton = await waitFor(
			(): HTMLElement => screen.getByLabelText('delete-wishlist-1')
		);
		expect(removeWishlistButton).toBeInTheDocument();
		await user.click(removeWishlistButton);

		// assert
		const confirmationButton = screen.getByRole('button', {name: 'ok'});
		expect(confirmationButton).toBeInTheDocument();
		await user.click(confirmationButton);
		expect(screen.getByText(/something-went-wrong/i)).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
	});

	test('copies url to clipboard', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		const shareIcon = await waitFor(
			(): HTMLElement => screen.getByTestId('shareIcon-1')
		);
		await user.click(shareIcon);

		// assert
		const clipboardText = await navigator.clipboard.readText();
		expect(clipboardText).toBe(
			'http://localhost/wishlist/b838027b-9177-43d6-918e-67917f1d9b15'
		);
		expect(screen.getByText('url-copied')).toBeInTheDocument();
	});

	test('addShareUrlToClipboard enters catch block on clipboard error', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedGetWishlist.mockResolvedValue(mockWishlistData);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<WishlistListPage />));
		navigator.clipboard.writeText = jest
			.fn()
			.mockRejectedValue(new Error('Failed to write to clipboard'));
		const shareIcon = await waitFor(
			(): HTMLElement => screen.getByTestId('shareIcon-1')
		);
		await user.click(shareIcon);

		// assert
		expect(screen.getByText('something-went-wrong')).toBeInTheDocument();
	});
});
