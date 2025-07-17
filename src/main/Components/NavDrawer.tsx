import {
	Divider,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText
} from '@mui/material';
import {ListAlt, Logout, Menu, MenuOpen, Settings} from '@mui/icons-material';
import React from 'react';
import {Link, NavigateFunction, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {logout} from '../Services/AuthService';

export const WIDTH_DRAWER_OPENED: number = 240;
export const WIDTH_DRAWER_CLOSED: number = 60;

interface NavDrawerProps {
	readonly open: boolean;
	readonly onToggle: () => void;
}

export function NavDrawer(props: NavDrawerProps): React.ReactElement {
	const {t} = useTranslation();
	const navigate: NavigateFunction = useNavigate();
	const width: number = props.open
		? WIDTH_DRAWER_OPENED
		: WIDTH_DRAWER_CLOSED;

	function handleLogout(): void {
		logout();
		navigate('/');
	}

	return (
		<Drawer
			variant='permanent'
			sx={{
				width: width,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: width,
					transition: 'width 0.3s',
					overflowX: 'hidden',
					mt: '56px'
				}
			}}
		>
			<List>
				<IconButton
					data-testid='nav-drawer-toggle'
					onClick={props.onToggle}
					sx={{
						borderRadius: 0,
						width: '100%'
					}}
				>
					{props.open ? (
						<MenuOpen />
					) : (
						<Menu sx={{marginLeft: '-2.5px'}} />
					)}
				</IconButton>

				<ListItemButton
					component={Link}
					to='/wishlists'
				>
					<ListItemIcon>
						<ListAlt />
					</ListItemIcon>
					{props.open && <ListItemText primary={t('wishlists')} />}
				</ListItemButton>

				<ListItemButton
					component={Link}
					to='/profile'
					data-testid='nav-drawer-item-profile'
				>
					<ListItemIcon>
						<Settings />
					</ListItemIcon>
					{props.open && <ListItemText primary={t('settings')} />}
				</ListItemButton>
			</List>

			<Divider />

			<List>
				<ListItemButton
					onClick={handleLogout}
					data-testid='nav-drawer-item-logout'
				>
					<ListItemIcon>
						<Logout />
					</ListItemIcon>
					{props.open && <ListItemText primary={t('log-out')} />}
				</ListItemButton>
			</List>
		</Drawer>
	);
}
