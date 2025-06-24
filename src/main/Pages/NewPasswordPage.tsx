import {
	Button,
	IconButton,
	InputAdornment,
	TextField,
	Theme,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React from 'react';
import {useForm} from 'react-hook-form';
import '../../../assets/fonts.css';
import {AuthContainer} from '../Components/AuthContainer';
import {PasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {resetPassword} from '../Services/AuthService';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';

export function NewPasswordPage(): React.ReactElement {
	type Inputs = {readonly password: string; readonly passwordRepeat: string};
	type Params = {readonly token: string};
	const {t} = useTranslation();
	const params: Params = useParams<Params>() as Params;
	const navigate: NavigateFunction = useNavigate();
	const theme: Theme = useTheme();
	const isSmallerThan600: boolean = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [showPasswordRepeat, setShowPasswordRepeat] =
		React.useState<boolean>(false);
	const {enqueueSnackbar} = useSnackbar();

	function handleClickShowPassword(): void {
		setShowPassword((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeat(): void {
		setShowPasswordRepeat((prev: boolean): boolean => !prev);
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
				message: t('passwords-not-equal')
			});
			return;
		}

		resetPassword(data.password, data.passwordRepeat, params.token)
			.then((): void => {
				enqueueSnackbar('password-changed', {
					variant: 'success'
				});
				navigate('/');
			})
			.catch((): void => {
				enqueueSnackbar('something-went-wrong', {
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
					type={showPassword ? 'text' : 'password'}
					autoComplete='new-password'
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment
									position='end'
									sx={{margin: 0, padding: 0}}
								>
									<IconButton
										data-testid='visibility-icon-password'
										sx={{margin: 0, padding: 0}}
										onClick={handleClickShowPassword}
									>
										<PasswordVisibilityIcon
											visible={showPassword}
										/>
									</IconButton>
								</InputAdornment>
							)
						}
					}}
					hiddenLabel
					variant='filled'
					placeholder={t('password')}
					size={isSmallerThan600 ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px'
					}}
					required
					{...register('password')}
				/>
				<TextField
					type={showPasswordRepeat ? 'text' : 'password'}
					autoComplete='new-password'
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment
									position='end'
									sx={{margin: 0, padding: 0}}
								>
									<IconButton
										data-testid={
											'visibility-icon-repeat-password'
										}
										sx={{margin: 0, padding: 0}}
										onClick={handleClickShowPasswordRepeat}
									>
										<PasswordVisibilityIcon
											visible={showPasswordRepeat}
										/>
									</IconButton>
								</InputAdornment>
							)
						}
					}}
					hiddenLabel
					variant='filled'
					placeholder={t('repeat-password')}
					size={isSmallerThan600 ? 'small' : 'medium'}
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
					{t('change-password')}
				</Button>
			</form>
		</AuthContainer>
	);
}
