import {mockedAddWishlist} from '../../__mocks__/MockWishlistService';
import {mockedUseMediaQuery} from '../../__mocks__/MockMaterialUI';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {CreateWishlistModal} from '../../../Components/Modals/CreateWishlistModal';
import {WishList} from '../../../Entity/WishList';
import {renderForTest} from '../../Utils/RenderForTest';
import {act, fireEvent, RenderResult} from '@testing-library/react';

describe('WishlistModal', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'b838027b-9177-43d6-918e-67917f1d9b15',
		name: 'Mock Wishlist',
		wishlistItems: [],
		has_password: false
	};

	test('renders correctly', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(false);
		renderForTest(
			<CreateWishlistModal
				opened={true}
				onClose={(): void => undefined}
				onAddWishlist={(): void => undefined}
			/>
		);

		// act
		const saveButton: HTMLElement = screen.getByTestId('button-save');

		// assert
		expect(saveButton).toBeInTheDocument();
	});

	test('clicks enter work correctly', async (): Promise<void> => {
		// arrange
		const mockAdd: jest.Mock = jest.fn();
		mockedAddWishlist.mockResolvedValue(mockWishlistData);
		mockedUseMediaQuery.mockReturnValue(false);
		user.setup();

		// act
		await act(
			(): RenderResult =>
				renderForTest(
					<CreateWishlistModal
						opened={true}
						onClose={(): void => undefined}
						onAddWishlist={mockAdd}
					/>
				)
		);
		const input: HTMLInputElement = screen
			.getByTestId('input-wishlist-name')
			.querySelector('input') as HTMLInputElement;

		await act((): boolean =>
			fireEvent.change(input, {target: {value: 'new wishlist'}})
		);
		await act((): boolean => fireEvent.submit(input));

		// assert
		expect(mockAdd).toHaveBeenCalledTimes(1);
	});

	test('presses enter with empty input', async (): Promise<void> => {
		// arrange
		const mockAdd: jest.Mock = jest.fn();
		mockedUseMediaQuery.mockReturnValue(true);
		user.setup();

		// act
		renderForTest(
			<CreateWishlistModal
				opened={true}
				onClose={(): void => undefined}
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
