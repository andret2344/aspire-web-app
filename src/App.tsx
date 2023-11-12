import './Styles/styles.css';
import React from 'react';
import {CssBaseline, IconButton, ThemeProvider} from '@mui/material';
import {darkTheme, lightTheme} from './Styles/theme';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {Route, Routes} from 'react-router-dom';
import {WishlistListPage} from './Pages/WishlistListPage';
import {LoginPage} from './Pages/LoginPage';
import {ErrorPage} from './Pages/ErrorPage';
import {ProfilePage} from './Pages/ProfilePage';
import {RegisterPage} from './Pages/RegisterPage';

export const App: React.FC = (): React.ReactElement => {
	const [darkMode, setDarkMode] = React.useState<boolean>(
		localStorage.getItem('dark-mode') === 'true'
	);

	React.useEffect((): void => {
		localStorage.setItem('dark-mode', JSON.stringify(darkMode));
	}, [darkMode]);

	const toggleDarkMode = (): void => {
		setDarkMode((prev: boolean): boolean => !prev);
	};

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<IconButton
				color={'warning'}
				sx={{position: 'absolute', top: '5px', right: '5px'}}
				onClick={toggleDarkMode}
			>
				{darkMode ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>
			<CssBaseline />
			<Routes>
				<Route
					path={'/'}
					element={<LoginPage />}
				/>
				<Route
					path={'register'}
					element={<RegisterPage />}
				/>
				<Route
					path={'wishlists'}
					element={<WishlistListPage />}
				/>
				<Route
					path={'wishlists/:id'}
					element={<WishlistListPage />}
				/>
				<Route
					path={'profile'}
					element={<ProfilePage />}
				/>
				<Route
					path={'*'}
					element={<ErrorPage />}
				/>
				<Route
					path={'error'}
					element={<ErrorPage />}
				/>
			</Routes>
		</ThemeProvider>
	);
};
