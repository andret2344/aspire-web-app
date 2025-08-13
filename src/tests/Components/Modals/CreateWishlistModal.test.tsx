import {mockedAddWishlist} from '../../__mocks__/MockWishlistService';
import {mockedUseMediaQuery} from '../../__mocks__/MockMaterialUI';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {CreateWishlistModal} from '../../../main/Component/Modals/CreateWishlistModal';
import {renderForTest} from '../../__utils__/RenderForTest';
import {getSampleWishlist} from '../../__utils__/DataFactory';

describe('CreateWishlistModal', (): void => {
	beforeEach((): void => localStorage.clear());

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
		mockedAddWishlist.mockResolvedValue(getSampleWishlist());
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
		const input: HTMLElement = screen.getByLabelText('name');
		await user.clear(input);
		await user.keyboard('{enter}');

		// assert
		expect(mockAdd).toHaveBeenCalledTimes(0);
	});
});
