import {mockedLogIn} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';

import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {waitFor} from '@testing-library/react';
import {renderForTest} from '../__utils__/RenderForTest';
import {LoginPage} from '../../main/Page/LoginPage';

describe('LoginPage', (): void => {
	beforeEach((): void => localStorage.clear());

	describe('rendering', (): void => {
		it('renders', (): void => {
			// arrange
			renderForTest(<LoginPage />);

			// assert
			expect(
				screen.getByTestId('login-page-input-password')
			).toBeInTheDocument();
		});

		it('renders on a small screen', (): void => {
			// arrange
			mockedUseMediaQuery.mockReturnValue(true);
			renderForTest(<LoginPage />);

			// assert
			expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
		});
	});

	describe('form', (): void => {
		it('changes password input type on toggle click', async (): Promise<void> => {
			// arrange
			renderForTest(<LoginPage />);
			const passwordInput: HTMLElement = screen.getByTestId(
				'login-page-input-password'
			);
			const rootInput: HTMLInputElement = passwordInput.querySelector(
				'input'
			) as HTMLInputElement;

			// act
			const toggleButton: HTMLElement = screen.getByTestId(
				'password-visibility-icon'
			);
			await user.click(toggleButton);

			// assert
			expect(rootInput).toHaveAttribute('type', 'text');
		});

		it('submits correct data from the form', async (): Promise<void> => {
			// arrange
			mockedLogIn.mockResolvedValue(200);
			renderForTest(<LoginPage />);

			// act
			const usernameInput: HTMLElement = screen
				.getByTestId('login-page-input-username')
				.querySelector('input') as HTMLInputElement;
			await user.type(usernameInput, 'test@example.com');
			const passwordInput: HTMLElement = screen
				.getByTestId('login-page-input-password')
				.querySelector('input') as HTMLInputElement;
			await user.type(passwordInput, 'password123');
			const loginButton: HTMLElement = screen.getByTestId(
				'login-page-button-login'
			);
			await user.click(loginButton);

			// assert
			await waitFor((): void => {
				expect(mockedLogIn).toHaveBeenCalledTimes(1);
				expect(mockedLogIn).toHaveBeenCalledWith(
					'test@example.com',
					'password123'
				);
			});
		});

		it('displays success snackbar on successful login', async (): Promise<void> => {
			// arrange
			mockedLogIn.mockResolvedValue(200);
			renderForTest(<LoginPage />);

			// act
			const usernameInput: HTMLElement = screen
				.getByTestId('login-page-input-username')
				.querySelector('input') as HTMLInputElement;
			await user.type(usernameInput, 'test@example.com');
			const passwordInput: HTMLElement = screen
				.getByTestId('login-page-input-password')
				.querySelector('input') as HTMLInputElement;
			await user.type(passwordInput, 'password123');
			const loginButton: HTMLElement = screen.getByTestId(
				'login-page-button-login'
			);
			await user.click(loginButton);

			// assert
			await waitFor((): void =>
				expect(
					screen.getByText('successfully-logged-in')
				).toBeInTheDocument()
			);
			expect(mockedNavigate).toHaveBeenCalledTimes(1);
			expect(mockedNavigate).toHaveBeenCalledWith('/wishlists');
		});

		it('displays wrong credentials snackbar on login', async (): Promise<void> => {
			// arrange
			mockedLogIn.mockResolvedValue(401);
			renderForTest(<LoginPage />);

			// act
			const usernameInput: HTMLElement = screen
				.getByTestId('login-page-input-username')
				.querySelector('input') as HTMLInputElement;
			await user.type(usernameInput, 'test@example.com');
			const passwordInput: HTMLElement = screen
				.getByTestId('login-page-input-password')
				.querySelector('input') as HTMLInputElement;
			await user.type(passwordInput, 'password123');
			const loginButton: HTMLElement = screen.getByTestId(
				'login-page-button-login'
			);
			await user.click(loginButton);

			// assert
			await waitFor((): void =>
				expect(
					screen.getByText('wrong-login-or-password')
				).toBeInTheDocument()
			);
		});

		it('displays error snackbar on login when server error response', async (): Promise<void> => {
			// arrange
			mockedLogIn.mockResolvedValue(500);
			renderForTest(<LoginPage />);

			// act
			const usernameInput: HTMLElement = screen
				.getByTestId('login-page-input-username')
				.querySelector('input') as HTMLInputElement;
			await user.type(usernameInput, 'test@example.com');
			const passwordInput: HTMLElement = screen
				.getByTestId('login-page-input-password')
				.querySelector('input') as HTMLInputElement;
			await user.type(passwordInput, 'password123');
			const loginButton: HTMLElement = screen.getByTestId(
				'login-page-button-login'
			);
			await user.click(loginButton);

			// assert
			await waitFor((): void =>
				expect(
					screen.getByText('something-went-wrong')
				).toBeInTheDocument()
			);
		});
	});
});
