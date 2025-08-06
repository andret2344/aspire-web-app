import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import {DarkModeProvider} from '@component/DarkModeContext';
import {FeatureFlagsProvider} from '@util/FeatureFlagContext';
import './index.css';

const container: HTMLElement | null = document.getElementById('root');

if (container) {
	const root: Root = createRoot(container);
	root.render(
		<React.StrictMode>
			<BrowserRouter>
				<DarkModeProvider>
					<FeatureFlagsProvider>
						<App />
					</FeatureFlagsProvider>
				</DarkModeProvider>
			</BrowserRouter>
		</React.StrictMode>
	);
} else {
	console.error('Failed to find the root element');
}
