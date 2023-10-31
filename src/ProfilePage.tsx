import {
	Box,
	Button,
	Container,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';

export const ProfilePage: React.FC = (): React.ReactElement => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				padding: '0px',
			}}
		>
			<Container
				maxWidth={false}
				sx={{ backgroundColor: 'primary.main' }}
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
						fontSize: '35px',
						letterSpacing: '.3rem',
						color: 'white',
						textDecoration: 'none',
					}}
				>
					wishlist
				</Typography>
			</Container>
			<Grid
				sx={{ flexGrow: 1 }}
				disableEqualOverflow={true}
				container
				columnSpacing={2}
			>
				<Grid
					xs={12}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'flex-start',
					}}
				>
					<Paper
						sx={{
							width: {
								xs: '100%',
								md: '800px',
							},
							display: 'flex',
							flexDirection: 'row',
							padding: '20px',
							marginTop: '20px',
						}}
					>
						<Box
							sx={{
								height: '100%',
								width: '20%',
							}}
						>
							<Box
								sx={{
									width: '100%',
									height: '40px',
									borderBottom: '1px solid #adadad',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Typography sx={{ fontFamily: 'Montserrat' }}>
									Profile settings
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								width: '80%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								paddingTop: '40px',
							}}
						>
							<TextField
								sx={{ width: '50%', marginBottom: '20px' }}
								id={'email'}
								label={'E-mail address'}
								defaultValue={'Andret2344@gmail.com'}
							/>
							<TextField
								sx={{ width: '50%', marginBottom: '20px' }}
								id={'password'}
								label={'Password'}
								type={'password'}
								autoComplete={'current-password'}
							/>
							<TextField
								sx={{
									width: '50%',
									marginBottom: '20px',
								}}
								id={'confirm-password'}
								label={'Confirm password'}
								type={'password'}
							/>

							<Button
								sx={{ fontFamily: 'Montserrat' }}
								variant="contained"
								type={'submit'}
							>
								Save
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};
