import {
	Box,
	Button,
	Paper,
	TextField,
	Typography,
	IconButton,
	InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';
import {Header} from '../Components/Header';
import {isTokenValid, changePassword} from '../Services/AuthService';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import {useDarkMode} from '../Components/DarkModeContext';
import {RenderPasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {ToggleColorModeComponent} from '../Components/ToggleColorModeComponent';
import {t} from 'i18next';

export const ProfilePage: React.FC = (): React.ReactElement => {
	type Inputs = {
		readonly currentPassword: string;
		readonly newPassword: string;
		readonly newPasswordConfirm: string;
	};
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [showPasswordRepeat, setShowPasswordRepeat] =
		React.useState<boolean>(false);
	const [showPasswordRepeatConfirmation, setShowPasswordRepeatConfirmation] =
		React.useState<boolean>(false);
	const {darkMode, toggleDarkMode} = useDarkMode();
	const navigate = useNavigate();
	const {enqueueSnackbar} = useSnackbar();
	const {
		handleSubmit,
		register,
		reset,
		setError,
		formState: {errors}
	} = useForm<Inputs>();

	const handleClickShowPassword = (): void => {
		setShowPassword((prev: boolean): boolean => !prev);
	};

	const handleClickShowPasswordRepeat = (): void => {
		setShowPasswordRepeat((prev: boolean): boolean => !prev);
	};

	const handleClickShowPasswordRepeatConfirmation = (): void => {
		setShowPasswordRepeatConfirmation((prev: boolean): boolean => !prev);
	};

	const onSubmit = (data: Inputs): void => {
		if (data.newPassword !== data.newPasswordConfirm) {
			setError('newPasswordConfirm', {
				type: 'manual',
				message: 'Passwords are not equal.'
			});
			return;
		}

		changePassword(
			data.currentPassword,
			data.newPassword,
			data.newPasswordConfirm
		)
			.then((response: number): void => {
				if ([200, 201].includes(response || -1)) {
					enqueueSnackbar(`${t('Successfully changed password!')}`, {
						variant: 'success'
					});
					reset();
				}
			})
			.catch((): void => {
				enqueueSnackbar(
					`${t('Some error occurred! Probably your current password is not valid.')}`,
					{
						variant: 'error'
					}
				);
			});
	};

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
							flexDirection: 'column',
							padding: '20px',
							marginTop: '20px'
						}}
					>
						<Box sx={{display: 'flex'}}>
							<Box
								sx={{
									height: '100%',
									width: '30%'
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
										{t('Password settings')}
									</Typography>
								</Box>
							</Box>
							<Box
								sx={{
									width: '70%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									paddingTop: '40px'
								}}
							>
								<form
									onSubmit={handleSubmit(onSubmit)}
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '50%'
									}}
								>
									<TextField
										sx={{marginBottom: '20px'}}
										id={'password'}
										placeholder={t('Current password')}
										type={
											showPassword ? 'text' : 'password'
										}
										InputProps={{
											endAdornment: (
												<InputAdornment
													position='end'
													sx={{margin: 0, padding: 0}}
												>
													<IconButton
														data-testid={
															'visibilityIconPassword'
														}
														sx={{
															margin: 0,
															padding: 0
														}}
														onClick={
															handleClickShowPassword
														}
													>
														<RenderPasswordVisibilityIcon
															showPassword={
																showPassword
															}
														/>
													</IconButton>
												</InputAdornment>
											)
										}}
										required
										{...register('currentPassword')}
									/>
									<TextField
										sx={{
											marginBottom: '20px'
										}}
										id={'new-password'}
										placeholder={t('New password')}
										type={
											showPasswordRepeat
												? 'text'
												: 'password'
										}
										InputProps={{
											endAdornment: (
												<InputAdornment
													position='end'
													sx={{margin: 0, padding: 0}}
												>
													<IconButton
														data-testid={
															'visibilityIconRepeatPassword'
														}
														sx={{
															margin: 0,
															padding: 0
														}}
														onClick={
															handleClickShowPasswordRepeat
														}
													>
														<RenderPasswordVisibilityIcon
															showPassword={
																showPasswordRepeat
															}
														/>
													</IconButton>
												</InputAdornment>
											)
										}}
										required
										error={!!errors.newPasswordConfirm}
										helperText={
											errors.newPasswordConfirm?.message
										}
										{...register('newPassword')}
									/>
									<TextField
										sx={{
											marginBottom: '20px'
										}}
										id={'confirm-password'}
										placeholder={t('Confirm password')}
										type={
											showPasswordRepeatConfirmation
												? 'text'
												: 'password'
										}
										InputProps={{
											endAdornment: (
												<InputAdornment
													position='end'
													sx={{margin: 0, padding: 0}}
												>
													<IconButton
														data-testid={
															'visibilityIconRepeatPasswordConfirmation'
														}
														sx={{
															margin: 0,
															padding: 0
														}}
														onClick={
															handleClickShowPasswordRepeatConfirmation
														}
													>
														<RenderPasswordVisibilityIcon
															showPassword={
																showPasswordRepeatConfirmation
															}
														/>
													</IconButton>
												</InputAdornment>
											)
										}}
										required
										error={!!errors.newPasswordConfirm}
										helperText={
											errors.newPasswordConfirm?.message
										}
										{...register('newPasswordConfirm')}
									/>

									<Button
										sx={{fontFamily: 'Montserrat'}}
										variant='contained'
										type={'submit'}
									>
										{t('change password')}
									</Button>
								</form>
							</Box>
						</Box>
						<Box sx={{display: 'flex'}}>
							<Box
								sx={{
									height: '100%',
									width: '30%'
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
										{t('Theme settings')}
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
								<Typography sx={{fontFamily: 'Montserrat'}}>
									{t('Change theme color')}:
									<ToggleColorModeComponent
										darkMode={darkMode}
										toggleDarkMode={toggleDarkMode}
									/>
								</Typography>
							</Box>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Header>
	);
};
