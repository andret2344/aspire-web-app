import React from 'react';
import {useTranslation} from 'react-i18next';
import {Container, Paper, Typography} from '@mui/material';
import {None} from '@type/None';

export function AuthContainer(props: React.PropsWithChildren<None>): React.ReactElement {
	const {t} = useTranslation();

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
						sm: '450px'
					},
					minWidth: '400px',
					margin: {
						xs: '0px',
						sm: '10px 20px 10px 20px'
					}
				}}
			>
				<Typography
					variant='h6'
					noWrap
					component='a'
					href='/'
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
					Aspire
				</Typography>
				<Typography
					variant='h6'
					noWrap
					component='a'
					href='/'
					sx={{
						display: 'flex',
						fontFamily: 'Courgette',
						fontWeight: 700,
						fontSize: '24px',
						letterSpacing: '.2rem',
						color: 'primary.main',
						textDecoration: 'none'
					}}
				>
					{t('subtitle')}
				</Typography>
				{props.children}
			</Paper>
		</Container>
	);
}
