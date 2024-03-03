import {mockedUseNavigate} from '../__mocks__/MockCommonService';
import {mockedSignUp} from '../__mocks__/MockAuthService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import React from 'react';

import {fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {RegisterPage} from '../../Pages/RegisterPage';
import {screen} from '@testing-library/dom';
import {renderForTest} from '../Utils/RenderForTest';

describe('register page', (): void => {
	beforeEach((): void => localStorage.clear());

	test('renders', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// assert
		expect(screen.getByText('Register')).toBeInTheDocument();
		expect(
			screen.getByText('Already have an account?')
		).toBeInTheDocument();
		expect(screen.getByText('Sign in')).toBeInTheDocument();
	});

	test('renders correctly on small screen', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(<RegisterPage />);

		// assert
		expect(screen.getByText('Register')).toBeInTheDocument();
		expect(
			screen.getByText('Already have an account?')
		).toBeInTheDocument();
		expect(screen.getByText('Sign in')).toBeInTheDocument();
	});

	test('register button is clickable', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const registerButton = screen.getByRole('button', {name: 'Register'});

		// assert
		expect(registerButton).toBeEnabled();
	});

	test('email input should accept text', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const emailInput = screen.getByPlaceholderText('E-mail address');
		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});

		// assert
		expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
	});

	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const passwordInput = screen.getByPlaceholderText('Password');
		const repeatPasswordInput =
			screen.getByPlaceholderText('Repeat password');
		const toggleShowPasswordButton = screen.getByTestId(
			'visibilityIconPassword'
		);
		const toggleShowRepeatPasswordButton = screen.getByTestId(
			'visibilityIconRepeatPassword'
		);

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
		const loginPageButton = screen.getByText('Already have an account?');
		const signInLink = screen.getByText('Sign in');

		// assert
		expect(loginPageButton).toBeInTheDocument();
		expect(signInLink).toBeInTheDocument();
	});

	test('shows error and navigates to register page when passwords do not match', async () => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('E-mail address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('Repeat password'), {
			target: {value: 'differentPassword'}
		});

		fireEvent.click(screen.getByRole('button', {name: 'Register'}));

		// assert
		expect(
			await screen.findByText('Passwords are not equal.')
		).toBeInTheDocument();
	});

	test('navigates to home and shows success snackbar on successful registration', async () => {
		// arrange
		mockedSignUp.mockResolvedValue({status: 200});
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('E-mail address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('Repeat password'), {
			target: {value: 'password123'}
		});

		fireEvent.click(screen.getByRole('button', {name: 'Register'}));

		// assert
		await waitFor((): void => {
			expect(mockedUseNavigate).toHaveBeenCalledWith('/');
			expect(
				screen.getByText('Successfully created an account!')
			).toBeInTheDocument();
		});
	});

	test('shows error messages on failed registration because of email already exists', async () => {
		// arrange
		const mockError = {
			response: {
				data: {
					email: 'User with this email already exists.'
				}
			}
		};
		mockedSignUp.mockRejectedValue(mockError);
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('E-mail address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('Repeat password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'Register'}));

		// assert
		await waitFor((): void => {
			expect(
				screen.getByText('User with this email already exists.')
			).toBeInTheDocument();
		});
	});

	test('shows error messages on failed registration because of password is too short', async () => {
		// arrange
		const mockError = {
			response: {
				data: {
					password:
						'This password is too short. it must contain at least 8 characters.This password is too common.This password is entirely numeric.'
				}
			}
		};
		mockedSignUp.mockRejectedValue(mockError);
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('E-mail address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('Repeat password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'Register'}));

		// assert
		await waitFor((): void => {
			expect(
				screen.getByText(
					'This password is too short. it must contain at least 8 characters.This password is too common.This password is entirely numeric.'
				)
			).toBeInTheDocument();
		});
	});
});
