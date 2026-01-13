import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {BrowserRouter as Router} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import {DarkModeContext, DarkModeProvider} from '@context/DarkModeContext';
import {UserDataProvider} from '@context/UserDataContext';
import {RenderResult, render} from '@testing-library/react';
import i18n from '../__utils__/i18nForTests';

type ProviderDecorator = (element: React.ReactElement) => React.ReactElement;

function baseWrapper(element: React.ReactElement): React.ReactElement {
	return (
		<I18nextProvider i18n={i18n}>
			<Router>
				<SnackbarProvider>{element}</SnackbarProvider>
			</Router>
		</I18nextProvider>
	);
}

// Provider decorators
export function withDarkModeProvider(element: React.ReactElement): React.ReactElement {
	return <DarkModeProvider>{element}</DarkModeProvider>;
}

export const mockedToggleDarkMode: jest.Mock = jest.fn();

export function withMockedDarkModeProvider(element: React.ReactElement): React.ReactElement {
	return (
		<DarkModeContext.Provider
			value={{
				darkMode: true,
				toggleDarkMode: mockedToggleDarkMode
			}}
		>
			{element}
		</DarkModeContext.Provider>
	);
}

export function withUserDataProvider(element: React.ReactElement): React.ReactElement {
	return <UserDataProvider>{element}</UserDataProvider>;
}

// Main render function with optional decorators
export function renderForTest(
	element: React.ReactElement,
	decorators: ProviderDecorator[] = [withDarkModeProvider]
): RenderResult {
	let wrappedElement: React.ReactElement = baseWrapper(element);

	// Apply decorators
	for (const decorator of decorators) {
		wrappedElement = decorator(wrappedElement);
	}

	return render(wrappedElement);
}
