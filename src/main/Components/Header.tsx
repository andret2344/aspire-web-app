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
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {Logout, Settings} from '@mui/icons-material';
import {Link as Anchor, NavigateFunction, useNavigate} from 'react-router-dom';
import {logout} from '../Services/AuthService';
import {useTranslation} from 'react-i18next';
import {useTokenValidation} from '../Hooks/useTokenValidation';

export function Header(): React.ReactElement {
	const navigate: NavigateFunction = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const {t} = useTranslation();
	const {tokenLoading, tokenValid} = useTokenValidation();

	if (tokenLoading) {
		return <></>;
	}

	function handleClick(event: React.MouseEvent<HTMLElement>): void {
		setAnchorEl(event.currentTarget);
	}

	function handleClose(): void {
		setAnchorEl(null);
	}

	function handleLogout(): void {
		logout();
		navigate('/');
	}

	function renderProfileIcon(): React.ReactElement | undefined {
		if (!tokenValid) {
			return undefined;
		}
		return (
			<Box sx={{justifySelf: 'flex-end'}}>
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
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				position: 'fixed',
				width: '100%',
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
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<Box>
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
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
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
				</Box>
			</Container>
		</Box>
	);
}
