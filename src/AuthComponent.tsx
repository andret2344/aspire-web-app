import { Container, Paper, Typography } from '@mui/material';
import React from 'react';
import '../assets/fonts.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const renderPasswordVisibilityIcon = (showPassword: boolean): React.ReactNode => {
	if (showPassword) {
		return <Visibility sx={{ margin: 0, padding: 0 }}/>;
	}
	return <VisibilityOff sx={{ margin: 0, padding: 0 }}/>;
};

export const AuthComponent: React.FC = (props: React.PropsWithChildren<{}>): React.ReactElement => {
	return (
		<Container
			sx={{
				scrollbarWidth: 'thin',
				padding: {
					xs: '0'
				},
				display: 'flex',
				flexDirection: 'column',
				justifyContent: {
					xs: 'flex-start',
					sm: 'center'
				},
				alignItems: {
					xs: 'flex-start',
					sm: 'center'
				},
				height: '100vh',
				minHeight: '700px',
				overflowX: 'auto'
			}}
		>
			<Paper
				elevation={5}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '30px 0',
					height: {
						xs: '100%',
						sm: 'auto'
					},
					width: {
						xs: '100%',
						sm: '350px'
					},
					minWidth: '300px',
					margin: {
						xs: '0px',
						sm: '10px 20px 10px 20px'
					}
				}}
			>
				<Typography
					variant="h6"
					noWrap
					component="a"
					href="/"
					sx={{
						display: 'flex',
						fontFamily: 'Courgette',
						fontWeight: 700,
						fontSize: '45px',
						letterSpacing: '.3rem',
						color: 'primary.main',
						textDecoration: 'none'
					}}
				>
					wishlist
				</Typography>
				{props.children}
			</Paper>
		</Container>
	);
};
