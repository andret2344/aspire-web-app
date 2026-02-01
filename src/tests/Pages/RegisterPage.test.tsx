import {mockedSignUp} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import {fireEvent, waitFor} from '@testing-library/react';
import {RegisterPage} from '@page/RegisterPage';

describe('RegisterPage', (): void => {
	test('renders', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// assert
		expect(screen.getByText('auth.create-account')).toBeInTheDocument();
		expect(screen.getByText('auth.already-have-account')).toBeInTheDocument();
		expect(screen.getByText('auth.sign-in')).toBeInTheDocument();
	});

	test('renders correctly on small screen', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(<RegisterPage />);

		// assert
		expect(screen.getByText('auth.create-account')).toBeInTheDocument();
		expect(screen.getByText('auth.already-have-account')).toBeInTheDocument();
		expect(screen.getByText('auth.sign-in')).toBeInTheDocument();
	});

	test('register button is clickable', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const registerButton: HTMLElement = screen.getByRole('button', {
			name: 'auth.create-account'
		});

		// assert
		expect(registerButton).toBeEnabled();
	});

	test('email input should accept text', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const emailInput: HTMLElement = screen.getByPlaceholderText('auth.email-address');
		fireEvent.change(emailInput, {
			target: {
				value: 'test@example.com'
			}
		});

		// assert
		expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
	});

	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const passwordInput: HTMLElement = screen.getByPlaceholderText('auth.password');
		const repeatPasswordInput: HTMLElement = screen.getByPlaceholderText('auth.repeat-password');
		const toggleShowPasswordButton: HTMLElement = screen.getByTestId('visibility-icon-password');
		const toggleShowRepeatPasswordButton = screen.getByTestId('visibility-icon-repeat-password');

		// assert
		expect(passwordInput).toHaveAttribute('type', 'password');
		expect(repeatPasswordInput).toHaveAttribute('type', 'password');
		fireEvent.click(toggleShowPasswordButton);
		fireEvent.click(toggleShowRepeatPasswordButton);
		expect(passwordInput).toHaveAttribute('type', 'text');
		expect(repeatPasswordInput).toHaveAttribute('type', 'text');
	});

	test('navigates to login page', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const loginPageButton: HTMLElement = screen.getByText('auth.already-have-account');
		const signInLink: HTMLElement = screen.getByText('auth.sign-in');

		// assert
		expect(loginPageButton).toBeInTheDocument();
		expect(signInLink).toBeInTheDocument();
	});

	test('shows error and navigates to register page when passwords do not match', async (): Promise<void> => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('auth.email-address'), {
			target: {
				value: 'test@example.com'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.repeat-password'), {
			target: {
				value: 'differentPassword'
			}
		});

		fireEvent.click(screen.getByText('auth.create-account'));

		// assert
		expect(await screen.findByText('auth.passwords-not-equal')).toBeInTheDocument();
	});

	test('navigates to home and shows success snackbar on successful registration', async (): Promise<void> => {
		// arrange
		mockedSignUp.mockResolvedValue({
			status: 200
		});
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('auth.email-address'), {
			target: {
				value: 'test@example.com'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.repeat-password'), {
			target: {
				value: 'password123'
			}
		});

		fireEvent.click(screen.getByText('auth.create-account'));

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/');
			expect(screen.getByText('messages.account-created')).toBeInTheDocument();
		});
	});

	test('shows error messages on failed registration because of email already exists', async (): Promise<void> => {
		// arrange
		const mockError = {
			response: {
				data: {
					detail: JSON.stringify([
						{
							field: 'email',
							error: 'validation.email.invalid'
						}
					])
				}
			}
		};
		mockedSignUp.mockRejectedValue(mockError);
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('auth.email-address'), {
			target: {
				value: 'test@example.com'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.repeat-password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.click(screen.getByText('auth.create-account'));

		// assert
		await waitFor((): void => {
			expect(screen.getByText('validation.email.invalid')).toBeInTheDocument();
		});
	});

	test('shows error messages on failed registration because of password is too short', async (): Promise<void> => {
		// arrange
		const mockError = {
			response: {
				data: {
					detail: JSON.stringify([
						{
							field: 'password',
							error: 'validation.password.too-short'
						}
					])
				}
			}
		};
		mockedSignUp.mockRejectedValue(mockError);
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('auth.email-address'), {
			target: {
				value: 'test@example.com'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.repeat-password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.click(screen.getByText('auth.create-account'));

		// assert
		await waitFor((): void => {
			expect(screen.getByText('validation.password.too-short')).toBeInTheDocument();
		});
	});

	test('skips unknown error', async (): Promise<void> => {
		// arrange
		const mockError = {
			response: {
				data: [{}]
			}
		};
		mockedSignUp.mockRejectedValue(mockError);
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('auth.email-address'), {
			target: {
				value: 'test@example.com'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.repeat-password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.click(screen.getByText('auth.create-account'));

		// assert
		await waitFor((): void => {
			expect(screen.queryByText('auth.account-created')).toBeNull();
		});
	});

	test('skips undefined error', async (): Promise<void> => {
		// arrange
		const mockError = {
			response: undefined
		};
		mockedSignUp.mockRejectedValue(mockError);
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('auth.email-address'), {
			target: {
				value: 'test@example.com'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.change(screen.getByPlaceholderText('auth.repeat-password'), {
			target: {
				value: 'password123'
			}
		});
		fireEvent.click(screen.getByText('auth.create-account'));

		// assert
		await waitFor((): void => {
			expect(screen.queryByText('auth.account-created')).toBeNull();
		});
	});
});
