import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import {mockedRequestResetPassword} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import '@testing-library/jest-dom';
import {PasswordReminderPage} from '@page/PasswordReminderPage';
import user from '@testing-library/user-event';
import {renderForTest} from '../__utils__/RenderForTest';

describe('PasswordReminderPage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<PasswordReminderPage />);

		// act
		const errorText: HTMLElement = screen.getByText('enter-email');

		// assert
		expect(errorText).toBeInTheDocument();
	});

	test('renders correctly on small screen', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(<PasswordReminderPage />);

		// act
		const errorText: HTMLElement = screen.getByText('enter-email');

		// assert
		expect(errorText).toBeInTheDocument();
	});

	test('navigates to log in and sign-up pages', (): void => {
		// arrange
		renderForTest(<PasswordReminderPage />);

		// act
		const logInLink: HTMLElement = screen.getByText('log-in');
		const signUpLink: HTMLElement = screen.getByText('sign-up');

		// assert
		expect(logInLink).toBeInTheDocument();
		expect(signUpLink).toBeInTheDocument();
	});

	test('send handle click', async (): Promise<void> => {
		// arrange
		mockedRequestResetPassword.mockResolvedValue(200);
		renderForTest(<PasswordReminderPage />);

		// act
		const sendButton: HTMLElement = screen.getByRole('button', {
			name: /send/i
		});
		const input: HTMLElement = screen.getByPlaceholderText('email-address');
		await user.type(input, 'test@example.com');
		await user.click(sendButton);

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/');
		});
	});

	test('displays error snackbar when server error response', async (): Promise<void> => {
		// arrange
		mockedRequestResetPassword.mockRejectedValue(500);
		renderForTest(<PasswordReminderPage />);

		// act
		const sendButton: HTMLElement = screen.getByRole('button', {
			name: /send/i
		});
		const input: HTMLElement = screen.getByPlaceholderText('email-address');
		await user.type(input, 'test@example.com');
		await user.click(sendButton);
		const errorSnackbar: HTMLElement = await screen.findByRole('alert');

		// assert
		await waitFor((): void => {
			expect(errorSnackbar).toHaveTextContent('something-went-wrong');
		});
	});
});
