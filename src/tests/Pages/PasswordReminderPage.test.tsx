import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {PasswordReminderPage} from '../../Pages/PasswordReminderPage';
import user from '@testing-library/user-event';
import {renderForTest} from '../Utils/RenderForTest';

describe('PasswordReminderPage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<PasswordReminderPage />);

		// act
		const errorText = screen.getByText(
			`Enter your e-mail and we\'ll send you a link to reset your password`
		);

		// assert
		expect(errorText).toBeInTheDocument();
	});

	test('renders correctly on small screen', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(<PasswordReminderPage />);

		// act
		const errorText = screen.getByText(
			`Enter your e-mail and we\'ll send you a link to reset your password`
		);

		// assert
		expect(errorText).toBeInTheDocument();
	});

	test('send handle click', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(<PasswordReminderPage />);

		// act
		const sendButton = screen.getByRole('button', {
			name: /send/i
		});
		const input = screen.getByPlaceholderText('E-mail address');

		await user.type(input, 'test@example.com');
		await user.click(sendButton);

		// assert
		// TODO: Fill in after implementation
	});
});
