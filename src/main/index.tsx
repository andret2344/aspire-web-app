import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {DarkModeProvider} from '@context/DarkModeContext';
import {UserDataProvider} from '@context/UserDataContext';
import {App} from './App';
import './index.css';
import './i18n';

const container: HTMLElement | null = document.getElementById('root');

if (container) {
	const root: Root = createRoot(container);
	root.render(
		<React.StrictMode>
			<BrowserRouter>
				<DarkModeProvider>
					<UserDataProvider>
						<App />
					</UserDataProvider>
				</DarkModeProvider>
			</BrowserRouter>
		</React.StrictMode>
	);
} else {
	console.error('Failed to find the root element');
}
