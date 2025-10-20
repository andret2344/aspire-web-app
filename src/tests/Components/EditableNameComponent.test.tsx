import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {fireEvent} from '@testing-library/react';
import {renderForTest} from '../__utils__/RenderForTest';
import {EditableNameComponent} from '@component/EditableNameComponent';

describe('EditableNameComponent', (): void => {
	describe('rendering', (): void => {
		it('renders editable', (): void => {
			// arrange
			renderForTest(
				<EditableNameComponent
					name='Mock Wishlist'
					editable
					onChange={(): Promise<string> => Promise.resolve('')}
				/>
			);

			// act
			const editButton: HTMLElement = screen.getByTestId(
				'editable-name-button-edit'
			);

			// assert
			expect(editButton).toBeInTheDocument();
		});

		it('renders non-editable', (): void => {
			// arrange
			renderForTest(
				<EditableNameComponent
					name='Mock Wishlist'
					editable={false}
					onChange={(): Promise<string> => Promise.resolve('')}
				/>
			);

			// act
			const editButton: HTMLElement | null = screen.queryByTestId(
				'editable-name-button-edit'
			);

			// assert
			expect(editButton).toBeNull();
		});
	});

	describe('editing', (): void => {
		it('handles name change', async (): Promise<void> => {
			// arrange
			const handleChange: jest.Mock = jest.fn().mockResolvedValue(void 0);
			renderForTest(
				<EditableNameComponent
					name='Mock Wishlist'
					editable={true}
					onChange={handleChange}
				/>
			);

			// act
			const editButton: HTMLElement = screen.getByTestId(
				'editable-name-button-edit'
			);
			await user.click(editButton);
			const input: HTMLInputElement = screen
				.getByTestId('editable-name-input-name')
				.querySelector('input') as HTMLInputElement;
			fireEvent.change(input, {target: {value: 'Mock Wishlist updated'}});
			const doneButton: HTMLElement = screen.getByTestId(
				'editable-name-button-done'
			);
			await user.click(doneButton);

			// assert
			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith('Mock Wishlist updated');
		});

		it('handles cancel', async (): Promise<void> => {
			// arrange
			const handleChange: jest.Mock = jest.fn();
			renderForTest(
				<EditableNameComponent
					name='Mock Wishlist'
					editable={true}
					onChange={handleChange}
				/>
			);

			// act
			const editButton: HTMLElement = screen.getByTestId(
				'editable-name-button-edit'
			);
			await user.click(editButton);
			const confirmButton: HTMLElement = screen.getByTestId(
				'editable-name-button-done'
			);
			await user.click(confirmButton);

			// assert
			expect(handleChange).toHaveBeenCalledTimes(0);
		});
	});
});
