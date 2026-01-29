import {mockedLogout} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
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
		const wishlistMenuItem: HTMLElement | null = screen.queryByText('wishlists');

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
		const drawerToggle: HTMLElement = screen.getByTestId('nav-drawer-toggle');

		// act
		await user.click(drawerToggle);

		// assert
		expect(handleToggle).toHaveBeenCalledTimes(1);
	});

	test('logout with confirmation', async (): Promise<void> => {
		// arrange
		renderForTest(
			<NavDrawer
				open={true}
				onToggle={(): void => undefined}
			/>
		);

		// act
		const menuItemLogout: HTMLElement = screen.getByTestId('nav-drawer-item-logout');
		await user.click(menuItemLogout);

		// assert - modal should be opened, logout not called yet
		expect(screen.getByText('log-out-confirm')).toBeInTheDocument();
		expect(mockedLogout).toHaveBeenCalledTimes(0);

		// act - confirm logout
		const confirmButton: HTMLElement = screen.getByTestId('button-save');
		await user.click(confirmButton);

		// assert
		expect(mockedLogout).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/');
	});

	test('logout with cancellation', async (): Promise<void> => {
		// arrange
		renderForTest(
			<NavDrawer
				open={true}
				onToggle={(): void => undefined}
			/>
		);

		// act
		const menuItemLogout: HTMLElement = screen.getByTestId('nav-drawer-item-logout');
		await user.click(menuItemLogout);

		// assert - modal should be opened
		expect(screen.getByText('log-out-confirm')).toBeInTheDocument();

		// act - cancel logout
		const cancelButton: HTMLElement = screen.getByTestId('button-cancel');
		await user.click(cancelButton);

		// assert - modal should be closed, logout not called
		expect(screen.queryByText('log-out-confirm')).not.toBeInTheDocument();
		expect(mockedLogout).toHaveBeenCalledTimes(0);
		expect(mockedNavigate).toHaveBeenCalledTimes(0);
	});
});
