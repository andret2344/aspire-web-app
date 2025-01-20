import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {AccessPasswordModal} from '../../Components/AccessPasswordModal';
import {renderForTest} from '../Utils/RenderForTest';
import {fireEvent} from '@testing-library/react';
import {WishList} from '../../Entity/WishList';
import {mockedGetWishlistHiddenItems} from '../__mocks__/MockWishlistItemService';

describe('AccessPasswordModal', (): void => {
	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		has_hidden_items: false
	};
	//arrange
	test('renders reveal modal corretly', (): void => {
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				getWishlistHiddenItems={() => undefined}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);
		// assert
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument;
	});

	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				getWishlistHiddenItems={() => undefined}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);

		// act
		const passwordInput = screen.getByPlaceholderText('Password');
		const toggleButton = screen.getByTestId('visibilityIcon');

		// assert
		expect(passwordInput).toHaveAttribute('type', 'password');
		fireEvent.click(toggleButton);
		expect(passwordInput).toHaveAttribute('type', 'text');
	});
	test('reveal modal works correctly with correct password', async (): Promise<void> => {
		//arrange
		mockedGetWishlistHiddenItems.mockResolvedValue(200);
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				getWishlistHiddenItems={() => undefined}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);

		//act
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'Confirm'}));

		//assert
		await waitFor((): void => {
			expect(mockedGetWishlistHiddenItems).toHaveBeenCalledWith(
				'password123'
			);
		});
	});

	test('cancel button is clickable in the reveal modal', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				getWishlistHiddenItems={() => undefined}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);

		//assert
		fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
	});
	test('confirm button works properly', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				getWishlistHiddenItems={() => undefined}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);
		//act
		const cofirmBtn = screen.getByText('Confirm');

		//assert
		// fireEvent.click(screen.getByRole('button', {: 'Confirm'}));
		fireEvent.click(cofirmBtn);
	});
});
