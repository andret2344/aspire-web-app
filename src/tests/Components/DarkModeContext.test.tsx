import {renderForTest, renderForTestWithoutDarkModeProvider} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import {RenderResult, waitFor} from '@testing-library/react';
import user from '@testing-library/user-event';
import {useDarkMode} from '@component/DarkModeContext';

function TestComponent(): React.ReactElement {
	const {darkMode, toggleDarkMode} = useDarkMode();
	return (
		<div>
			<span>Dark mode is {darkMode ? 'on' : 'off'}</span>
			<button onClick={toggleDarkMode}>Toggle</button>
		</div>
	);
}

describe('DarkModeProvider', (): void => {
	test('render using provider', (): void => {
		// arrange
		renderForTest(<TestComponent />);

		// act
		const text: HTMLElement = screen.getByText('Dark mode is off');

		// assert
		expect(text).toBeInTheDocument();
	});

	test('turn dark mode on', async (): Promise<void> => {
		// arrange
		renderForTest(<TestComponent />);
		const button: HTMLElement = screen.getByText('Toggle');
		await user.click(button);

		// act
		const text: HTMLElement = await waitFor((): HTMLElement => screen.getByText('Dark mode is on'));

		// assert
		expect(text).toBeInTheDocument();
	});

	it('should read and write to localStorage', (): void => {
		// arrange
		const setItemMock: jest.SpyInstance = jest.spyOn(Storage.prototype, 'setItem');
		const getItemMock: jest.SpyInstance = jest
			.spyOn(Storage.prototype, 'getItem')
			.mockImplementation((): string => 'true');

		// act
		renderForTest(<TestComponent />);

		// assert
		expect(setItemMock).toHaveBeenCalledWith('dark-mode', 'true');
		expect(getItemMock).toHaveBeenCalledWith('dark-mode');
	});

	it('should throw an error when used outside of DarkModeProvider', (): void => {
		// act
		function renderer(): RenderResult {
			return renderForTestWithoutDarkModeProvider(<TestComponent />);
		}

		// assert
		expect(renderer).toThrow('useDarkMode must be used within a DarkModeProvider');
	});
});
