import {mockedLogout} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';

import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import React from 'react';

import {renderForTest} from '../__utils__/RenderForTest';
import {NavDrawer} from '@component/NavDrawer';

describe('NavDrawer', (): void => {
	it('renders closed', (): void => {
		// arrange
		renderForTest(
			<NavDrawer
				open={false}
				onToggle={(): void => undefined}
			/>
		);

		// act
		const wishlistMenuItem: HTMLElement | null =
			screen.queryByText('wishlists');

		// assert
		expect(wishlistMenuItem).toBeNull();
	});

	it('renders opened', (): void => {
		// arrange
		renderForTest(
			<NavDrawer
				open={true}
				onToggle={(): void => undefined}
			/>
		);

		// act
		const wishlistMenuItem: HTMLElement = screen.getByText('wishlists');

		// assert
		expect(wishlistMenuItem).toBeInTheDocument();
	});

	it('handles toggle', async (): Promise<void> => {
		// arrange
		const handleToggle: jest.Mock = jest.fn();
		renderForTest(
			<NavDrawer
				open={true}
				onToggle={handleToggle}
			/>
		);
		const drawerToggle: HTMLElement =
			screen.getByTestId('nav-drawer-toggle');

		// act
		await user.click(drawerToggle);

		// assert
		expect(handleToggle).toHaveBeenCalledTimes(1);
	});

	test('logout', async (): Promise<void> => {
		// arrange
		renderForTest(
			<NavDrawer
				open={true}
				onToggle={(): void => undefined}
			/>
		);

		// act
		const menuItemLogout: HTMLElement = screen.getByTestId(
			'nav-drawer-item-logout'
		);
		await user.click(menuItemLogout);

		// assert
		expect(mockedLogout).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/', {replace: true});
	});
});
