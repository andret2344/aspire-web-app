import {mockedNavigate} from '../__mocks__/MockCommonService';
import {
	mockedChangePassword,
	mockedIsTokenValid
} from '../__mocks__/MockAuthService';
import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ProfilePage} from '../../main/Pages/ProfilePage';
import {renderForTest} from '../__utils__/RenderForTest';
import user from '@testing-library/user-event';

describe('ProfilePage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<ProfilePage />);

		// act
		const passwordSettingsText: HTMLElement =
			screen.getByText('password-settings');
		const saveButton: HTMLElement = screen.getByRole('button', {
			name: 'change-password'
		});

		// assert
		expect(passwordSettingsText).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
	});

	test('navigates without token', (): void => {
		// arrange
		renderForTest(<ProfilePage />);

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/');
	});

	test('check passwords are not equal', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedChangePassword.mockRejectedValue(400);
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<ProfilePage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByRole('button', {
			name: /change-password/i
		});
		const currentPasswordInput: HTMLElement =
			screen.getByPlaceholderText('current-password');
		const newPasswordInput: HTMLElement =
			screen.getByPlaceholderText('new-password');
		const confirmPasswordInput: HTMLElement =
			screen.getByPlaceholderText('confirm-password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe1234!Edit');
		await user.type(confirmPasswordInput, 'Testowe1234!Edit1');
		await user.click(changePasswordButton);
		const errorSnackbars: HTMLElement[] = screen.getAllByText(
			'passwords-not-equal'
		);

		// assert
		await waitFor((): void => {
			expect(errorSnackbars[0]).toBeInTheDocument();
			expect(errorSnackbars[1]).toBeInTheDocument();
		});
	});
	test('render error snackbar when server respond error', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedChangePassword.mockRejectedValue(400);
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<ProfilePage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByRole('button', {
			name: /change-password/i
		});
		const currentPasswordInput: HTMLElement =
			screen.getByPlaceholderText('current-password');
		const newPasswordInput: HTMLElement =
			screen.getByPlaceholderText('new-password');
		const confirmPasswordInput: HTMLElement =
			screen.getByPlaceholderText('confirm-password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe1234!Edit');
		await user.type(confirmPasswordInput, 'Testowe1234!Edit');
		await user.click(changePasswordButton);
		const errorSnackbar: HTMLElement = await screen.findByRole('alert');

		// assert
		await waitFor((): void => {
			expect(errorSnackbar).toHaveTextContent('password-invalid');
		});
	});

	test('successfull password change', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedChangePassword.mockResolvedValue(200);
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<ProfilePage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByRole('button', {
			name: /change-password/i
		});
		const currentPasswordInput: HTMLElement =
			screen.getByPlaceholderText('current-password');
		const newPasswordInput: HTMLElement =
			screen.getByPlaceholderText('new-password');
		const confirmPasswordInput: HTMLElement =
			screen.getByPlaceholderText('confirm-password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe123!Edit');
		await user.type(confirmPasswordInput, 'Testowe123!Edit');
		await user.click(changePasswordButton);

		// assert
		await waitFor((): void => {
			expect(mockedChangePassword).toHaveBeenCalledWith(
				'Testowe123!',
				'Testowe123!Edit',
				'Testowe123!Edit'
			);
		});
	});

	test('click on show password buttons', async (): Promise<void> => {
		// arrange
		user.setup();
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<ProfilePage />);

		// act
		const showPasswordButton: HTMLElement = screen.getByTestId(
			'visibility-icon-password'
		);
		const showPasswordRepeatButton: HTMLElement = screen.getByTestId(
			'visibility-icon-repeat-password'
		);
		const showPasswordRepeatConfButton: HTMLElement = screen.getByTestId(
			'visibility-icon-repeat-password-confirmation'
		);
		await user.click(showPasswordButton);
		await user.click(showPasswordRepeatButton);
		await user.click(showPasswordRepeatConfButton);

		// assert
		expect(showPasswordButton).toBeInTheDocument();
		expect(showPasswordRepeatButton).toBeInTheDocument();
		expect(showPasswordRepeatConfButton).toBeInTheDocument();
	});

	test('redirect successfully to index page if not logged in', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(false);

		// act
		renderForTest(<ProfilePage />);

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/');
	});
});
