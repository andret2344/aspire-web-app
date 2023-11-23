import React from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import {DarkModeProvider} from './Components/DarkModeContext';

const container = document.getElementById('root');

if (container) {
	const root = createRoot(container);
	root.render(
		<React.StrictMode>
			<BrowserRouter>
				<DarkModeProvider>
					<App />
				</DarkModeProvider>
			</BrowserRouter>
		</React.StrictMode>
	);
} else {
	console.error('Failed to find the root element');
}
