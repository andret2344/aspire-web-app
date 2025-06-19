import {render, RenderResult} from '@testing-library/react';
import {DarkModeProvider} from '../../main/Components/DarkModeContext';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import i18n from '../__utils__/i18nForTests';
import {I18nextProvider} from 'react-i18next';

export function renderForTest(element: React.ReactElement): RenderResult {
	return render(
		<DarkModeProvider>
			<I18nextProvider i18n={i18n}>
				<Router>
					<SnackbarProvider>{element}</SnackbarProvider>
				</Router>
			</I18nextProvider>
		</DarkModeProvider>
	);
}

export function renderForTestWithoutProvider(
	element: React.ReactElement
): RenderResult {
	return render(
		<I18nextProvider i18n={i18n}>
			<Router>
				<SnackbarProvider>{element}</SnackbarProvider>
			</Router>
		</I18nextProvider>
	);
}
