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
import {logout} from '../Services/AuthService';

export const Header: React.FC<React.PropsWithChildren<None>> = (
	props: React.PropsWithChildren<None>
): React.ReactElement => {
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
				maxWidth={false}
				sx={{
					backgroundColor: 'primary.main',
					display: 'flex'
				}}
			>
				<Box
					sx={{
						minWidth: '98%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}
				>
					<Typography
						variant='h6'
						noWrap
						component='a'
						href='/'
						sx={{
							fontFamily: 'Courgette',
							fontWeight: 700,
							fontSize: '35px',
							letterSpacing: '.3rem',
							color: 'white',
							textDecoration: 'none'
						}}
					>
						wishlist
					</Typography>
					<IconButton onClick={handleClick}>
						<AccountCircleOutlinedIcon fontSize={'large'} />
					</IconButton>
					<Menu
						id='menu'
						anchorEl={anchorEl}
						keepMounted
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
						<MenuItem onClick={(): void => navigate('/profile')}>
							<ListItemIcon>
								<Settings fontSize='small' />
							</ListItemIcon>
							Settings
						</MenuItem>
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								<Logout fontSize='small' />
							</ListItemIcon>
							Logout
						</MenuItem>
					</Menu>
				</Box>
			</Container>
			{props.children}
		</Box>
	);
};
