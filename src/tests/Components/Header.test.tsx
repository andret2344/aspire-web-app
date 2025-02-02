import {mockedIsTokenValid, mockedLogout} from '../__mocks__/MockAuthService';
import {mockedNavigate} from '../__mocks__/MockCommonService';
import React from 'react';
import {screen} from '@testing-library/dom';
import {act, RenderResult} from '@testing-library/react';
import '@testing-library/jest-dom';
import {Header} from '../../Components/Header';
import user from '@testing-library/user-event';
import {renderForTest} from '../Utils/RenderForTest';

describe('Header', (): void => {
	test('render with a valid token', (): void => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<Header />);

		// act
		const accountIcon: HTMLElement = screen.getByTestId('account-icon');

		// assert
		expect(accountIcon).toBeInTheDocument();
	});

	test('render with an invalid token', (): void => {
		// arrange
		mockedIsTokenValid.mockReturnValue(false);
		renderForTest(<Header />);

		// act
		const accountIcon: HTMLElement | null =
			screen.queryByTestId('account-icon');

		// assert
		expect(accountIcon).toBeNull();
	});

	test('menu opens', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<Header />);

		// act
		const accountIconButton: HTMLElement = screen.getByTestId(
			'account-icon-button'
		);
		await user.click(accountIconButton);
		const menu: HTMLElement = screen.getByTestId('menu');

		// assert
		expect(menu).toBeVisible();
	});

	test('menu closes', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		await act((): RenderResult => renderForTest(<Header />));

		// act
		const accountIconButton: HTMLElement = screen.getByTestId(
			'account-icon-button'
		);
		await user.click(accountIconButton);
		const menu: HTMLElement = screen.getByTestId('menu');
		expect(menu).toBeInTheDocument();
		const toClick: Element | null = menu.querySelector(
			'#menu > div:nth-child(1)'
		);

		if (toClick) {
			// assert
			await user.click(toClick);
		}

		expect(menu).not.toBeVisible();
	});

	test('logout', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<Header />);

		// act
		const accountIconButton: HTMLElement = screen.getByTestId(
			'account-icon-button'
		);
		await user.click(accountIconButton);
		const menu: HTMLElement = screen.getByTestId('menu');
		await user.click(menu);
		const menuItemLogout: HTMLElement =
			screen.getByTestId('menuitem-logout');
		await user.click(menuItemLogout);

		// assert
		expect(mockedLogout).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/');
	});

	test('profile', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<Header />);

		// act
		const accountIconButton = screen.getByTestId('account-icon-button');
		await user.click(accountIconButton);
		const menu = screen.getByTestId('menu');
		await user.click(menu);
		const menuItemProfile = screen.getByTestId('menuitem-profile');
		await user.click(menuItemProfile);

		// assert
		expect(mockedNavigate).toHaveBeenCalledTimes(1);
		expect(mockedNavigate).toHaveBeenCalledWith('/profile');
	});
});
