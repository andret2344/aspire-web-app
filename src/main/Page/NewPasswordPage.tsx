import React from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Button, IconButton, InputAdornment, TextField, Theme, useMediaQuery, useTheme} from '@mui/material';
import {AuthContainer} from '@component/AuthContainer';
import {PasswordVisibilityIcon} from '@component/PasswordVisibilityIcon';
import {resetPassword} from '@service/AuthService';
import {appPaths} from '../AppRoutes';

export function NewPasswordPage(): React.ReactElement {
	type Inputs = {
		readonly password: string;
		readonly passwordRepeat: string;
	};
	type Params = {
		readonly token: string;
	};

	const [isPasswordShown, setIsPasswordShown] = React.useState<boolean>(false);
	const [isPasswordRepeatShown, setIsPasswordRepeatShown] = React.useState<boolean>(false);

	const {t} = useTranslation();
	const params: Params = useParams<Params>() as Params;
	const navigate: NavigateFunction = useNavigate();
	const theme: Theme = useTheme();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));
	const {enqueueSnackbar} = useSnackbar();

	function handleClickShowPassword(): void {
		setIsPasswordShown((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeat(): void {
		setIsPasswordRepeatShown((prev: boolean): boolean => !prev);
	}

	const {
		register,
		setError,
		formState: {errors},
		handleSubmit
	} = useForm<Inputs>();

	function onSubmit(data: Inputs): void {
		if (data.password !== data.passwordRepeat) {
			setError('passwordRepeat', {
				type: 'manual',
				message: t('auth.passwords-not-equal')
			});
			return;
		}

		resetPassword(data.password, data.passwordRepeat, params.token)
			.then((): void => {
				enqueueSnackbar(t('messages.password-changed'), {
					variant: 'success'
				});
				navigate(appPaths.login);
			})
			.catch((): void => {
				enqueueSnackbar(t('messages.something-went-wrong'), {
					variant: 'error'
				});
			});
	}

	return (
		<AuthContainer>
			<form
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}
				className='loginForm'
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextField
					type={isPasswordShown ? 'text' : 'password'}
					autoComplete='new-password'
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
										data-testid='visibility-icon-password'
										sx={{
											margin: 0,
											padding: 0
										}}
										onClick={handleClickShowPassword}
									>
										<PasswordVisibilityIcon visible={isPasswordShown} />
									</IconButton>
								</InputAdornment>
							)
						}
					}}
					hiddenLabel
					variant='filled'
					placeholder={t('auth.password')}
					size={isMobile ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px'
					}}
					required
					{...register('password')}
				/>
				<TextField
					type={isPasswordRepeatShown ? 'text' : 'password'}
					autoComplete='new-password'
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
										data-testid={'visibility-icon-repeat-password'}
										sx={{
											margin: 0,
											padding: 0
										}}
										onClick={handleClickShowPasswordRepeat}
									>
										<PasswordVisibilityIcon visible={isPasswordRepeatShown} />
									</IconButton>
								</InputAdornment>
							)
						}
					}}
					hiddenLabel
					variant='filled'
					placeholder={t('auth.repeat-password')}
					size={isMobile ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px'
					}}
					required
					error={!!errors.passwordRepeat}
					helperText={errors.passwordRepeat?.message}
					{...register('passwordRepeat')}
				/>
				<Button
					data-testid='button-change-password'
					variant='contained'
					sx={{
						marginTop: '10px'
					}}
					type='submit'
				>
					{t('auth.change-password')}
				</Button>
			</form>
		</AuthContainer>
	);
}
