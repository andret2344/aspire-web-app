import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {Route, Routes} from 'react-router-dom';
import {AuthLayout} from '../../main/Layouts/AuthLayout';

describe('AuthLayout', (): void => {
	it('renders', (): void => {
		// arrange
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
});
