import React from 'react';
import {CssBaseline} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import {WishlistListPage} from '@page/WishlistListPage';
import {LoginPage} from '@page/LoginPage';
import {ErrorPage} from '@page/ErrorPage';
import {ProfilePage} from '@page/ProfilePage';
import {RegisterPage} from '@page/RegisterPage';
import {SnackbarProvider} from 'notistack';
import {ReadonlyWishlistPage} from '@page/ReadonlyWishlistPage';
import {getConfig} from '@service/EnvironmentHelper';
import {setConfig} from '@service/ApiInstance';
import {PasswordReminderPage} from '@page/PasswordReminderPage';
import {NewPasswordPage} from '@page/NewPasswordPage';
import './i18n';
import {AppLayout} from '@layout/AppLayout';
import {AuthLayout} from '@layout/AuthLayout';
import {Header} from '@component/Header';
import {WishlistPage} from '@page/WishlistPage';
import {WishlistSettingsPage} from '@page/WishlistSettingsPage';

export function App(): React.ReactElement {
	const [loaded, setLoaded] = React.useState<boolean>(false);

	React.useEffect((): void => {
		getConfig()
			.then(setConfig)
			.catch(console.error)
			.finally((): void => setLoaded(true));
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
			<Header />
			<Routes>
				<Route element={<AuthLayout />}>
					<Route
						path='/'
						element={<LoginPage />}
					/>
					<Route
						path='register'
						element={<RegisterPage />}
					/>
					<Route
						path='reset-password'
						element={<PasswordReminderPage />}
					/>
					<Route
						path='new-password/:token'
						element={<NewPasswordPage />}
					/>
				</Route>

				<Route element={<AppLayout />}>
					<Route
						path='wishlists'
						element={<WishlistListPage />}
					/>
					<Route
						path='wishlists/:id'
						element={<WishlistPage />}
					/>
					<Route
						path='wishlists/:id/settings'
						element={<WishlistSettingsPage />}
					/>
					<Route
						path='profile'
						element={<ProfilePage />}
					/>
				</Route>

				<Route
					path='wishlist/:uuid'
					element={<ReadonlyWishlistPage />}
				/>

				<Route
					path='*'
					element={<ErrorPage />}
				/>
			</Routes>
		</SnackbarProvider>
	);
}
