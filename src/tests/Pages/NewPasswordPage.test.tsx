import {
	mockedUseNavigate,
	mockedUseParams
} from '../__mocks__/MockCommonService';
import {mockedResetPassword} from '../__mocks__/MockAuthService';
import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {NewPasswordPage} from '../../Pages/NewPasswordPage';
import user from '@testing-library/user-event';
import {renderForTest} from '../Utils/RenderForTest';

describe('NewPasswordPage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<NewPasswordPage />);

		//act
		const changePasswordButton: HTMLElement = screen.getByRole('button', {
			name: /change-password/i
		});

		//assert
		expect(changePasswordButton).toBeInTheDocument();
	});

	test('Redirect to main page when password reset successfully', async (): Promise<void> => {
		//arrange
		user.setup();
		mockedResetPassword.mockResolvedValue(200);
		const token = 'accessToken';
		mockedUseParams.mockReturnValue({
			token: token
		});
		renderForTest(<NewPasswordPage />);

		//act
		const changePasswordButton: HTMLElement = screen.getByRole('button', {
			name: /change-password/i
		});
		const passwordInput = screen.getByPlaceholderText('Password');
		const passwordRepeatInput =
			screen.getByPlaceholderText('repeat-password');
		await user.type(passwordInput, 'Testowe123!');
		await user.type(passwordRepeatInput, 'Testowe123!');
		await user.click(changePasswordButton);

		//assert
		await waitFor((): void => {
			expect(mockedResetPassword).toHaveBeenCalledWith(
				'Testowe123!',
				'Testowe123!',
				token
			);
			expect(mockedUseNavigate).toHaveBeenCalledWith('/');
		});
	});

	test('render error snackbar when server respond error', async (): Promise<void> => {
		//arrange
		user.setup();
		mockedResetPassword.mockRejectedValue(500);
		mockedUseParams.mockReturnValue({
			token: 'accessToken'
		});
		renderForTest(<NewPasswordPage />);

		//act
		const changePasswordButton: HTMLElement = screen.getByRole('button', {
			name: /change-password/i
		});
		const passwordInput: HTMLElement =
			screen.getByPlaceholderText('Password');
		const passwordRepeatInput: HTMLElement =
			screen.getByPlaceholderText('repeat-password');
		await user.type(passwordInput, 'Testowe123!');
		await user.type(passwordRepeatInput, 'Testowe123!');
		await user.click(changePasswordButton);
		const errorSnackbar: HTMLElement = await screen.findByRole('alert');

		//assert
		await waitFor((): void => {
			expect(errorSnackbar).toHaveTextContent('Some error occurred!');
		});
	});

	test('check passwords are not equal', async (): Promise<void> => {
		//arrange
		user.setup();
		mockedResetPassword.mockRejectedValue(400);
		renderForTest(<NewPasswordPage />);

		//act
		const changePasswordButton: HTMLElement = screen.getByRole('button', {
			name: /change-password/i
		});
		const passwordInput: HTMLElement =
			screen.getByPlaceholderText('Password');
		const passwordRepeatInput: HTMLElement =
			screen.getByPlaceholderText('repeat-password');
		await user.type(passwordInput, 'Testowe123!');
		await user.type(passwordRepeatInput, 'Testowe1234!');
		await user.click(changePasswordButton);
		const errorSnackbar: HTMLElement = await screen.getByText(
			'Passwords are not equal.'
		);

		//assert
		await waitFor((): void => {
			expect(errorSnackbar).toBeInTheDocument();
		});
	});

	test('click on show password buttons', async (): Promise<void> => {
		//arrange
		user.setup();
		renderForTest(<NewPasswordPage />);

		//act
		const showPasswordButton: HTMLElement = screen.getByTestId(
			'visibilityIconPassword'
		);
		const showPasswordRepeatButton: HTMLElement = screen.getByTestId(
			'visibilityIconRepeatPassword'
		);
		await user.click(showPasswordButton);
		await user.click(showPasswordRepeatButton);

		//assert
		expect(showPasswordButton).toBeInTheDocument();
		expect(showPasswordRepeatButton).toBeInTheDocument();
	});
});
