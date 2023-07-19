import './styles.css';
import React from 'react';
import { CssBaseline, IconButton, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { LoginPage } from './LoginPage';

export const App = () => {
	const [darkMode, setDarkMode] = React.useState<boolean>(
		localStorage.getItem('dark-mode') === 'true'
	);

	React.useEffect(() => {
		localStorage.setItem('dark-mode', JSON.stringify(darkMode));
	}, [darkMode]);

	const toggleDarkMode = () => {
		setDarkMode((prev) => !prev);
	};

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<IconButton
				color={'primary'}
				sx={{ position: 'fixed', top: '5px', right: '5px' }}
				onClick={toggleDarkMode}
			>
				{darkMode ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>
			<LoginPage />
		</ThemeProvider>
	);
};
