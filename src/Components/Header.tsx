import {
	Box,
	Container,
	IconButton,
	Link,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography
} from '@mui/material';
import React from 'react';
import {None} from '../Types/None';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {Logout, Settings} from '@mui/icons-material';
import {useNavigate, Link as Anchor} from 'react-router-dom';
import {isTokenValid, logout} from '../Services/AuthService';
import {AccessPasswordModal} from './AccessPasswordModal';

export const Header: React.FC<React.PropsWithChildren<None>> = (
	props: React.PropsWithChildren<None>
): React.ReactElement => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [revealPassModalOpened, setRevealPassModalOpened] =
		React.useState<boolean>(false);
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

	const toggleRevealPassModal = (): void => {
		setRevealPassModalOpened((prev): boolean => !prev);
	};

	const renderUserIcons = (): React.ReactElement | undefined => {
		if (!isTokenValid()) {
			return undefined;
		}
		return (
			<Box sx={{justifySelf: 'flex-end'}}>
				<IconButton>
					<VisibilityRoundedIcon
						data-testid={'hidden-items-icon-button'}
						onClick={toggleRevealPassModal}
						sx={{color: 'white'}}
						fontSize={'large'}
					/>
				</IconButton>
				<IconButton
					data-testid={'account-icon-button'}
					onClick={handleClick}
				>
					<AccountCircleOutlinedIcon
						data-testid={'account-icon'}
						sx={{color: 'white'}}
						fontSize={'large'}
					/>
				</IconButton>
			</Box>
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
					>
						<Link
							component={Anchor}
							to={'/'}
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
						</Link>
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						{renderUserIcons()}
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
					</Box>
				</Box>
			</Container>
			{props.children}
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={false}
				setRevealPassModalOpened={toggleRevealPassModal}
				revealPassModalOpened={revealPassModalOpened}
			/>
		</Box>
	);
};
