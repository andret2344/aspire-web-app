import React from 'react';
import {CssBaseline} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import {WishlistListPage} from '@pages/WishlistListPage';
import {LoginPage} from '@pages/LoginPage';
import {ErrorPage} from '@pages/ErrorPage';
import {ProfilePage} from '@pages/ProfilePage';
import {RegisterPage} from '@pages/RegisterPage';
import {SnackbarProvider} from 'notistack';
import {ReadonlyWishlistPage} from '@pages/ReadonlyWishlistPage';
import {getConfig} from '@service/EnvironmentHelper';
import {setConfig} from '@service/ApiInstance';
import {PasswordReminderPage} from '@pages/PasswordReminderPage';
import {NewPasswordPage} from '@pages/NewPasswordPage';
import './i18n';
import {refreshToken} from '@service/AuthService';
import {AppLayout} from '@layouts/AppLayout';
import {AuthLayout} from '@layouts/AuthLayout';
import {Header} from '@components/Header';
import {WishlistPage} from '@pages/WishlistPage';

export function App(): React.ReactElement {
	const [loaded, setLoaded] = React.useState<boolean>(false);

	React.useEffect((): void => {
		Promise.all([
			getConfig().then(setConfig).catch(),
			refreshToken().then().catch()
		]).finally((): void => setLoaded(true));
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
