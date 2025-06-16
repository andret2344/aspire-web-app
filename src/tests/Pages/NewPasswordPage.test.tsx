import {mockedNavigate, mockedUseParams} from '../__mocks__/MockCommonService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import {mockedResetPassword} from '../__mocks__/MockAuthService';

import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';

import {NewPasswordPage} from '../../main/Pages/NewPasswordPage';
import {renderForTest} from '../__utils__/RenderForTest';

describe('NewPasswordPage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<NewPasswordPage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByTestId(
			'button-change-password'
		);

		// assert
		expect(changePasswordButton).toBeInTheDocument();
	});

	test('renders small correctly', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValueOnce(true);
		renderForTest(<NewPasswordPage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByTestId(
			'button-change-password'
		);

		// assert
		expect(changePasswordButton).toBeInTheDocument();
	});

	test('Redirect to main page when password reset successfully', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedResetPassword.mockResolvedValue(200);
		const token = 'accessToken';
		mockedUseParams.mockReturnValue({
			token: token
		});
		renderForTest(<NewPasswordPage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByTestId(
			'button-change-password'
		);
		const passwordInput: HTMLElement =
			screen.getByPlaceholderText('password');
		const passwordRepeatInput: HTMLElement =
			screen.getByPlaceholderText('repeat-password');
		await user.type(passwordInput, 'Testowe123!');
		await user.type(passwordRepeatInput, 'Testowe123!');
		await user.click(changePasswordButton);

		// assert
		await waitFor((): void => {
			expect(mockedResetPassword).toHaveBeenCalledWith(
				'Testowe123!',
				'Testowe123!',
				token
			);
			expect(mockedNavigate).toHaveBeenCalledWith('/');
		});
	});

	test('render error snackbar when server respond error', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedResetPassword.mockRejectedValue(500);
		mockedUseParams.mockReturnValue({
			token: 'accessToken'
		});
		renderForTest(<NewPasswordPage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByTestId(
			'button-change-password'
		);
		const passwordInput: HTMLElement =
			screen.getByPlaceholderText('password');
		const passwordRepeatInput: HTMLElement =
			screen.getByPlaceholderText('repeat-password');
		await user.type(passwordInput, 'Testowe123!');
		await user.type(passwordRepeatInput, 'Testowe123!');
		await user.click(changePasswordButton);
		const errorSnackbar: HTMLElement = await screen.findByRole('alert');

		// assert
		await waitFor((): void => {
			expect(errorSnackbar).toHaveTextContent('something-went-wrong');
		});
	});

	test('check passwords are not equal', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(<NewPasswordPage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByTestId(
			'button-change-password'
		);
		const passwordInput: HTMLElement =
			screen.getByPlaceholderText('password');
		const passwordRepeatInput: HTMLElement =
			screen.getByPlaceholderText('repeat-password');
		await user.type(passwordInput, 'Testowe123!');
		await user.type(passwordRepeatInput, 'D1ff4r4n7!');
		await user.click(changePasswordButton);
		const errorSnackbar: HTMLElement = screen.getByText(
			'passwords-not-equal'
		);

		// assert
		await waitFor((): void => {
			expect(errorSnackbar).toBeInTheDocument();
		});
		expect(mockedResetPassword).toHaveBeenCalledTimes(0);
	});

	test('click on show password buttons', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(<NewPasswordPage />);

		// act
		const showPasswordButton: HTMLElement = screen.getByTestId(
			'visibility-icon-password'
		);
		const showPasswordRepeatButton: HTMLElement = screen.getByTestId(
			'visibility-icon-repeat-password'
		);
		await user.click(showPasswordButton);
		await user.click(showPasswordRepeatButton);

		// assert
		expect(showPasswordButton).toBeInTheDocument();
		expect(showPasswordRepeatButton).toBeInTheDocument();
	});
});
