import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link, NavigateFunction, useNavigate} from 'react-router-dom';
import {ListAlt, Logout, Menu, MenuOpen, Settings} from '@mui/icons-material';
import {Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {logout} from '@service/AuthService';
import {appPaths} from '../AppRoutes';

export const WIDTH_DRAWER_OPENED: number = 240;
export const WIDTH_DRAWER_CLOSED: number = 60;

interface NavDrawerProps {
	readonly open: boolean;
	readonly onToggle: () => void;
}

export function NavDrawer(props: NavDrawerProps): React.ReactElement {
	const {t} = useTranslation();
	const navigate: NavigateFunction = useNavigate();
	const width: number = props.open ? WIDTH_DRAWER_OPENED : WIDTH_DRAWER_CLOSED;

	function handleLogout(): void {
		logout();
		navigate(appPaths.login);
	}

	function renderMenuIcon(): React.JSX.Element {
		if (props.open) {
			return <MenuOpen />;
		}
		return (
			<Menu
				sx={{
					marginLeft: '-0.125rem'
				}}
			/>
		);
	}

	function renderListItemText(text: string): React.ReactElement {
		if (!props.open) {
			return <></>;
		}
		return <ListItemText primary={text} />;
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
					{renderMenuIcon()}
				</IconButton>

				<ListItemButton
					component={Link}
					to='/wishlists'
				>
					<ListItemIcon>
						<ListAlt />
					</ListItemIcon>
					{renderListItemText(t('wishlists'))}
				</ListItemButton>

				<ListItemButton
					component={Link}
					to='/profile'
					data-testid='nav-drawer-item-profile'
				>
					<ListItemIcon>
						<Settings />
					</ListItemIcon>
					{renderListItemText(t('settings'))}
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
					{renderListItemText(t('log-out'))}
				</ListItemButton>
			</List>
		</Drawer>
	);
}
