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
import {ReadonlyWishlistPage} from './Pages/ReadonlyWishlistPage';
import {getConfig} from './Services/EnvironmentHelper';
import {setConfig} from './Services/ApiInstance';
import {PasswordReminderPage} from './Pages/PasswordReminderPage';
import {NewPasswordPage} from './Pages/NewPasswordPage';
import './i18n';
import {refreshToken} from './Services/AuthService';
import {AppLayout} from './Layouts/AppLayout';
import {AuthLayout} from './Layouts/AuthLayout';
import {Header} from './Components/Header';
import {WishlistPage} from './Pages/WishlistPage';

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
						path='wishlist/:uuid'
						element={<ReadonlyWishlistPage />}
					/>
					<Route
						path='profile'
						element={<ProfilePage />}
					/>
				</Route>

				<Route
					path='*'
					element={<ErrorPage />}
				/>
			</Routes>
		</SnackbarProvider>
	);
}
