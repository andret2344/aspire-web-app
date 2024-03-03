import {
	Box,
	Container,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography
} from '@mui/material';
import React from 'react';
import {None} from '../Types/None';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {Logout, Settings} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {isTokenValid, logout} from '../Services/AuthService';
import {useDarkMode} from './DarkModeContext';
import {ToggleColorModeComponent} from './ToggleColorModeComponent';

export const Header: React.FC<React.PropsWithChildren<None>> = (
	props: React.PropsWithChildren<None>
): React.ReactElement => {
	const {darkMode, toggleDarkMode} = useDarkMode();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (): void => {
		setAnchorEl(null);
	};

	const handleLogout = (): void => {
		logout();
		navigate('/');
	};

	const renderProfileIcon = (): React.ReactElement | undefined => {
		if (!isTokenValid()) {
			return undefined;
		}
		return (
			<IconButton
				data-testid={'account-icon-button'}
				sx={{justifySelf: 'flex-end'}}
				onClick={handleClick}
			>
				<AccountCircleOutlinedIcon
					data-testid={'account-icon'}
					sx={{color: 'white'}}
					fontSize={'large'}
				/>
			</IconButton>
		);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				padding: '0px'
			}}
		>
			<Container
				aria-label={'header-container'}
				maxWidth={false}
				sx={{
					backgroundColor: 'primary.main',
					display: 'flex'
				}}
			>
				<Box
					sx={{
						minWidth: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<Typography
						variant='h6'
						noWrap
						component='a'
						href='/wishlists'
						sx={{
							fontFamily: 'Courgette',
							fontWeight: 700,
							fontSize: '35px',
							letterSpacing: '.3rem',
							color: 'white',
							textDecoration: 'none'
						}}
					>
						Aspire
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						{renderProfileIcon()}
						<Menu
							data-testid={'menu'}
							id='menu'
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center'
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right'
							}}
						>
							<MenuItem
								data-testid={'menuitem-profile'}
								onClick={(): void => navigate('/profile')}
							>
								<ListItemIcon>
									<Settings fontSize='small' />
								</ListItemIcon>
								Settings
							</MenuItem>
							<MenuItem
								data-testid={'menuitem-logout'}
								onClick={handleLogout}
							>
								<ListItemIcon>
									<Logout fontSize='small' />
								</ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
						<Box sx={{justifySelf: 'flex-end'}}>
							<ToggleColorModeComponent
								darkMode={darkMode}
								toggleDarkMode={toggleDarkMode}
							/>
						</Box>
					</Box>
				</Box>
			</Container>
			{props.children}
		</Box>
	);
};
