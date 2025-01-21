import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {AccessPasswordModal} from '../../Components/AccessPasswordModal';
import {renderForTest} from '../Utils/RenderForTest';
import {fireEvent} from '@testing-library/react';
import {WishList} from '../../Entity/WishList';

describe('AccessPasswordModal', (): void => {
	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		has_hidden_items: false
	};

	test('renders modal correctly', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				getWishlistHiddenItems={() => undefined}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);
		// assert
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
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

	test('confirm button is clickable after filling password input', (): void => {
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
		const confirmBtn = screen.getByRole('button', {name: 'Confirm'});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});

		//assert
		expect(confirmBtn).toHaveProperty('disabled', false);
		fireEvent.click(confirmBtn);
	});

	test('cancel button is clickable', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				getWishlistHiddenItems={() => undefined}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);

		//assert & act
		fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
	});
});
