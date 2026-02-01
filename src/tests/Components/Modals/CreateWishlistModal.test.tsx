import {mockedUseMediaQuery} from '../../__mocks__/MockMaterialUI';
import {mockedAddWishlist} from '../../__mocks__/MockWishlistService';
import {getSampleWishlistDto} from '../../__utils__/DataFactory';
import {renderForTest} from '../../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {CreateWishlistModal} from '@component/Modals/CreateWishlistModal';

describe('CreateWishlistModal', (): void => {
	test('renders correctly', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(false);
		renderForTest(
			<CreateWishlistModal
				open={true}
				onClose={(): void => undefined}
				onAddWishlist={(): void => undefined}
			/>
		);

		// act
		const saveButton: HTMLElement = screen.getByTestId('button-save');

		// assert
		expect(saveButton).toBeInTheDocument();
	});

	it('sends request on enter click', async (): Promise<void> => {
		// arrange
		const mockAdd: jest.Mock = jest.fn();
		mockedAddWishlist.mockResolvedValue(getSampleWishlistDto());
		mockedUseMediaQuery.mockReturnValue(false);

		// act
		renderForTest(
			<CreateWishlistModal
				open={true}
				onClose={(): void => undefined}
				onAddWishlist={mockAdd}
			/>
		);
		const input: HTMLInputElement = screen
			.getByTestId('input-wishlist-name')
			.querySelector('input') as HTMLInputElement;

		await user.type(input, 'New wishlist');
		await user.type(input, '{enter}');

		// assert
		expect(mockAdd).toHaveBeenCalledTimes(1);
	});

	test('does not send a request when submitting with an empty input', async (): Promise<void> => {
		// arrange
		const mockAdd: jest.Mock = jest.fn();
		mockedUseMediaQuery.mockReturnValue(true);

		// act
		renderForTest(
			<CreateWishlistModal
				open={true}
				onClose={(): void => undefined}
				onAddWishlist={mockAdd}
			/>
		);
		const input: HTMLElement = screen.getByLabelText('common.name');
		await user.clear(input);
		await user.keyboard('{enter}');

		// assert
		expect(mockAdd).toHaveBeenCalledTimes(0);
	});
});
