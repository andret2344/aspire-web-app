import {mockedIsTokenValid, mockedLogIn} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {act, fireEvent, RenderResult, waitFor} from '@testing-library/react';
import {renderForTest} from '../Utils/RenderForTest';
import {LoginPage} from '../../Pages/LoginPage';

describe('login page', (): void => {
	beforeEach((): void => localStorage.clear());

	test('renders', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// assert
		expect(screen.getByText('log-in')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
		expect(screen.getByText('log-in')).toBeInTheDocument();
	});

	test('renders correctly on small screen', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(<LoginPage />);

		// assert
		expect(screen.getByText('log-in')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
		expect(screen.getByText('log-in')).toBeInTheDocument();
	});

	test('login button is clickable', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// assert
		const loginButton: HTMLElement = screen.getByRole('button', {
			name: 'log-in'
		});
		expect(loginButton).toBeEnabled();
	});

	test('email input should accept text', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// assert
		const emailInput: HTMLElement = screen.getByPlaceholderText('login');
		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
		expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
	});

	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// act
		const passwordInput: HTMLElement =
			screen.getByPlaceholderText('password');
		const toggleButton: HTMLElement = screen.getByTestId('visibilityIcon');

		// assert
		expect(passwordInput).toHaveAttribute('type', 'password');
		fireEvent.click(toggleButton);
		expect(passwordInput).toHaveAttribute('type', 'text');
	});

	test('form submission with valid data', async (): Promise<void> => {
		// arrange
		mockedLogIn.mockResolvedValue(200);
		renderForTest(<LoginPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'log-in'}));

		// assert
		await waitFor((): void => {
			expect(mockedLogIn).toHaveBeenCalledWith(
				'test@example.com',
				'password123'
			);
		});
	});

	test('navigates to forgot password and sign-up pages', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// act
		const forgotPasswordLink: HTMLElement =
			screen.getByText('forgot-password');
		const signUpLink: HTMLElement = screen.getByText('sign-up');

		// assert
		expect(forgotPasswordLink).toBeInTheDocument();
		expect(signUpLink).toBeInTheDocument();
	});

	test('displays success snackbar on successful login', async (): Promise<void> => {
		// arrange
		mockedLogIn.mockResolvedValue(200);
		renderForTest(<LoginPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'log-in'}));

		// assert
		await waitFor((): void =>
			expect(
				screen.getByText('successfully-logged-in')
			).toBeInTheDocument()
		);
	});

	test('displays wrong credentials snackbar on login', async (): Promise<void> => {
		// arrange
		mockedLogIn.mockResolvedValue(401);
		renderForTest(<LoginPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'log-in'}));

		// assert
		await waitFor((): void =>
			expect(
				screen.getByText('wrong-login-or-password')
			).toBeInTheDocument()
		);
	});

	test('displays error snackbar on login when server error response', async (): Promise<void> => {
		// arrange
		mockedLogIn.mockResolvedValue(500);
		renderForTest(<LoginPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'log-in'}));

		// assert
		await waitFor((): void =>
			expect(screen.getByText('something-went-wrong')).toBeInTheDocument()
		);
	});

	test('redirect successfully to wishlist page if already logged in', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);

		// act
		await act((): RenderResult => renderForTest(<LoginPage />));

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/wishlists');
	});
});
