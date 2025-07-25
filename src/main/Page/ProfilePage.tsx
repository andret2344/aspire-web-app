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
import {changePassword} from '@service/AuthService';
import {useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import {useDarkMode} from '@component/DarkModeContext';
import {PasswordVisibilityIcon} from '@component/PasswordVisibilityIcon';
import {ToggleColorModeComponent} from '@component/ToggleColorModeComponent';
import {useTranslation} from 'react-i18next';
import {LanguagePicker} from '@component/LanguagePicker';

export function ProfilePage(): React.ReactElement {
	type Inputs = {
		readonly currentPassword: string;
		readonly newPassword: string;
		readonly newPasswordConfirm: string;
	};

	const [isOldPasswordShown, setIsOldPasswordShown] =
		React.useState<boolean>(false);
	const [isNewPasswordShown, setIsNewPasswordShown] =
		React.useState<boolean>(false);
	const [isNewPasswordRepeatShown, setIsNewPasswordRepeatShown] =
		React.useState<boolean>(false);

	const {darkMode, toggleDarkMode} = useDarkMode();
	const {enqueueSnackbar} = useSnackbar();
	const {
		handleSubmit,
		register,
		reset,
		setError,
		formState: {errors}
	} = useForm<Inputs>();
	const {t} = useTranslation();

	function handleClickShowPassword(): void {
		setIsOldPasswordShown((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeat(): void {
		setIsNewPasswordShown((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeatConfirmation(): void {
		setIsNewPasswordRepeatShown((prev: boolean): boolean => !prev);
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
			.then((): void => {
				enqueueSnackbar(`${t('password-changed')}`, {
					variant: 'success'
				});
				reset();
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
									type={
										isOldPasswordShown ? 'text' : 'password'
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
																isOldPasswordShown
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
										isNewPasswordShown ? 'text' : 'password'
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
																isNewPasswordShown
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
										isNewPasswordRepeatShown
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
																isNewPasswordRepeatShown
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
									{t('user-settings')}
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								width: '70%',
								display: 'flex',
								flexDirection: 'column',
								justifyItems: 'flex-end',
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
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center'
								}}
							>
								<Typography sx={{fontFamily: 'Montserrat'}}>
									{t('change-language')}:
								</Typography>
								<LanguagePicker />
							</Box>
						</Box>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
