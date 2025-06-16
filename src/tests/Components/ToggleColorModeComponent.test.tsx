import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ToggleColorModeComponent} from '../../main/Components/ToggleColorModeComponent';
import user from '@testing-library/user-event';
import {renderForTest} from '../__utils__/RenderForTest';

describe('ToggleColorModeComponent', (): void => {
	test('renders light icon', (): void => {
		// arrange
		renderForTest(
			<ToggleColorModeComponent
				darkMode={true}
				toggleDarkMode={(): undefined => undefined}
			/>
		);

		// act
		const iconLight: HTMLElement = screen.getByTestId('icon-light');

		// assert
		expect(iconLight).toBeInTheDocument();
	});

	test('renders dark icon', (): void => {
		// arrange
		renderForTest(
			<ToggleColorModeComponent
				darkMode={false}
				toggleDarkMode={(): undefined => undefined}
			/>
		);

		// act
		const iconDark: HTMLElement = screen.getByTestId('icon-dark');

		// assert
		expect(iconDark).toBeInTheDocument();
	});

	test('handle click', async (): Promise<void> => {
		// arrange
		const mockedToggle: jest.Mock = jest.fn();
		renderForTest(
			<ToggleColorModeComponent
				darkMode={true}
				toggleDarkMode={mockedToggle}
			/>
		);

		// act
		const iconButton: HTMLElement = screen.getByTestId('icon-button');
		await user.click(iconButton);

		// assert
		expect(mockedToggle).toHaveBeenCalledTimes(1);
	});
});
