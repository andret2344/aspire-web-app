import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {App} from './App';
import {DarkModeProvider} from './Component/DarkModeContext';
import './index.css';

const container: HTMLElement | null = document.getElementById('root');

if (container) {
	const root: Root = createRoot(container);
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
