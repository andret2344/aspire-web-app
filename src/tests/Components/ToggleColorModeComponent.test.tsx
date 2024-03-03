import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ToggleColorModeComponent} from '../../Components/ToggleColorModeComponent';
import user from '@testing-library/user-event';
import {renderForTest} from '../Utils/RenderForTest';

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
		const iconLight = screen.getByTestId('icon-light');

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
		const iconDark = screen.getByTestId('icon-dark');

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
		const iconButton = screen.getByTestId('icon-button');
		await user.click(iconButton);

		// assert
		expect(mockedToggle).toHaveBeenCalledTimes(1);
	});
});
