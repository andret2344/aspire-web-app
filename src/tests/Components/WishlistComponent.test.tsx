import {mockedUseUserData} from '../__mocks__/MockUserDataContext';
import '../__mocks__/MockUserDataContext';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import {mockedSetWishlistPassword} from '../__mocks__/MockWishlistService';
import {getSampleWishlist} from '../__utils__/DataFactory';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {WishlistComponent} from '@component/WishlistComponent';

describe('WishlistComponent', (): void => {
	beforeEach((): void => {
		mockedUseUserData.mockReturnValue({
			user: {
				id: 1,
				email: 'test@example.com',
				isVerified: true,
				lastLogin: new Date()
			},
			loaded: true
		});
	});

	it('renders correctly without password', (): void => {
		// arrange
		renderForTest(
			<WishlistComponent
				wishlist={getSampleWishlist()}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		// act
		const wishlistTitle: HTMLElement = screen.getByText('Mock Wishlist');

		// assert
		expect(wishlistTitle).toBeInTheDocument();
	});

	it('renders correctly with password', (): void => {
		// arrange
		renderForTest(
			<WishlistComponent
				wishlist={getSampleWishlist({
					hasPassword: true
				})}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		// act
		const wishlistTitle: HTMLElement = screen.getByText('Mock Wishlist');

		// assert
		expect(wishlistTitle).toBeInTheDocument();
	});

	it('renders warning when trying to hide item', async (): Promise<void> => {
		// arrange
		renderForTest(
			<WishlistComponent
				wishlist={getSampleWishlist()}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);
		const hiddenItemsButton: HTMLElement = screen.getByTestId('hidden-items-icon-button');

		// act
		await user.click(hiddenItemsButton);

		// assert
		expect(screen.getByText('wishlist.set-wishlist-password')).toBeInTheDocument();
	});

	it('navigates to wishlist page on item click', async (): Promise<void> => {
		// arrange
		renderForTest(
			<WishlistComponent
				wishlist={getSampleWishlist()}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);
		const wishlistRowGrid: HTMLElement = screen.getByTestId('wishlist-row-grid-1');

		// act
		await user.click(wishlistRowGrid);

		// assert
		expect(mockedNavigate).toHaveBeenCalledWith('/wishlists/1');
	});

	describe('password modal', (): void => {
		it('closes opened set password modal', async (): Promise<void> => {
			// arrange
			mockedSetWishlistPassword.mockResolvedValue(null);
			renderForTest(
				<WishlistComponent
					wishlist={getSampleWishlist()}
					onRemove={(): void => undefined}
					onNameEdit={(): void => undefined}
					onPasswordChange={(): void => undefined}
				/>
			);

			await user.click(screen.getByTestId('hidden-items-icon-button'));

			// act
			await user.click(screen.getByTestId('wishlist-password-modal-cancel'));

			// assert
			expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(0);
		});

		it('handles password setting with success', async (): Promise<void> => {
			// arrange
			mockedSetWishlistPassword.mockResolvedValue(null);
			const handlePasswordChange: jest.Mock = jest.fn();
			renderForTest(
				<WishlistComponent
					wishlist={getSampleWishlist()}
					onRemove={(): void => undefined}
					onNameEdit={(): void => undefined}
					onPasswordChange={handlePasswordChange}
				/>
			);

			await user.click(screen.getByTestId('hidden-items-icon-button'));

			const input: HTMLInputElement = screen
				.getByTestId('wishlist-password-modal-input')
				.querySelector('input') as HTMLInputElement;

			await user.type(input, 'password');

			// act
			await user.click(screen.getByTestId('wishlist-password-modal-confirm'));

			// assert
			expect(screen.getByText('wishlist.access-code-changed')).toBeInTheDocument();
			expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(1);
			expect(mockedSetWishlistPassword).toHaveBeenCalledWith(1, 'password');
			expect(handlePasswordChange).toHaveBeenCalledTimes(1);
			expect(handlePasswordChange).toHaveBeenCalledWith('password');
		});

		it('handles password setting with failure', async (): Promise<void> => {
			// arrange
			mockedSetWishlistPassword.mockRejectedValue(null);
			const handlePasswordChange: jest.Mock = jest.fn();
			renderForTest(
				<WishlistComponent
					wishlist={getSampleWishlist()}
					onRemove={(): void => undefined}
					onNameEdit={(): void => undefined}
					onPasswordChange={handlePasswordChange}
				/>
			);

			await user.click(screen.getByTestId('hidden-items-icon-button'));

			const input: HTMLInputElement = screen
				.getByTestId('wishlist-password-modal-input')
				.querySelector('input') as HTMLInputElement;

			await user.type(input, 'password');

			// act
			await user.click(screen.getByTestId('wishlist-password-modal-confirm'));

			// assert
			expect(screen.getByText('messages.something-went-wrong')).toBeInTheDocument();
			expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(1);
			expect(mockedSetWishlistPassword).toHaveBeenCalledWith(1, 'password');
			expect(handlePasswordChange).toHaveBeenCalledTimes(0);
		});

		it('handles password clearing with success', async (): Promise<void> => {
			// arrange
			mockedSetWishlistPassword.mockResolvedValue(null);
			const handlePasswordChange: jest.Mock = jest.fn();
			renderForTest(
				<WishlistComponent
					wishlist={getSampleWishlist({
						hasPassword: true
					})}
					onRemove={(): void => undefined}
					onNameEdit={(): void => undefined}
					onPasswordChange={handlePasswordChange}
				/>
			);

			await user.click(screen.getByTestId('hidden-items-icon-button'));

			const input: HTMLInputElement = screen
				.getByTestId('wishlist-password-modal-input')
				.querySelector('input') as HTMLInputElement;

			await user.type(input, 'password');

			// act
			await user.click(screen.getByTestId('wishlist-password-modal-clear'));

			// assert
			expect(screen.getByText('wishlist.access-code-cleared')).toBeInTheDocument();
			expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(1);
			expect(mockedSetWishlistPassword).toHaveBeenCalledWith(1, '');
			expect(handlePasswordChange).toHaveBeenCalledTimes(1);
			expect(handlePasswordChange).toHaveBeenCalledWith('');
		});

		it('handles password clearing with failure', async (): Promise<void> => {
			// arrange
			mockedSetWishlistPassword.mockRejectedValue(null);
			renderForTest(
				<WishlistComponent
					wishlist={getSampleWishlist({
						hasPassword: true
					})}
					onRemove={(): void => undefined}
					onNameEdit={(): void => undefined}
					onPasswordChange={(): void => undefined}
				/>
			);

			await user.click(screen.getByTestId('hidden-items-icon-button'));

			const input: HTMLInputElement = screen
				.getByTestId('wishlist-password-modal-input')
				.querySelector('input') as HTMLInputElement;

			await user.type(input, 'password');

			// act
			await user.click(screen.getByTestId('wishlist-password-modal-clear'));

			// assert
			expect(screen.getByText('messages.something-went-wrong')).toBeInTheDocument();
			expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(1);
			expect(mockedSetWishlistPassword).toHaveBeenCalledWith(1, '');
		});
	});

	it('prevents navigation when clicking disabled share icon tooltip', async (): Promise<void> => {
		// arrange
		mockedUseUserData.mockReturnValue({
			user: {
				id: 1,
				email: 'test@example.com',
				isVerified: false,
				lastLogin: new Date()
			},
			loaded: true
		});

		renderForTest(
			<WishlistComponent
				wishlist={getSampleWishlist()}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		const tooltipWrapper: HTMLElement = screen.getByLabelText('wishlist.share-disabled');

		// act
		await user.click(tooltipWrapper);

		// assert
		expect(mockedNavigate).not.toHaveBeenCalled();
	});

	describe('clipboard', (): void => {
		beforeEach((): void => {
			Object.defineProperty(global.navigator, 'clipboard', {
				value: {
					writeText: jest.fn().mockResolvedValue(null),
					readText: jest
						.fn()
						.mockResolvedValue('http://localhost/wishlist/b838027b-9177-43d6-918e-67917f1d9b15')
				},
				configurable: true
			});
		});

		it('copies url to clipboard', async (): Promise<void> => {
			// arrange
			renderForTest(
				<WishlistComponent
					wishlist={getSampleWishlist({
						hasPassword: true
					})}
					onRemove={(): void => undefined}
					onNameEdit={(): void => undefined}
					onPasswordChange={(): void => undefined}
				/>
			);
			const shareIcon: HTMLElement = await waitFor((): HTMLElement => screen.getByTestId('share-icon-button-1'));

			// act
			await user.click(shareIcon);

			// assert
			const clipboardText: string = await navigator.clipboard.readText();
			expect(clipboardText).toBe('http://localhost/wishlist/b838027b-9177-43d6-918e-67917f1d9b15');
			expect(screen.getByText('messages.url-copied')).toBeInTheDocument();
		});

		it('throws an exception when copying to clipboard', async (): Promise<void> => {
			// arrange
			renderForTest(
				<WishlistComponent
					wishlist={getSampleWishlist({
						hasPassword: true
					})}
					onRemove={(): void => undefined}
					onNameEdit={(): void => undefined}
					onPasswordChange={(): void => undefined}
				/>
			);
			navigator.clipboard.writeText = jest.fn().mockRejectedValue(new Error('Failed to write to clipboard'));
			const shareIcon: HTMLElement = await waitFor((): HTMLElement => screen.getByTestId('share-icon-button-1'));

			// act
			await user.click(shareIcon);

			// assert
			expect(screen.getByText('messages.something-went-wrong')).toBeInTheDocument();
		});
	});
});
