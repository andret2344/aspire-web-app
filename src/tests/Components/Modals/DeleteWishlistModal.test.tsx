import '../../__mocks__/MockCommonService';
import React from 'react';
import {screen} from '@testing-library/dom';
import {act, fireEvent, RenderResult} from '@testing-library/react';
import '@testing-library/jest-dom';
import {DeleteWishlistModal} from '../../../Components/Modals/DeleteWishlistModal';
import {renderForTest} from '../../Utils/RenderForTest';

describe('DeleteWishlistModal', (): void => {
	test('renders correctly', (): void => {
		// arrange
		act(
			(): RenderResult =>
				renderForTest(
					<DeleteWishlistModal
						opened={true}
						wishlistName='test wishlist name'
						onRemove={(): void => undefined}
						toggleModal={(): void => undefined}
					/>
				)
		);

		// act
		const dialog: HTMLElement = screen.getByTestId('delete-confirmation');

		// assert
		expect(dialog).toBeInTheDocument();
		expect(dialog).toHaveTextContent(
			'Are you sure you want to delete the test wishlist name wishlist?'
		);
	});

	test('handles remove click', (): void => {
		// arrange
		const mockRemove: jest.Mock = jest.fn();

		// act
		renderForTest(
			<DeleteWishlistModal
				opened={true}
				wishlistName='test wishlist name'
				onRemove={mockRemove}
				toggleModal={(): void => undefined}
			/>
		);
		const buttonOk: HTMLElement = screen.getByTestId('button-delete');
		fireEvent.click(buttonOk);

		// assert
		expect(mockRemove).toHaveBeenCalledTimes(1);
	});

	test('handles other key', (): void => {
		// arrange
		const mockRemove: jest.Mock = jest.fn();

		// act
		renderForTest(
			<DeleteWishlistModal
				opened={true}
				wishlistName='test wishlist name'
				onRemove={mockRemove}
				toggleModal={(): void => undefined}
			/>
		);
		const modal: HTMLElement = screen.getByTestId('delete-wishlist-modal');
		fireEvent.keyDown(modal, {
			key: 'A'
		});

		// assert
		expect(mockRemove).toHaveBeenCalledTimes(0);
	});
});
