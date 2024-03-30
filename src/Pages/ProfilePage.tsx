import {Box, Button, Paper, TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import {Header} from '../Components/Header';
import {isTokenValid} from '../Services/AuthService';
import {useNavigate} from 'react-router-dom';

export const ProfilePage: React.FC = (): React.ReactElement => {
	const navigate = useNavigate();

	React.useEffect((): void => {
		if (!isTokenValid()) {
			navigate('/');
		}
	});
	return (
		<Header>
			<Grid
				sx={{flexGrow: 1}}
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
						justifyContent: 'flex-start'
					}}
				>
					<Paper
						sx={{
							width: {
								xs: '100%',
								md: '800px'
							},
							display: 'flex',
							flexDirection: 'row',
							padding: '20px',
							marginTop: '20px'
						}}
					>
						<Box
							sx={{
								height: '100%',
								width: '20%'
							}}
						>
							<Box
								sx={{
									width: '100%',
									height: '40px',
									borderBottom: '1px solid #adadad',
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Typography sx={{fontFamily: 'Montserrat'}}>
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
								paddingTop: '40px'
							}}
						>
							<TextField
								sx={{width: '50%', marginBottom: '20px'}}
								id={'email'}
								label={'E-mail address'}
								defaultValue={''}
							/>
							<TextField
								sx={{width: '50%', marginBottom: '20px'}}
								id={'password'}
								label={'Password'}
								type={'password'}
								autoComplete={'current-password'}
							/>
							<TextField
								sx={{
									width: '50%',
									marginBottom: '20px'
								}}
								id={'confirm-password'}
								label={'Confirm password'}
								type={'password'}
							/>

							<Button
								sx={{fontFamily: 'Montserrat'}}
								variant='contained'
								type={'submit'}
							>
								Save
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Header>
	);
};
