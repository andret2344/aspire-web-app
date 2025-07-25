import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {WishlistSetupPasswordModal} from '../../../main/Component/Modals/WishlistSetupPasswordModal';
import {renderForTest} from '../../__utils__/RenderForTest';
import user from '@testing-library/user-event';
import {getSampleWishlist} from '../../__utils__/DataFactory';

describe('WishlistSetupPasswordModal', (): void => {
	it('renders modal correctly', (): void => {
		// arrange
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={getSampleWishlist()}
				onClose={(): void => undefined}
				onClear={(): void => undefined}
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
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={getSampleWishlist()}
				onAccept={(): void => undefined}
				onClear={(): void => undefined}
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
		const mockAccept: jest.Mock = jest.fn();
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={getSampleWishlist()}
				onAccept={mockAccept}
				onClear={(): void => undefined}
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

	it('handles clear after entering a password', async (): Promise<void> => {
		// arrange
		const mockClear: jest.Mock = jest.fn();
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={getSampleWishlist({hasPassword: true})}
				onAccept={(): void => undefined}
				onClear={mockClear}
				onClose={(): void => undefined}
				open={true}
			/>
		);

		const clearBtn: HTMLElement = screen.getByTestId(
			'wishlist-password-modal-clear'
		);

		// act
		await user.click(clearBtn);

		//assert
		expect(mockClear).toHaveBeenCalledTimes(1);
		expect(mockClear).toHaveBeenCalledWith(1);
	});

	it('handles cancel button', async (): Promise<void> => {
		// arrange
		const mockClose: jest.Mock = jest.fn();
		renderForTest(
			<WishlistSetupPasswordModal
				wishlist={getSampleWishlist()}
				onAccept={(): void => undefined}
				onClear={(): void => undefined}
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
