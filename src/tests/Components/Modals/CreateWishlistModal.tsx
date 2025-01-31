import {mockedAddWishlist} from '../../__mocks__/MockWishlistService';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {CreateWishlistModal} from '../../../Components/Modals/CreateWishlistModal';
import {WishList} from '../../../Entity/WishList';
import {renderForTest} from '../../Utils/RenderForTest';

describe('WishlistModal', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: []
	};

	test('renders correctly', (): void => {
		// arrange
		renderForTest(
			<CreateWishlistModal
				opened={true}
				toggleModal={(): void => undefined}
				onAddWishlist={(): void => undefined}
			/>
		);

		// act
		const saveButton: HTMLElement = screen.getByRole('button', {
			name: 'save'
		});

		// assert
		expect(saveButton).toBeInTheDocument();
	});

	test('clicks enter work correctly', async (): Promise<void> => {
		// arrange
		const mockAdd: jest.Mock = jest.fn();
		mockedAddWishlist.mockResolvedValue(mockWishlistData);
		user.setup();

		// act
		renderForTest(
			<CreateWishlistModal
				opened={true}
				toggleModal={(): void => undefined}
				onAddWishlist={mockAdd}
			/>
		);
		const modal: HTMLElement = screen.getByTestId('add-wishlist-modal');
		const input: HTMLElement = screen.getByTestId('input-wishlist-name');

		// assert
		expect(modal).toBeInTheDocument();
		expect(input).toBeInTheDocument();

		await user.type(input, 'new wishlist');
		await user.keyboard('{enter}');

		expect(mockAdd).toHaveBeenCalledTimes(1);
	});

	test('presses enter with empty input', async (): Promise<void> => {
		// arrange
		const mockAdd: jest.Mock = jest.fn();
		user.setup();

		// act
		renderForTest(
			<CreateWishlistModal
				opened={true}
				toggleModal={(): void => undefined}
				onAddWishlist={mockAdd}
			/>
		);
		const input: HTMLElement = screen.getByPlaceholderText('name');
		await user.clear(input);
		await user.keyboard('{enter}');

		// assert
		expect(mockAdd).toHaveBeenCalledTimes(0);
	});
});
