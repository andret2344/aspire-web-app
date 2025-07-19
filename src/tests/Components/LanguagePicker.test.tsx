import React from 'react';
import '@testing-library/jest-dom';
import {screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {LanguagePicker} from '../../main/Components/LanguagePicker';
import {renderForTest} from '../__utils__/RenderForTest';

describe('LanguagePicker', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<LanguagePicker />);

		// act
		const languageButton: HTMLElement = screen.getByRole('button');

		// assert
		expect(languageButton).toBeInTheDocument();
	});

	test('opens the menu when the button is clicked', async (): Promise<void> => {
		// arrange
		renderForTest(<LanguagePicker />);
		const languageButton: HTMLElement = screen.getByRole('button');

		// act
		await userEvent.click(languageButton);
		const list = screen.getByRole('menu');
		const listItem = within(list).getByText(/polski/i);

		// assert
		expect(listItem).toBeInTheDocument();
	});

	test('changes the language and closes menu', async (): Promise<void> => {
		// arrange
		renderForTest(<LanguagePicker />);
		const languageButton: HTMLElement = screen.getByRole('button');

		// act
		await userEvent.click(languageButton);
		const polishItem: HTMLElement = screen.getByText(/polski/i);
		await userEvent.click(polishItem);

		// assert
		await waitFor((): void => {
			const newButton: HTMLElement = screen.getByRole('button');
			expect(newButton).toHaveTextContent(/polski/i);
		});
	});
});
