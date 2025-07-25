import {mockedUseTokenValidation} from '../__mocks__/MockTokenValidationHook';
import {mockedNavigate} from '../__mocks__/MockCommonService';

import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {Route, Routes} from 'react-router-dom';
import user from '@testing-library/user-event';
import {AppLayout} from '@layout/AppLayout';
import {renderForTest} from '../__utils__/RenderForTest';

describe('AppLayout', (): void => {
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
		expect(mockedNavigate).toHaveBeenCalledWith('/');
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
});
