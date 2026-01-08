import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {App} from './App';
import {DarkModeProvider} from './Context/DarkModeContext';
import './index.css';
import {UserDataProvider} from './Context/UserDataContext';

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
