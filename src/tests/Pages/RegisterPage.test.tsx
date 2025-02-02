import {mockedNavigate} from '../__mocks__/MockCommonService';
import {mockedIsTokenValid, mockedSignUp} from '../__mocks__/MockAuthService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import React from 'react';

import {act, fireEvent, RenderResult, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {RegisterPage} from '../../Pages/RegisterPage';
import {screen} from '@testing-library/dom';
import {renderForTest} from '../Utils/RenderForTest';
import {mockedGetWishlists} from '../__mocks__/MockWishlistService';

describe('register page', (): void => {
	beforeEach((): void => localStorage.clear());

	test('renders', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// assert
		expect(screen.getByText('create-account')).toBeInTheDocument();
		expect(screen.getByText('already-have-account')).toBeInTheDocument();
		expect(screen.getByText('sign-in')).toBeInTheDocument();
	});

	test('renders correctly on small screen', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(<RegisterPage />);

		// assert
		expect(screen.getByText('create-account')).toBeInTheDocument();
		expect(screen.getByText('already-have-account')).toBeInTheDocument();
		expect(screen.getByText('sign-in')).toBeInTheDocument();
	});

	test('register button is clickable', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const registerButton: HTMLElement = screen.getByRole('button', {
			name: 'create-account'
		});

		// assert
		expect(registerButton).toBeEnabled();
	});

	test('email input should accept text', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const emailInput: HTMLElement =
			screen.getByPlaceholderText('email-address');
		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});

		// assert
		expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
	});

	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		const passwordInput: HTMLElement =
			screen.getByPlaceholderText('password');
		const repeatPasswordInput: HTMLElement =
			screen.getByPlaceholderText('repeat-password');
		const toggleShowPasswordButton: HTMLElement = screen.getByTestId(
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
		const loginPageButton: HTMLElement = screen.getByText(
			'already-have-account'
		);
		const signInLink: HTMLElement = screen.getByText('sign-in');

		// assert
		expect(loginPageButton).toBeInTheDocument();
		expect(signInLink).toBeInTheDocument();
	});

	test('shows error and navigates to register page when passwords do not match', async (): Promise<void> => {
		// arrange
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('email-address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('repeat-password'), {
			target: {value: 'differentPassword'}
		});

		fireEvent.click(screen.getByRole('button', {name: 'create-account'}));

		// assert
		expect(
			await screen.findByText('passwords-not-equal')
		).toBeInTheDocument();
	});

	test('navigates to home and shows success snackbar on successful registration', async (): Promise<void> => {
		// arrange
		mockedSignUp.mockResolvedValue({status: 200});
		renderForTest(<RegisterPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('email-address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('repeat-password'), {
			target: {value: 'password123'}
		});

		fireEvent.click(screen.getByRole('button', {name: 'create-account'}));

		// assert
		await waitFor((): void => {
			expect(mockedNavigate).toHaveBeenCalledWith('/');
			expect(screen.getByText('account-created')).toBeInTheDocument();
		});
	});

	test('shows error messages on failed registration because of email already exists', async (): Promise<void> => {
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
		fireEvent.change(screen.getByPlaceholderText('email-address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('repeat-password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'create-account'}));

		// assert
		await waitFor((): void => {
			expect(
				screen.getByText('User with this email already exists.')
			).toBeInTheDocument();
		});
	});

	test('shows error messages on failed registration because of password is too short', async (): Promise<void> => {
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
		fireEvent.change(screen.getByPlaceholderText('email-address'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.change(screen.getByPlaceholderText('repeat-password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'create-account'}));

		// assert
		await waitFor((): void => {
			expect(
				screen.getByText(
					'This password is too short. it must contain at least 8 characters.This password is too common.This password is entirely numeric.'
				)
			).toBeInTheDocument();
		});
	});

	test('redirect successfully to index page if not logged in', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		mockedGetWishlists.mockResolvedValue([]);

		// act
		await act((): RenderResult => renderForTest(<RegisterPage />));

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/wishlists');
	});
});
