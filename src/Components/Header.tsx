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
import {Logout, Settings} from '@mui/icons-material';
import {Link as Anchor, useNavigate} from 'react-router-dom';
import {isTokenValid, logout} from '../Services/AuthService';
import {LanguagePicker} from './LanguagePicker';
import {useTranslation} from 'react-i18next';

export function Header(
	props: React.PropsWithChildren<None>
): React.ReactElement {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const {t} = useTranslation();

	const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorEl(event.currentTarget);
	};

	function handleClose(): void {
		setAnchorEl(null);
	}

	function handleLogout(): void {
		logout();
		navigate('/');
	}

	function renderProfileIcon(): React.ReactElement | undefined {
		if (!isTokenValid()) {
			return undefined;
		}
		return (
			<IconButton
				data-testid='account-icon-button'
				sx={{justifySelf: 'flex-end'}}
				onClick={handleClick}
			>
				<AccountCircleOutlinedIcon
					data-testid='account-icon'
					sx={{color: 'white'}}
					fontSize='large'
				/>
			</IconButton>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '0px'
			}}
		>
			<Container
				aria-label='header-container'
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
							to='/'
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
						{renderProfileIcon()}
						<Menu
							data-testid='menu'
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
								data-testid='menuitem-profile'
								onClick={(): void | Promise<void> =>
									navigate('/profile')
								}
							>
								<ListItemIcon>
									<Settings fontSize='small' />
								</ListItemIcon>
								{t('settings')}
							</MenuItem>
							<MenuItem
								data-testid='menuitem-logout'
								onClick={handleLogout}
							>
								<ListItemIcon>
									<Logout fontSize='small' />
								</ListItemIcon>
								{t('log-out')}
							</MenuItem>
						</Menu>
					</Box>
					<LanguagePicker />
				</Box>
			</Container>
			{props.children}
		</Box>
	);
}
