import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavigateFunction, Outlet, useNavigate} from 'react-router-dom';
import {Box, Theme, Typography} from '@mui/material';
import {SystemStyleObject} from '@mui/system';
import {NavDrawer} from '@component/NavDrawer';
import {useUserData} from '@context/UserDataContext';
import {useTokenValidation} from '@hook/useTokenValidation';
import {verifyEmail} from '@service/AuthService';
import {getThemeColor} from '@util/theme';
import {appPaths} from '../AppRoutes';

export function AppLayout(): React.ReactElement {
	const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
	const {user, loaded} = useUserData();
	const {t: tAuth} = useTranslation('auth');

	const {tokenLoading, tokenValid} = useTokenValidation();
	const navigate: NavigateFunction = useNavigate();

	React.useEffect((): void => {
		if (tokenLoading) {
			return;
		}
		if (!tokenValid) {
			navigate(appPaths.login, {replace: true});
		}
	}, [tokenLoading, tokenValid, navigate]);

	if (!user || tokenLoading || !tokenValid) {
		return <></>;
	}

	function handleDrawerToggle(): void {
		return setIsDrawerOpen(!isDrawerOpen);
	}

	function handleVerifyClick(): void {
		verifyEmail(user!).then();
	}

	function renderWarning(): React.ReactElement {
		if (user!.isVerified || !loaded) {
			return <></>;
		}
		return (
			<Box
				sx={(theme: Theme): SystemStyleObject<Theme> => ({
					backgroundColor: getThemeColor(theme, 'redError'),
					position: 'absolute',
					marginTop: '3.5rem',
					width: '100%',
					zIndex: 1000,
					display: 'flex',
					padding: '0.4rem 1rem',
					justifyContent: 'center',
					alignItems: 'center',
					color: 'white'
				})}
			>
				<Typography
					variant='body2'
					noWrap
					fontWeight={700}
				>
					{tAuth('email-not-verified')}&nbsp;
				</Typography>
				<Typography
					sx={{
						textDecoration: 'underline',
						cursor: 'pointer'
					}}
					variant='body2'
					noWrap
					onClick={handleVerifyClick}
					fontWeight={700}
				>
					{tAuth('verify')}
				</Typography>
			</Box>
		);
	}

	return (
		<>
			{renderWarning()}
			<Box
				sx={{
					display: 'flex',
					height: '100vh',
					paddingTop: '3.5rem'
				}}
			>
				<NavDrawer
					open={isDrawerOpen}
					onToggle={handleDrawerToggle}
				/>
				<Box
					component='main'
					sx={{
						flex: 1,
						overflow: 'auto'
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</>
	);
}
