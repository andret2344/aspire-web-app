import {mockedChangePassword} from '../__mocks__/MockAuthService';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {ProfilePage} from '@page/ProfilePage';

describe('ProfilePage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<ProfilePage />);

		// act
		const passwordSettingsText: HTMLElement = screen.getByText('profile.password-settings');
		const saveButton: HTMLElement = screen.getByText('auth.change-password');

		// assert
		expect(passwordSettingsText).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
	});

	test('check passwords are not equal', async (): Promise<void> => {
		// arrange
		mockedChangePassword.mockRejectedValue(400);
		renderForTest(<ProfilePage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByText('auth.change-password');
		const currentPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.current-password');
		const newPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.new-password');
		const confirmPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.confirm-password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe1234!Edit');
		await user.type(confirmPasswordInput, 'Testowe1234!Edit1');
		await user.click(changePasswordButton);
		const errorSnackbars: HTMLElement[] = screen.getAllByText('auth.passwords-not-equal');

		// assert
		await waitFor((): void => {
			expect(errorSnackbars[0]).toBeInTheDocument();
			expect(errorSnackbars[1]).toBeInTheDocument();
		});
	});
	test('render error snackbar when server respond error', async (): Promise<void> => {
		// arrange
		mockedChangePassword.mockRejectedValue(400);
		renderForTest(<ProfilePage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByText('auth.change-password');
		const currentPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.current-password');
		const newPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.new-password');
		const confirmPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.confirm-password');
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

	test('successful password change', async (): Promise<void> => {
		// arrange
		mockedChangePassword.mockResolvedValue(200);
		renderForTest(<ProfilePage />);

		// act
		const changePasswordButton: HTMLElement = screen.getByText('auth.change-password');
		const currentPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.current-password');
		const newPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.new-password');
		const confirmPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.confirm-password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe123!Edit');
		await user.type(confirmPasswordInput, 'Testowe123!Edit');
		await user.click(changePasswordButton);

		// assert
		await waitFor((): void => {
			expect(mockedChangePassword).toHaveBeenCalledWith('Testowe123!', 'Testowe123!Edit', 'Testowe123!Edit');
		});
	});

	test('click on show password buttons', async (): Promise<void> => {
		// arrange
		renderForTest(<ProfilePage />);

		// act
		const showPasswordButton: HTMLElement = screen.getByTestId('visibility-icon-password');
		const showPasswordRepeatButton: HTMLElement = screen.getByTestId('visibility-icon-repeat-password');
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
});
