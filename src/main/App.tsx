import React from 'react';
import {CssBaseline} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import {WishlistListPage} from './Page/WishlistListPage';
import {LoginPage} from './Page/LoginPage';
import {ErrorPage} from './Page/ErrorPage';
import {ProfilePage} from './Page/ProfilePage';
import {RegisterPage} from './Page/RegisterPage';
import {SnackbarProvider} from 'notistack';
import {ReadonlyWishlistPage} from './Page/ReadonlyWishlistPage';
import {getConfig} from './Service/EnvironmentHelper';
import {setConfig} from './Service/ApiInstance';
import {PasswordReminderPage} from './Page/PasswordReminderPage';
import {NewPasswordPage} from './Page/NewPasswordPage';
import './i18n';
import {refreshToken} from './Service/AuthService';
import {AppLayout} from './Layout/AppLayout';
import {AuthLayout} from './Layout/AuthLayout';
import {Header} from './Component/Header';
import {WishlistPage} from './Page/WishlistPage';

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
