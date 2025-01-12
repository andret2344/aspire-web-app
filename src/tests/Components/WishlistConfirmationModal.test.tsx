import React from 'react';
import {screen} from '@testing-library/dom';
import {fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {WishlistConfirmationModal} from '../../Components/WishlistConfirmationModal';
import {renderForTest} from '../Utils/RenderForTest';

describe('WishlistConfirmationModal', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(
			<WishlistConfirmationModal
				opened={true}
				wishlistName='test wishlist name'
				onRemove={(): void => undefined}
				toggleModal={(): void => undefined}
			/>
		);

		// act
		const dialog: HTMLElement = screen.getByTestId('delete-confirmation');

		// assert
		expect(dialog).toBeInTheDocument();
		expect(dialog).toHaveTextContent('delete-confirmation');
	});

	test('handles remove click', (): void => {
		// arrange
		const mockRemove: jest.Mock = jest.fn();

		// act
		renderForTest(
			<WishlistConfirmationModal
				opened={true}
				wishlistName='test wishlist name'
				onRemove={mockRemove}
				toggleModal={(): void => undefined}
			/>
		);
		const buttonOk: HTMLElement = screen.getByTestId('button-ok');
		fireEvent.click(buttonOk);

		// assert
		expect(mockRemove).toHaveBeenCalledTimes(1);
	});

	test('handles remove keyboard click', (): void => {
		// arrange
		const mockRemove: jest.Mock = jest.fn();

		// act
		renderForTest(
			<WishlistConfirmationModal
				opened={true}
				wishlistName='test wishlist name'
				onRemove={mockRemove}
				toggleModal={(): void => undefined}
			/>
		);
		const modal: HTMLElement = screen.getByTestId('wishlistConfModal');
		fireEvent.keyDown(modal, {
			key: 'Enter'
		});

		// assert
		expect(mockRemove).toHaveBeenCalledTimes(1);
	});

	test('handles other key', (): void => {
		// arrange
		const mockRemove: jest.Mock = jest.fn();

		// act
		renderForTest(
			<WishlistConfirmationModal
				opened={true}
				wishlistName='test wishlist name'
				onRemove={mockRemove}
				toggleModal={(): void => undefined}
			/>
		);
		const modal: HTMLElement = screen.getByTestId('wishlistConfModal');
		fireEvent.keyDown(modal, {
			key: 'A'
		});

		// assert
		expect(mockRemove).toHaveBeenCalledTimes(0);
	});
});
