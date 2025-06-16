import {render, RenderResult} from '@testing-library/react';
import {DarkModeProvider} from '../../main/Components/DarkModeContext';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';

export function renderForTest(element: React.ReactElement): RenderResult {
	return render(
		<DarkModeProvider>
			<Router>
				<SnackbarProvider>{element}</SnackbarProvider>
			</Router>
		</DarkModeProvider>
	);
}

export function renderForTestWithoutProvider(
	element: React.ReactElement
): RenderResult {
	return render(
		<Router>
			<SnackbarProvider>{element}</SnackbarProvider>
		</Router>
	);
}
