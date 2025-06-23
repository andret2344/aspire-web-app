import {
	Box,
	Button,
	Grid,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	Typography
} from '@mui/material';
import React from 'react';
import {changePassword} from '../Services/AuthService';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import {useDarkMode} from '../Components/DarkModeContext';
import {PasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {ToggleColorModeComponent} from '../Components/ToggleColorModeComponent';
import {useTranslation} from 'react-i18next';
import {useTokenValidation} from '../Hooks/useTokenValidation';
import {LanguagePicker} from '../Components/LanguagePicker';

export function ProfilePage(): React.ReactElement {
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
	const navigate: NavigateFunction = useNavigate();
	const {enqueueSnackbar} = useSnackbar();
	const {tokenLoading, tokenValid} = useTokenValidation();
	const {
		handleSubmit,
		register,
		reset,
		setError,
		formState: {errors}
	} = useForm<Inputs>();
	const {t} = useTranslation();

	if (tokenLoading) {
		return <></>;
	}

	if (!tokenValid) {
		navigate('/');
		return <></>;
	}

	function handleClickShowPassword(): void {
		setShowPassword((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeat(): void {
		setShowPasswordRepeat((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeatConfirmation(): void {
		setShowPasswordRepeatConfirmation((prev: boolean): boolean => !prev);
	}

	function onSubmit(data: Inputs): void {
		if (data.newPassword !== data.newPasswordConfirm) {
			setError('newPasswordConfirm', {
				type: 'manual',
				message: t('passwords-not-equal')
			});
			return;
		}

		changePassword(
			data.currentPassword,
			data.newPassword,
			data.newPasswordConfirm
		)
			.then((response: number): void => {
				if ([200, 201].includes(response)) {
					enqueueSnackbar(`${t('password-changed')}`, {
						variant: 'success'
					});
					reset();
				}
			})
			.catch((): void => {
				enqueueSnackbar(t('password-invalid'), {variant: 'error'});
			});
	}

	return (
		<Grid
			flexGrow={{sx: 1}}
			container
			columnSpacing={2}
			sx={{paddingTop: '56px'}}
		>
			<Grid
				size={{xs: 12}}
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
									{t('password-settings')}
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
									id='password'
									placeholder={t('current-password')}
									type={showPassword ? 'text' : 'password'}
									slotProps={{
										input: {
											endAdornment: (
												<InputAdornment
													position='end'
													sx={{
														margin: 0,
														padding: 0
													}}
												>
													<IconButton
														data-testid={
															'visibility-icon-password'
														}
														sx={{
															margin: 0,
															padding: 0
														}}
														onClick={
															handleClickShowPassword
														}
													>
														<PasswordVisibilityIcon
															visible={
																showPassword
															}
														/>
													</IconButton>
												</InputAdornment>
											)
										}
									}}
									required
									{...register('currentPassword')}
								/>
								<TextField
									sx={{
										marginBottom: '20px'
									}}
									id='new-password'
									placeholder={t('new-password')}
									type={
										showPasswordRepeat ? 'text' : 'password'
									}
									slotProps={{
										input: {
											endAdornment: (
												<InputAdornment
													position='end'
													sx={{
														margin: 0,
														padding: 0
													}}
												>
													<IconButton
														data-testid={
															'visibility-icon-repeat-password'
														}
														sx={{
															margin: 0,
															padding: 0
														}}
														onClick={
															handleClickShowPasswordRepeat
														}
													>
														<PasswordVisibilityIcon
															visible={
																showPasswordRepeat
															}
														/>
													</IconButton>
												</InputAdornment>
											)
										}
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
									id='confirm-password'
									placeholder={t('confirm-password')}
									type={
										showPasswordRepeatConfirmation
											? 'text'
											: 'password'
									}
									slotProps={{
										input: {
											endAdornment: (
												<InputAdornment
													position='end'
													sx={{
														margin: 0,
														padding: 0
													}}
												>
													<IconButton
														data-testid={
															'visibility-icon-repeat-password-confirmation'
														}
														sx={{
															margin: 0,
															padding: 0
														}}
														onClick={
															handleClickShowPasswordRepeatConfirmation
														}
													>
														<PasswordVisibilityIcon
															visible={
																showPasswordRepeatConfirmation
															}
														/>
													</IconButton>
												</InputAdornment>
											)
										}
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
									type='submit'
								>
									{t('change-password')}
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
									{t('theme-settings')}
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
								{t('change-theme-color')}:
								<ToggleColorModeComponent
									darkMode={darkMode}
									toggleDarkMode={toggleDarkMode}
								/>
							</Typography>
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
									{t('language')}
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								width: '80%',
								display: 'flex',
								// flexDirection: 'column',
								alignItems:"center",
								justifyContent: 'center',
								paddingTop: '40px'
							}}
						>
							<Typography sx={{fontFamily: 'Montserrat'}}>
								{t('change-language')}:
							</Typography>
							<LanguagePicker />
						</Box>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
