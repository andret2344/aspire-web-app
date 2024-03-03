import {mockedAddWishlist} from '../__mocks__/MockWishlistService';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {WishlistModal} from '../../Components/WishlistModal';
import user from '@testing-library/user-event';
import {WishList} from '../../Entity/WishList';
import {renderForTest} from '../Utils/RenderForTest';

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
			<WishlistModal
				opened={true}
				toggleModal={(): void => undefined}
				addNewWishlist={(): void => undefined}
			/>
		);

		// act
		const saveButton = screen.getByRole('button', {name: 'Save'});

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
			<WishlistModal
				opened={true}
				toggleModal={(): void => undefined}
				addNewWishlist={mockAdd}
			/>
		);
		const modal = screen.getByTestId('addWishlistModal');
		const input = screen.getByPlaceholderText(/name/i);

		// assert
		expect(modal).toBeInTheDocument();
		expect(input).toBeInTheDocument();

		await user.type(input, 'new wishlist');
		await user.keyboard('{enter}');

		expect(mockAdd).toHaveBeenCalledTimes(1);
	});
});
