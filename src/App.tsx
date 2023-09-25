import './styles.css';
import React from 'react';
import { CssBaseline, IconButton, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Route, Routes } from 'react-router-dom';
import { WishlistListView } from './WishlistListView';
import { LoginPage } from './LoginPage';
import { ErrorPage } from './ErrorPage';
import { ProfilePage } from './ProfilePage';

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
			<IconButton
				color={'warning'}
				sx={{ position: 'fixed', top: '5px', right: '5px' }}
				onClick={toggleDarkMode}
			>
				{darkMode ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>
			<CssBaseline />
			<Routes>
				<Route path={'/'} element={<LoginPage />} />
				<Route path={'wishlists'} element={<WishlistListView />} />
				<Route path={'profile'} element={<ProfilePage />} />
				<Route path={'*'} element={<ErrorPage />} />
			</Routes>
		</ThemeProvider>
	);
};
