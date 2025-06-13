import React, {act} from 'react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {WishlistSetupPasswordModal} from '../../Components/Modals/WishlistSetupPasswordModal';
import {renderForTest} from '../Utils/RenderForTest';
import {fireEvent} from '@testing-library/react';
import {WishList} from '../../Entity/WishList';
import {mockedGetWishlistHiddenItems} from '../__mocks__/MockWishlistItemService';
import {mockedSetWishlistPassword} from '../__mocks__/MockWishlistService';
import user from '@testing-library/user-event';

describe('WishlistSetupPasswordModal', (): void => {
	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		hasPassword: false
	};

	const mockWishlistDataWithpassword: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		hasPassword: true
	};

	test('renders modal correctly', (): void => {
		//arrange
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={mockWishlistData}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				open={true}
			/>
		);
		// assert
		expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
	});

	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={mockWishlistData}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				open={true}
			/>
		);

		// act
		const passwordInput = screen.getByPlaceholderText('password');
		const toggleButton = screen.getByTestId('visibilityIcon');

		// assert
		expect(passwordInput).toHaveAttribute('type', 'password');
		fireEvent.click(toggleButton);
		expect(passwordInput).toHaveAttribute('type', 'text');
	});

	test('confirm button is clickable after filling password input when set new password', async (): Promise<void> => {
		//arrange
		mockedSetWishlistPassword.mockResolvedValue(200);
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={mockWishlistData}
				onClose={jest.fn()}
				onAccept={jest.fn()}
				open={true}
			/>
		);

		//act
		const confirmBtn: HTMLElement = screen.getByTestId(
			'wishlist-password-modal-confirm'
		);
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});

		//assert
		expect(confirmBtn).toHaveProperty('disabled', false);
		act(() => {
			user.click(confirmBtn);
		});
		waitFor((): void => {
			expect(screen.getByText('password-changed')).toBeInTheDocument();
		});
	});

	test('confirm button is clickable after filling password input when enter password', async (): Promise<void> => {
		//arrange
		mockedGetWishlistHiddenItems.mockResolvedValue(200);
		user.setup();
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={mockWishlistDataWithpassword}
				onClose={jest.fn()}
				onAccept={jest.fn()}
				open={true}
			/>
		);

		//act
		const confirmBtn: HTMLElement = screen.getByTestId(
			'wishlist-password-modal-confirm'
		);
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});

		//assert
		expect(confirmBtn).toHaveProperty('disabled', false);
		act(() => {
			user.click(confirmBtn);
		});
		waitFor((): void => {
			expect(screen.getByText('password-changed')).toBeInTheDocument();
		});
	});

	test('cancel button is clickable', (): void => {
		//arrange
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={mockWishlistData}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				open={true}
			/>
		);

		//assert & act
		fireEvent.click(screen.getByTestId('wishlist-password-modal-cancel'));
	});
});
