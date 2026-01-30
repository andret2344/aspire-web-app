import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link, NavigateFunction, useNavigate} from 'react-router-dom';
import {HelpOutline, ListAlt, Logout, NavigateBefore, NavigateNext, Settings} from '@mui/icons-material';
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Theme
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {AspireModal} from '@component/Modals/AspireModal';
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
	const [isModalOpened, setIsModalOpened] = React.useState<boolean>(false);
	const theme: Theme = useTheme();

	function handleLogoutCancel(): void {
		setIsModalOpened(false);
	}

	function handleLogoutConfirm(): void {
		logout();
		navigate(appPaths.login);
	}

	function handleLogoutClick(): void {
		setIsModalOpened(true);
	}

	function renderMenuIcon(): React.JSX.Element {
		if (props.open) {
			return <NavigateBefore />;
		}
		return <NavigateNext />;
	}

	function renderListItemText(text: string, color: string | undefined = undefined): React.ReactElement {
		if (!props.open) {
			return <></>;
		}
		return (
			<ListItemText
				primary={text}
				slotProps={{
					primary: {color}
				}}
			/>
		);
	}

	return (
		<>
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
						to={appPaths.wishlists}
					>
						<ListItemIcon>
							<ListAlt />
						</ListItemIcon>
						{renderListItemText(t('wishlists'))}
					</ListItemButton>

					<ListItemButton
						component={Link}
						to={appPaths.profile}
						data-testid='nav-drawer-item-profile'
					>
						<ListItemIcon>
							<Settings />
						</ListItemIcon>
						{renderListItemText(t('settings'))}
					</ListItemButton>

					<ListItemButton
						component={Link}
						to={appPaths.faq}
						data-testid='nav-drawer-item-faq'
					>
						<ListItemIcon>
							<HelpOutline />
						</ListItemIcon>
						{renderListItemText(t('faq'))}
					</ListItemButton>
				</List>

				<Divider />

				<List>
					<ListItemButton
						onClick={handleLogoutClick}
						data-testid='nav-drawer-item-logout'
					>
						<ListItemIcon>
							<Logout color='error' />
						</ListItemIcon>
						{renderListItemText(t('log-out'), theme.palette.error.main)}
					</ListItemButton>
				</List>
			</Drawer>
			<AspireModal
				title={t('log-out')}
				open={isModalOpened}
				onClose={handleLogoutCancel}
				onSubmit={handleLogoutConfirm}
			>
				{t('log-out-confirm')}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						padding: '10px'
					}}
				>
					<Button
						data-testid='button-cancel'
						variant='outlined'
						color='primary'
						sx={{
							margin: '10px 20px 0 20px'
						}}
						onClick={handleLogoutCancel}
					>
						{t('cancel')}
					</Button>
					<Button
						data-testid='button-save'
						variant='contained'
						color='error'
						sx={{
							margin: '10px 20px 0 20px'
						}}
						type='submit'
					>
						{t('log-out')}
					</Button>
				</Box>
			</AspireModal>
		</>
	);
}
