import {mockedUseNavigate} from '../__mocks__/MockCommonService';
import {
	mockedIsTokenValid,
	mockedChangePassword
} from '../__mocks__/MockAuthService';
import React from 'react';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ProfilePage} from '../../Pages/ProfilePage';
import {renderForTest} from '../Utils/RenderForTest';
import user from '@testing-library/user-event';

describe('ProfilePage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<ProfilePage />);

		// act
		const passwordSettingsText = screen.getByText('Password settings');
		const saveButton = screen.getByRole('button', {
			name: 'change password'
		});

		// assert
		expect(passwordSettingsText).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
	});

	test('navigates without token', (): void => {
		// arrange
		renderForTest(<ProfilePage />);

		// assert
		expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
		expect(mockedUseNavigate).toHaveBeenCalledWith('/');
	});

	test('check passwords are not equal', async (): Promise<void> => {
		//arrange
		user.setup();
		mockedChangePassword.mockRejectedValue(400);
		renderForTest(<ProfilePage />);

		//act
		const changePasswordButton = screen.getByRole('button', {
			name: /change password/i
		});
		const currentPasswordInput =
			screen.getByPlaceholderText('Current password');
		const newPasswordInput = screen.getByPlaceholderText('New password');
		const confirmPasswordInput =
			screen.getByPlaceholderText('Confirm password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe1234!Edit');
		await user.type(confirmPasswordInput, 'Testowe1234!Edit1');
		await user.click(changePasswordButton);
		const errorSnackbars = await screen.getAllByText(
			'Passwords are not equal.'
		);

		//assert
		await waitFor((): void => {
			expect(errorSnackbars[0]).toBeInTheDocument();
			expect(errorSnackbars[1]).toBeInTheDocument();
		});
	});
	test('render error snackbar when server respond error', async (): Promise<void> => {
		//arrange
		user.setup();
		mockedChangePassword.mockRejectedValue(400);
		renderForTest(<ProfilePage />);

		//act
		const changePasswordButton = screen.getByRole('button', {
			name: /change password/i
		});
		const currentPasswordInput =
			screen.getByPlaceholderText('Current password');
		const newPasswordInput = screen.getByPlaceholderText('New password');
		const confirmPasswordInput =
			screen.getByPlaceholderText('Confirm password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe1234!Edit');
		await user.type(confirmPasswordInput, 'Testowe1234!Edit');
		await user.click(changePasswordButton);
		const errorSnackbar = await screen.findByRole('alert');

		//assert
		await waitFor((): void => {
			expect(errorSnackbar).toHaveTextContent('Some error occurred!');
		});
	});

	test('successfull password change', async (): Promise<void> => {
		//arrange
		user.setup();
		mockedChangePassword.mockResolvedValue(200);
		renderForTest(<ProfilePage />);

		//act
		const changePasswordButton = screen.getByRole('button', {
			name: /change password/i
		});
		const currentPasswordInput =
			screen.getByPlaceholderText('Current password');
		const newPasswordInput = screen.getByPlaceholderText('New password');
		const confirmPasswordInput =
			screen.getByPlaceholderText('Confirm password');
		await user.type(currentPasswordInput, 'Testowe123!');
		await user.type(newPasswordInput, 'Testowe123!Edit');
		await user.type(confirmPasswordInput, 'Testowe123!Edit');
		await user.click(changePasswordButton);

		//assert

		await waitFor((): void => {
			expect(mockedChangePassword).toHaveBeenCalledWith(
				'Testowe123!',
				'Testowe123!Edit',
				'Testowe123!Edit'
			);
		});
	});

	test('click on show password buttons', async (): Promise<void> => {
		//arrange
		user.setup();
		renderForTest(<ProfilePage />);

		//act
		const showPasswordButton = screen.getByTestId('visibilityIconPassword');
		const showPasswordRepeatButton = screen.getByTestId(
			'visibilityIconRepeatPassword'
		);
		const showPasswordRepeatConfButton = screen.getByTestId(
			'visibilityIconRepeatPasswordConfirmation'
		);
		await user.click(showPasswordButton);
		await user.click(showPasswordRepeatButton);
		await user.click(showPasswordRepeatConfButton);

		//asserrt
		expect(showPasswordButton).toBeInTheDocument();
		expect(showPasswordRepeatButton).toBeInTheDocument();
		expect(showPasswordRepeatConfButton).toBeInTheDocument();
	});
});
