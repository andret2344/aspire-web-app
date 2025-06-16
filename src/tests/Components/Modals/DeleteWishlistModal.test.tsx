import '../../__mocks__/MockCommonService';
import React from 'react';
import {screen} from '@testing-library/dom';
import {act, fireEvent, RenderResult} from '@testing-library/react';
import '@testing-library/jest-dom';
import {DeleteWishlistModal} from '../../../main/Components/Modals/DeleteWishlistModal';
import {renderForTest} from '../../__utils__/RenderForTest';
import user from '@testing-library/user-event';

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
						onCancel={(): void => undefined}
					/>
				)
		);

		// act
		const modal: HTMLElement = screen.getByTestId('delete-wishlist-modal');

		// assert
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveTextContent(
			'Are you sure you want to delete the test wishlist name wishlist?'
		);
	});

	test('handles remove click', async (): Promise<void> => {
		// arrange
		const mockRemove: jest.Mock = jest.fn();

		// act
		renderForTest(
			<DeleteWishlistModal
				opened={true}
				wishlistName='test wishlist name'
				onRemove={mockRemove}
				onCancel={(): void => undefined}
			/>
		);
		const buttonOk: HTMLElement = screen.getByTestId(
			'delete-wishlist-modal-button-delete'
		);
		await act((): Promise<void> => user.click(buttonOk));

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
				onCancel={(): void => undefined}
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
