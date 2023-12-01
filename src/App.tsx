import './Styles/styles.css';
import React from 'react';
import {CssBaseline} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import {WishlistListPage} from './Pages/WishlistListPage';
import {LoginPage} from './Pages/LoginPage';
import {ErrorPage} from './Pages/ErrorPage';
import {ProfilePage} from './Pages/ProfilePage';
import {RegisterPage} from './Pages/RegisterPage';
import {SnackbarProvider} from 'notistack';
import {ReadonlyWishtlistPage} from './Pages/ReadonlyWishtlistPage';
import {Config, getConfig} from './Services/EnvironmentHelper';
import {setConfig} from './Services/ApiInstance';

export const App: React.FC = (): React.ReactElement => {
	const [loaded, setLoaded] = React.useState<boolean>(false);
	const fetchBaseUrl = async (): Promise<Config | undefined> => {
		return await getConfig();
	};

	React.useEffect((): void => {
		fetchBaseUrl()
			.then(setConfig)
			.then((): void => setLoaded(true));
	}, []);

	if (!loaded) {
		return <></>;
	}

	return (
		<SnackbarProvider
			autoHideDuration={2000}
			maxSnack={4}
		>
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
					path={'wishlist/:uuid'}
					element={<ReadonlyWishtlistPage />}
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
		</SnackbarProvider>
	);
};
