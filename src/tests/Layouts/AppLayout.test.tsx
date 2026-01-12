import {mockedVerifyEmail} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import {mockedUseTokenValidation} from '../__mocks__/MockTokenValidationHook';
import {mockedUseUserData} from '../__mocks__/MockUserDataContext';
import '../__mocks__/MockUserDataContext';
import '../__mocks__/MockAuthService';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {UserData} from '@entity/UserData';
import {AppLayout} from '@layout/AppLayout';

describe('AppLayout', (): void => {
	beforeEach((): void => {
		mockedUseUserData.mockReturnValue({
			user: {
				id: 1,
				email: 'test@example.com',
				isVerified: true,
				lastLogin: new Date()
			},
			loaded: true
		});
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});
	});

	it('renders with token valid', (): void => {
		// arrange
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});
		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		// act
		const wishlistDiv: HTMLElement = screen.getByText('Wishlists');

		// assert
		expect(wishlistDiv).toBeInTheDocument();
	});

	it('renders with token loading', (): void => {
		// arrange
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: false,
			tokenLoading: true
		});
		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		// act
		const wishlistDiv: HTMLElement | null = screen.queryByText('Wishlists');

		// assert
		expect(wishlistDiv).toBeNull();
	});

	it('renders with token invalid', (): void => {
		// arrange
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: false,
			tokenLoading: false
		});

		// act
		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/', {replace: true});
	});

	it('opens the nav drawer', async (): Promise<void> => {
		// arrange
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});
		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);
		const iconButton: HTMLElement = screen.getByTestId('nav-drawer-toggle');

		// act
		await user.click(iconButton);

		// assert
		const settingsMenuItem: HTMLElement = screen.getByText('settings');
		expect(settingsMenuItem).toBeInTheDocument();
	});

	it('does not render warning when user is verified', (): void => {
		// arrange
		const verifiedUser: UserData = {
			id: 1,
			email: 'test@example.com',
			isVerified: true,
			lastLogin: new Date()
		};
		mockedUseUserData.mockReturnValue({
			user: verifiedUser,
			loaded: true
		});
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});

		// act
		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		// assert
		const warningText: HTMLElement | null = screen.queryByText('email-not-verified');
		expect(warningText).toBeNull();
	});

	it('renders warning when user is not verified', (): void => {
		// arrange
		const unverifiedUser: UserData = {
			id: 1,
			email: 'test@example.com',
			isVerified: false,
			lastLogin: new Date()
		};
		mockedUseUserData.mockReturnValue({
			user: unverifiedUser,
			loaded: true
		});
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});

		// act
		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		// assert
		const warningText: HTMLElement = screen.getByText('email-not-verified');
		const verifyLink: HTMLElement = screen.getByText('verify');
		expect(warningText).toBeInTheDocument();
		expect(verifyLink).toBeInTheDocument();
	});

	it('does not render warning when loaded is false', (): void => {
		// arrange
		const unverifiedUser: UserData = {
			id: 1,
			email: 'test@example.com',
			isVerified: false,
			lastLogin: new Date()
		};
		mockedUseUserData.mockReturnValue({
			user: unverifiedUser,
			loaded: false
		});
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});

		// act
		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		// assert
		const warningText: HTMLElement | null = screen.queryByText('email-not-verified');
		expect(warningText).toBeNull();
	});

	it('calls verifyEmail when verify link is clicked', async (): Promise<void> => {
		// arrange
		const unverifiedUser: UserData = {
			id: 1,
			email: 'test@example.com',
			isVerified: false,
			lastLogin: new Date()
		};
		mockedUseUserData.mockReturnValue({
			user: unverifiedUser,
			loaded: true
		});
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});
		mockedVerifyEmail.mockResolvedValue(undefined);

		renderForTest(
			<Routes>
				<Route element={<AppLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		const verifyLink: HTMLElement = screen.getByText('verify');

		// act
		await user.click(verifyLink);

		// assert
		expect(mockedVerifyEmail).toHaveBeenCalledTimes(1);
		expect(mockedVerifyEmail).toHaveBeenCalledWith(unverifiedUser);
	});
});
