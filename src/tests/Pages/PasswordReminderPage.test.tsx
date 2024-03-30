import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import {mockedRequestResetPassword} from '../__mocks__/MockAuthService';
import {mockedUseNavigate} from '../__mocks__/MockCommonService';
import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
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

	test('navigates to log in and sign up pages', (): void => {
		// arrange
		renderForTest(<PasswordReminderPage />);

		// act
		const logInLink = screen.getByText('Log in');
		const signUpLink = screen.getByText('Sign up');

		// assert
		expect(logInLink).toBeInTheDocument();
		expect(signUpLink).toBeInTheDocument();
	});

	test('send handle click', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedRequestResetPassword.mockResolvedValue(200);
		renderForTest(<PasswordReminderPage />);

		// act
		const sendButton = screen.getByRole('button', {
			name: /send/i
		});
		const input = screen.getByPlaceholderText('E-mail address');
		await user.type(input, 'test@example.com');
		await user.click(sendButton);

		// assert
		await waitFor((): void => {
			expect(mockedUseNavigate).toHaveBeenCalledWith('/');
		});
	});

	test('displays error snackbar when server error response', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedRequestResetPassword.mockRejectedValue(500);
		renderForTest(<PasswordReminderPage />);

		//act
		const sendButton = screen.getByRole('button', {
			name: /send/i
		});
		const input = screen.getByPlaceholderText('E-mail address');
		await user.type(input, 'test@example.com');
		await user.click(sendButton);
		const errorSnackbar = await screen.findByRole('alert');

		// assert
		await waitFor((): void => {
			expect(errorSnackbar).toHaveTextContent('Some error occurred!');
		});
	});
});
