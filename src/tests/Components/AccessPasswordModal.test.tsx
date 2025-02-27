import React, {act} from 'react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {AccessPasswordModal} from '../../Components/AccessPasswordModal';
import {renderForTest} from '../Utils/RenderForTest';
import {fireEvent} from '@testing-library/react';
import {WishList} from '../../Entity/WishList';
import {mockedGetWishlistHiddenItems} from '../__mocks__/MockWishlistItemService';
import {mockedSetWishlistPassword} from '../__mocks__/MockWishlistService';

describe('AccessPasswordModal', (): void => {
	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		has_password: false
	};

	const mockWishlistDataWithPassword: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		has_password: true
	};

	test('renders modal correctly', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				opened={true}
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
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				opened={true}
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

	test('confirm button is clickable after filling password input when set new password', async (): Promise<void> => {
		//arrange
		mockedSetWishlistPassword.mockResolvedValue(200);
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				onClose={jest.fn()}
				onAccept={jest.fn()}
				opened={true}
			/>
		);

		//act
		const confirmBtn = screen.getByRole('button', {name: 'Confirm'});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});

		//assert
		expect(confirmBtn).toHaveProperty('disabled', false);
		await act(async () => {
			fireEvent.click(confirmBtn);
		});
	});

	test('confirm button is clickable after filling password input when enter password', async (): Promise<void> => {
		//arrange
		mockedGetWishlistHiddenItems.mockResolvedValue(200);
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistDataWithPassword}
				onClose={jest.fn()}
				onAccept={jest.fn()}
				opened={true}
			/>
		);

		//act
		const confirmBtn = screen.getByRole('button', {name: 'Confirm'});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});

		//assert
		expect(confirmBtn).toHaveProperty('disabled', false);
		await act(async () => {
			fireEvent.click(confirmBtn);
		});
	});

	// test('handle get hidden items with fail', async (): Promise<void> => {
	// 	//arrange
	// 	mockedGetWishlistHiddenItems.mockRejectedValue(401);
	// 	renderForTest(
	// 		<AccessPasswordModal
	// 			wishlist={mockWishlistDataWithPassword}
	// 			onClose={jest.fn()}
	// 			onAccept={jest.fn()}
	// 			opened={true}
	// 		/>
	// 	);

	// 	//act
	// 	const confirmBtn = screen.getByRole('button', {name: 'Confirm'});
	// 	fireEvent.change(screen.getByPlaceholderText('Password'), {
	// 		target: {value: 'password123'}
	// 	});

	// 	//assert
	// 	expect(confirmBtn).toHaveProperty('disabled', false);
	// 	await act(async () => {
	// 		fireEvent.click(confirmBtn);
	// 		console.log();
	// 	});
	// 	await waitFor((): void =>
	// 		expect(screen.getByText('password-invalid')).toBeInTheDocument()
	// 	);
	// });

	test('forgot password toggle works', async (): Promise<void> => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistDataWithPassword}
				onClose={jest.fn()}
				onAccept={jest.fn()}
				opened={true}
			/>
		);

		//act
		const forgotBtn = screen.getByRole('button', {
			name: 'forgot-password'
		});

		//assert
		await act(async () => {
			fireEvent.click(forgotBtn);
		});
		await waitFor(async () => {
			expect(
				await screen.getByText('Set password for this wishlist')
			).toBeInTheDocument();
		});
	});

	test('cancel button is clickable', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				wishlist={mockWishlistData}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				opened={true}
			/>
		);

		//assert & act
		fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
	});

	test('getWishlistHiddenItems returns empty hidden items array', async (): Promise<void> => {
		// Arrange
		mockedGetWishlistHiddenItems.mockRejectedValue(404);
		await act(async () => {
			renderForTest(
				<AccessPasswordModal
					wishlist={mockWishlistData}
					onClose={(): void => undefined}
					onAccept={jest.fn()}
					opened={true}
				/>
			);
		});

		// Act
		const confirmBtn = screen.getByRole('button', {name: 'Confirm'});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});

		//Assert
		await act(async () => {
			fireEvent.click(confirmBtn);
		});
	});
});
