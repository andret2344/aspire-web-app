import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import {CssBaseline} from '@mui/material';
import {Header} from '@component/Header';
import {useUserData, useUserDataActions} from '@context/UserDataContext';
import {AppLayout} from '@layout/AppLayout';
import {AuthLayout} from '@layout/AuthLayout';
import {ConfirmEmailPage} from '@page/ConfirmEmailPage';
import {ErrorPage} from '@page/ErrorPage';
import {LoginPage} from '@page/LoginPage';
import {NewPasswordPage} from '@page/NewPasswordPage';
import {PasswordReminderPage} from '@page/PasswordReminderPage';
import {ProfilePage} from '@page/ProfilePage';
import {ReadonlyWishlistPage} from '@page/ReadonlyWishlistPage';
import {RegisterPage} from '@page/RegisterPage';
import {WishlistListPage} from '@page/WishlistListPage';
import {WishlistPage} from '@page/WishlistPage';
import {setConfig} from '@service/ApiInstance';
import {getConfig} from '@service/EnvironmentHelper';
import {appPaths} from './AppRoutes';

export function App(): React.ReactElement {
	const {loaded} = useUserData();
	const {setLoaded, refreshUser} = useUserDataActions();

	React.useEffect((): void => {
		getConfig()
			.then(setConfig)
			.then(refreshUser)
			.catch(console.error)
			.finally((): void => setLoaded(true));
	}, [setLoaded, refreshUser]);

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
						path={appPaths.login}
						element={<LoginPage />}
					/>
					<Route
						path={appPaths.register}
						element={<RegisterPage />}
					/>
					<Route
						path={appPaths.resetPassword}
						element={<PasswordReminderPage />}
					/>
					<Route
						path={appPaths.newPassword}
						element={<NewPasswordPage />}
					/>
				</Route>

				<Route element={<AppLayout />}>
					<Route
						path={appPaths.wishlists}
						element={<WishlistListPage />}
					/>
					<Route
						path={appPaths.wishlist}
						element={<WishlistPage />}
					/>
					<Route
						path={appPaths.profile}
						element={<ProfilePage />}
					/>
				</Route>

				<Route
					path={appPaths.readonlyWishlist}
					element={<ReadonlyWishlistPage />}
				/>

				<Route
					path={appPaths.confirmEmail}
					element={<ConfirmEmailPage />}
				/>

				<Route
					path={appPaths.notFound}
					element={<ErrorPage />}
				/>
			</Routes>
		</SnackbarProvider>
	);
}
