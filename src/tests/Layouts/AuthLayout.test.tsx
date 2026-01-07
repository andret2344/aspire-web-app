import {mockedUseTokenValidation} from '../__mocks__/MockTokenValidationHook';
import {mockedNavigate} from '../__mocks__/MockCommonService';

import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {Route, Routes} from 'react-router-dom';
import {AuthLayout} from '@layout/AuthLayout';
import {renderForTest} from '../__utils__/RenderForTest';

describe('AuthLayout', (): void => {
	it('renders without token invalid', (): void => {
		// arrange
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: false,
			tokenLoading: false
		});
		renderForTest(
			<Routes>
				<Route element={<AuthLayout />}>
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
				<Route element={<AuthLayout />}>
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

	it('renders with token valid', async (): Promise<void> => {
		// arrange
		mockedUseTokenValidation.mockReturnValue({
			tokenValid: true,
			tokenLoading: false
		});

		// act
		renderForTest(
			<Routes>
				<Route element={<AuthLayout />}>
					<Route
						path='/'
						element={<div>Wishlists</div>}
					/>
				</Route>
			</Routes>
		);

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/wishlists', {
			replace: true
		});
	});
});
