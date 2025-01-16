import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useTranslation} from 'react-i18next';
import {LanguagePicker} from '../../Components/LanguagePicker';
import {renderForTest} from '../Utils/RenderForTest';

jest.mock('react-i18next', () => ({
	useTranslation: jest.fn()
}));

describe('LanguagePicker', (): void => {
	const mockChangeLanguage: jest.Mock = jest.fn();

	beforeEach((): void => {
		jest.clearAllMocks();

		(useTranslation as jest.Mock).mockReturnValue({
			i18n: {
				language: 'en',
				changeLanguage: mockChangeLanguage
			}
		});
	});

	test('renders correctly', (): void => {
		// arrange
		renderForTest(<LanguagePicker />);

		// act
		const iconButton: HTMLElement = screen.getByRole('button');

		// assert
		expect(iconButton).toBeInTheDocument();
	});

	test('opens the menu when the icon button is clicked', async (): Promise<void> => {
		// arrange
		renderForTest(<LanguagePicker />);
		const iconButton: HTMLElement = screen.getByRole('button');

		// act
		await userEvent.click(iconButton);

		// assert
		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText('Polski')).toBeInTheDocument();
	});

	test('changes the language and closes menu', async (): Promise<void> => {
		// arrange
		renderForTest(<LanguagePicker />);
		const iconButton: HTMLElement = screen.getByRole('button');

		// act
		await userEvent.click(iconButton);
		const polishItem: HTMLElement = screen.getByText('Polski');
		await userEvent.click(polishItem);

		// assert
		expect(mockChangeLanguage).toHaveBeenCalledWith('pl');
		expect(screen.queryByText('Polski')).toBeNull();
	});
});
