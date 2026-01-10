import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import {CssBaseline} from '@mui/material';
import {Header} from '@component/Header';
import {useUserData, useUserDataActions} from '@context/UserDataContext';
import {mapFromResponse} from '@entity/UserData';
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
import {getUserData} from '@service/AuthService';
import {getConfig} from '@service/EnvironmentHelper';

export function App(): React.ReactElement {
	const {loaded} = useUserData();
	const {setUser, setLoaded} = useUserDataActions();

	React.useEffect((): void => {
		Promise.all([getConfig().then(setConfig), getUserData().then(mapFromResponse).then(setUser)])
			.catch(console.error)
			.finally((): void => setLoaded(true));
	}, [setLoaded, setUser]);

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
					path='confirm/:token'
					element={<ConfirmEmailPage />}
				/>

				<Route
					path='*'
					element={<ErrorPage />}
				/>
			</Routes>
		</SnackbarProvider>
	);
}
