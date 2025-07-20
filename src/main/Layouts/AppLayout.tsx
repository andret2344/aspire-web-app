import React from 'react';
import {NavigateFunction, Outlet, useNavigate} from 'react-router-dom';
import {Box} from '@mui/material';
import {
	NavDrawer,
	WIDTH_DRAWER_CLOSED,
	WIDTH_DRAWER_OPENED
} from '../Components/NavDrawer';
import {useTokenValidation} from '../Hooks/useTokenValidation';

export function AppLayout(): React.ReactElement {
	const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
	const {tokenLoading, tokenValid} = useTokenValidation();
	const navigate: NavigateFunction = useNavigate();

	const width: number = drawerOpen
		? WIDTH_DRAWER_OPENED
		: WIDTH_DRAWER_CLOSED;

	React.useEffect((): void => {
		if (tokenLoading) {
			return;
		}
		if (!tokenValid) {
			navigate('/');
		}
	}, [tokenLoading, tokenValid, navigate]);

	if (tokenLoading || !tokenValid) {
		return <></>;
	}

	function handleDrawerToggle(): void {
		return setDrawerOpen(!drawerOpen);
	}

	return (
		<>
			<NavDrawer
				open={drawerOpen}
				onToggle={handleDrawerToggle}
			/>
			<Box
				component='main'
				sx={{
					pl: `${width}px`,
					transition: 'padding-left 0.3s'
				}}
			>
				<Outlet />
			</Box>
		</>
	);
}
