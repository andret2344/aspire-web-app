import {
	mockedAddWishlist,
	mockedGetWishlists,
	mockedRemoveWishlist,
	mockedUpdateWishlistName
} from '../__mocks__/MockWishlistService';
import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {mockedIsTokenValid} from '../__mocks__/MockAuthService';
import user from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {act, fireEvent, RenderResult, waitFor} from '@testing-library/react';
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
		has_password: false
	};

	test('renders correctly with wishlist data', async (): Promise<void> => {
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
			expect(screen.getByText(mockWishlistData.name)).toBeInTheDocument();
			expect(screen.getByText('Item 1')).toBeInTheDocument();
		});
	});

	test('fetchWishlists correctly', async (): Promise<void> => {
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
		});
	});

	test('fetchAndSetWishlist navigates to /error when no wishlist is returned', async (): Promise<void> => {
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

	test('opens modal to add wishlist', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<WishlistListPage />);
		const addNewWishlistButton: HTMLElement =
			screen.getByText('add-new-wishlist');

		// assert
		expect(addNewWishlistButton).toBeInTheDocument();
		await user.click(addNewWishlistButton);
	});

	test('opens wishlist item modal', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
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

	test('clicks save button on empty modal', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
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
			has_password: false
		};
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
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
			has_password: false
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
		await act(async (): Promise<void> => user.click(addNewWishlistButton));
		const input: HTMLInputElement = screen
			.getByTestId('input-wishlist-name')
			.querySelector('input') as HTMLInputElement;
		await act((): boolean =>
			fireEvent.change(input, {target: {value: newWishlist.name}})
		);
		const saveButton: HTMLElement = screen.getByTestId('button-save');
		await act(async (): Promise<void> => user.click(saveButton));

		// assert
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
		mockedIsTokenValid.mockReturnValue(true);
		mockedRemoveWishlist.mockResolvedValue(void 0);

		// act
		await act(
			async (): Promise<RenderResult> =>
				renderForTest(<WishlistListPage />)
		);

		await act(
			(): Promise<void> =>
				user.click(screen.getByLabelText('delete-wishlist-1'))
		);

		await act(
			(): Promise<void> => user.click(screen.getByTestId('button-delete'))
		);

		// assert
		expect(screen.getByText('wishlist-removed')).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/wishlists');
	});

	test('remove wishlist rejected', async (): Promise<void> => {
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

		await act(
			(): Promise<void> =>
				user.click(screen.getByLabelText('delete-wishlist-1'))
		);

		// assert
		await act(
			(): Promise<void> => user.click(screen.getByTestId('button-delete'))
		);
		expect(screen.getByText('something-went-wrong')).toBeInTheDocument();
		expect(mockedRemoveWishlist).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledTimes(0);
	});

	test('copies url to clipboard', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedUseParams.mockReturnValue({id: '1'});
		mockedGetWishlists.mockResolvedValue([mockWishlistData]);
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

	test('redirect successfully to index page if not logged in', async (): Promise<void> => {
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
