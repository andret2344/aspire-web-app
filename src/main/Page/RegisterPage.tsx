import React from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Link as Anchor, NavigateFunction, useNavigate} from 'react-router-dom';
import {AxiosError} from 'axios';
import {useSnackbar} from 'notistack';
import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Link,
	TextField,
	Theme,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import {AuthContainer} from '@component/AuthContainer';
import {PasswordVisibilityIcon} from '@component/PasswordVisibilityIcon';
import {RegisterApiError, signUp} from '@service/AuthService';

interface IFormInput {
	readonly email: string;
	readonly password: string;
	readonly passwordRepeat: string;
}

export function RegisterPage(): React.ReactElement {
	const [isPasswordShown, setIsPasswordShown] = React.useState<boolean>(false);
	const [isPasswordRepeatShown, setIsPasswordRepeatShown] = React.useState<boolean>(false);

	const theme: Theme = useTheme();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));
	const {t} = useTranslation();
	const navigate: NavigateFunction = useNavigate();
	const {enqueueSnackbar} = useSnackbar();

	const {
		register,
		setError,
		formState: {errors},
		handleSubmit
	} = useForm<IFormInput>();

	function handleClickShowPassword(): void {
		setIsPasswordShown((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeat(): void {
		setIsPasswordRepeatShown((prev: boolean): boolean => !prev);
	}

	function onSubmit(data: IFormInput): void {
		if (data.password !== data.passwordRepeat) {
			setError('passwordRepeat', {
				type: 'manual',
				message: t('passwords-not-equal')
			});
			navigate('/register');
			return;
		}

		signUp(data.email, data.password)
			.then((): void => {
				navigate('/');
				enqueueSnackbar(t('account-created'), {
					variant: 'success'
				});
			})
			.catch((response: AxiosError<RegisterApiError>): void => {
				const registerApiError: RegisterApiError | undefined = response.response?.data;
				if (registerApiError?.email) {
					setError('email', {
						type: 'manual',
						message: registerApiError.email
					});
				}
				if (registerApiError?.password) {
					setError('password', {
						type: 'manual',
						message: registerApiError.password
					});
				}
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
					autoComplete='new-password'
					required
					hiddenLabel
					variant='filled'
					placeholder={`${t('email-address')}`}
					size={isMobile ? 'small' : 'medium'}
					sx={{
						width: '350px',
						marginTop: '5px'
					}}
					type='email'
					error={!!errors.email}
					helperText={errors.email?.message}
					{...register('email', {
						required: true
					})}
				/>
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
					placeholder={t('password')}
					size={isMobile ? 'small' : 'medium'}
					sx={{
						width: '350px',
						marginTop: '5px'
					}}
					required
					error={!!errors.password}
					helperText={errors.password?.message}
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
					placeholder={t('repeat-password')}
					size={isMobile ? 'small' : 'medium'}
					sx={{
						width: '350px',
						marginTop: '5px'
					}}
					required
					error={!!errors.passwordRepeat}
					helperText={errors.passwordRepeat?.message}
					{...register('passwordRepeat')}
				/>
				<Button
					variant='contained'
					sx={{
						marginTop: '10px'
					}}
					type='submit'
				>
					{t('create-account')}
				</Button>
				<Box
					mt='10px'
					display='flex'
					alignItems='center'
				>
					<Typography
						sx={{
							fontFamily: 'Montserrat',
							marginRight: 0,
							paddingRight: 0,
							fontWeight: 400
						}}
					>
						{t('already-have-account')}
					</Typography>
					<Link
						component={Anchor}
						to='/'
						paddingLeft='3px'
						fontFamily='Montserrat'
						marginLeft={0}
						fontWeight={400}
						style={{
							textDecoration: 'underline'
						}}
					>
						{t('sign-in')}
					</Link>
				</Box>
			</form>
		</AuthContainer>
	);
}
