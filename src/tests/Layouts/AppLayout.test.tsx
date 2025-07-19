import {renderForTest} from '../__utils__/RenderForTest';
import {Route, Routes} from 'react-router-dom';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import React from 'react';
import user from '@testing-library/user-event';
import {AppLayout} from '../../main/Layouts/AppLayout';

describe('AppLayout', (): void => {
	it('renders', (): void => {
		// arrange
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

	it('opens the nav drawer', async (): Promise<void> => {
		// arrange
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
