import {mockedUseNavigate} from '../__mocks__/MockCommonService';
import {mockedIsTokenValid, mockedLogIn} from '../__mocks__/MockAuthService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {fireEvent, waitFor} from '@testing-library/react';
import {renderForTest} from '../Utils/RenderForTest';
import {LoginPage} from '../../Pages/LoginPage';

describe('login page', (): void => {
	beforeEach((): void => localStorage.clear());

	test('renders', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// assert
		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByText('Login')).toBeInTheDocument();
	});

	test('renders correctly on small screen', (): void => {
		// arrange
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(<LoginPage />);

		// assert
		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByText('Login')).toBeInTheDocument();
	});

	test('login button is clickable', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// assert
		const loginButton = screen.getByRole('button', {name: 'Login'});
		expect(loginButton).toBeEnabled();
	});

	test('email input should accept text', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// assert
		const emailInput = screen.getByPlaceholderText('Login');
		fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
		expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
	});

	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// act
		const passwordInput = screen.getByPlaceholderText('Password');
		const toggleButton = screen.getByTestId('visibilityIcon');

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
		fireEvent.change(screen.getByPlaceholderText('Login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'Login'}));

		// assert
		await waitFor((): void => {
			expect(mockedLogIn).toHaveBeenCalledWith(
				'test@example.com',
				'password123'
			);
		});
	});

	test('navigates to forgot password and sign up pages', (): void => {
		// arrange
		renderForTest(<LoginPage />);

		// act
		const forgotPasswordLink = screen.getByText('Forgot password?');
		const signUpLink = screen.getByText('Sign up');

		// assert
		expect(forgotPasswordLink).toBeInTheDocument();
		expect(signUpLink).toBeInTheDocument();
	});

	test('displays success snackbar on successful login', async (): Promise<void> => {
		// arrange
		mockedLogIn.mockResolvedValue(200);
		renderForTest(<LoginPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('Login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'Login'}));

		// assert
		await waitFor((): void =>
			expect(
				screen.getByText('Successfully logged in.')
			).toBeInTheDocument()
		);
	});

	test('displays wrong credentials snackbar on login', async (): Promise<void> => {
		// arrange
		mockedLogIn.mockResolvedValue(401);
		renderForTest(<LoginPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('Login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'Login'}));

		// assert
		await waitFor((): void =>
			expect(
				screen.getByText('Wrong login or password. Try again!')
			).toBeInTheDocument()
		);
	});

	test('displays error snackbar on login when server error response', async (): Promise<void> => {
		// arrange
		mockedLogIn.mockResolvedValue(500);
		renderForTest(<LoginPage />);

		// act
		fireEvent.change(screen.getByPlaceholderText('Login'), {
			target: {value: 'test@example.com'}
		});
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
		fireEvent.click(screen.getByRole('button', {name: 'Login'}));

		// assert
		await waitFor((): void =>
			expect(
				screen.getByText('Something went wrong. Try again later.')
			).toBeInTheDocument()
		);
	});

	test('redirect successfully to wishlist page if already logged in and user enters to login page', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);

		// act
		renderForTest(<LoginPage />);

		// assert
		await waitFor((): void => {
			expect(mockedUseNavigate).toHaveBeenCalledWith('wishlists/');
		});
	});
});
