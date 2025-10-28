import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
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
			await user.type(input, ' updated');
			const doneButton: HTMLElement = screen.getByTestId(
				'editable-name-button-done'
			);
			await user.click(doneButton);

			// assert
			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(handleChange).toHaveBeenCalledWith('Mock Wishlist updated');
		});

		it('handles name not changed', async (): Promise<void> => {
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
			const doneButton: HTMLElement = screen.getByTestId(
				'editable-name-button-done'
			);
			await user.click(doneButton);

			// assert
			expect(handleChange).toHaveBeenCalledTimes(0);
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

		it('handles exception', async (): Promise<void> => {
			// arrange
			const handleChange: jest.Mock = jest.fn().mockRejectedValue(void 0);
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
			await user.type(input, ' updated');
			const confirmButton: HTMLElement = screen.getByTestId(
				'editable-name-button-done'
			);
			await user.click(confirmButton);

			// assert
			const error: HTMLElement = await screen.findByText(
				'something-went-wrong'
			);
			expect(error).toBeInTheDocument();
		});
	});
});
