import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import {CssBaseline} from '@mui/material';
import {ErrorPage} from '@page/ErrorPage';
import {LoginPage} from '@page/LoginPage';
import {NewPasswordPage} from '@page/NewPasswordPage';
import {PasswordReminderPage} from '@page/PasswordReminderPage';
import {ProfilePage} from '@page/ProfilePage';
import {ReadonlyWishlistPage} from '@page/ReadonlyWishlistPage';
import {RegisterPage} from '@page/RegisterPage';
import {WishlistListPage} from '@page/WishlistListPage';
import {setConfig} from '@service/ApiInstance';
import {getConfig} from '@service/EnvironmentHelper';
import './i18n';
import {Header} from '@component/Header';
import {AppLayout} from '@layout/AppLayout';
import {AuthLayout} from '@layout/AuthLayout';
import {WishlistPage} from '@page/WishlistPage';

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
