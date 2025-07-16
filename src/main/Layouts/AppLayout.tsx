import React from 'react';
import {Outlet} from 'react-router-dom';
import {Box} from '@mui/material';
import {
	NavDrawer,
	WIDTH_DRAWER_CLOSED,
	WIDTH_DRAWER_OPENED
} from '../Components/NavDrawer';

export function AppLayout(): React.ReactElement {
	const [drawerOpen, setDrawerOpen] = React.useState<boolean>(true);
	const width: number = drawerOpen
		? WIDTH_DRAWER_OPENED
		: WIDTH_DRAWER_CLOSED;

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
