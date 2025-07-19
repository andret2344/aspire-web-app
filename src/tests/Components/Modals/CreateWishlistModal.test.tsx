import {mockedAddWishlist} from '../../__mocks__/MockWishlistService';
import {mockedUseMediaQuery} from '../../__mocks__/MockMaterialUI';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {CreateWishlistModal} from '../../../main/Components/Modals/CreateWishlistModal';
import {renderForTest} from '../../__utils__/RenderForTest';
import {act, fireEvent, RenderResult} from '@testing-library/react';
import {getSampleWishlist} from '../../__utils__/DataFactory';

describe('WishlistModal', (): void => {
	beforeEach((): void => localStorage.clear());

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
		mockedAddWishlist.mockResolvedValue(getSampleWishlist());
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
