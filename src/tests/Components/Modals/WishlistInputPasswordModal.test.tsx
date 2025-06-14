import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../../Utils/RenderForTest';
import {WishList} from '../../../Entity/WishList';
import user from '@testing-library/user-event';
import {WishlistInputPasswordModal} from '../../../Components/Modals/WishlistInputPasswordModal';

describe('WishlistInputPasswordModal', (): void => {
	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		hasPassword: true
	};

	it('renders modal correctly', (): void => {
		// arrange
		user.setup();
		renderForTest(
			<WishlistInputPasswordModal
				wishlist={mockWishlistData}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				open={true}
			/>
		);

		// assert
		const element: HTMLElement = screen.getByTestId(
			'wishlist-password-modal-input'
		);
		expect(element).toBeInTheDocument();
	});

	it('changes password visibility on click', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(
			<WishlistInputPasswordModal
				wishlist={mockWishlistData}
				onAccept={(): void => undefined}
				onClose={(): void => undefined}
				open={true}
			/>
		);

		// act
		const passwordInput: HTMLElement = screen
			.getByTestId('wishlist-password-modal-input')
			.querySelector('input') as HTMLElement;
		const toggleButton: HTMLElement = screen.getByTestId(
			'password-visibility-icon'
		);

		// assert
		await user.click(toggleButton);
		expect(passwordInput).toHaveAttribute('type', 'text');
	});

	it('handles accept after entering a password', async (): Promise<void> => {
		// arrange
		user.setup();
		const mockAccept: jest.Mock = jest.fn();
		renderForTest(
			<WishlistInputPasswordModal
				wishlist={mockWishlistData}
				onAccept={mockAccept}
				onClose={(): void => undefined}
				open={true}
			/>
		);

		const confirmBtn: HTMLElement = screen.getByTestId(
			'wishlist-password-modal-confirm'
		);
		const inputElement: HTMLElement = screen
			.getByTestId('wishlist-password-modal-input')
			.querySelector('input') as HTMLElement;

		// act
		await user.type(inputElement, 'password123');
		await user.click(confirmBtn);

		//assert
		expect(mockAccept).toHaveBeenCalledTimes(1);
		expect(mockAccept).toHaveBeenCalledWith(1, 'password123');
	});

	it('handles cancel button', async (): Promise<void> => {
		// arrange
		user.setup();
		const mockClose: jest.Mock = jest.fn();
		renderForTest(
			<WishlistInputPasswordModal
				wishlist={mockWishlistData}
				onAccept={(): void => undefined}
				onClose={mockClose}
				open={true}
			/>
		);

		// act
		const cancelButton: HTMLElement = screen.getByTestId(
			'wishlist-password-modal-cancel'
		);

		// assert
		await user.click(cancelButton);
		expect(mockClose).toHaveBeenCalledTimes(1);
	});
});
