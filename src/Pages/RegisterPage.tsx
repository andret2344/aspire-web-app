import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Link,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React from 'react';
import {useForm} from 'react-hook-form';
import '../../assets/fonts.css';
import {AuthComponent} from '../Components/AuthComponent';
import {RenderPasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {Link as Anchor, useNavigate} from 'react-router-dom';
import {RegisterApiError, signUp} from '../Services/AuthService';
import {AxiosError, AxiosResponse} from 'axios';
import {Header} from '../Components/Header';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';

interface IFormInput {
	readonly email: string;
	readonly password: string;
	readonly passwordRepeat: string;
}

export function RegisterPage(): React.ReactElement {
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const {t} = useTranslation();
	const [showPasswordRepeat, setShowPasswordRepeat] =
		React.useState<boolean>(false);
	const navigate = useNavigate();
	const {enqueueSnackbar} = useSnackbar();

	const {
		register,
		setError,
		formState: {errors},
		handleSubmit
	} = useForm<IFormInput>();

	function handleClickShowPassword(): void {
		setShowPassword((prev: boolean): boolean => !prev);
	}

	function handleClickShowPasswordRepeat(): void {
		setShowPasswordRepeat((prev: boolean): boolean => !prev);
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
			.then((response: AxiosResponse): void => {
				if ([200, 201].includes(response?.status || -1)) {
					navigate('/');
					enqueueSnackbar(t('account-created'), {variant: 'success'});
				}
			})
			.catch((response: AxiosError<RegisterApiError>): void => {
				const registerApiError = response.response?.data;
				if (registerApiError?.email) {
					setError('email', {
						type: 'manual',
						message: registerApiError?.email
					});
				}
				if (registerApiError?.password) {
					setError('password', {
						type: 'manual',
						message: registerApiError?.password
					});
				}
			});
	}

	return (
		<Header>
			<AuthComponent>
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
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '200px',
							marginTop: '5px'
						}}
						type='email'
						error={!!errors.email}
						helperText={errors.email?.message}
						{...register('email', {required: true})}
					/>
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
											data-testid={
												'visibilityIconPassword'
											}
											sx={{margin: 0, padding: 0}}
											onClick={handleClickShowPassword}
										>
											<RenderPasswordVisibilityIcon
												showPassword={showPassword}
											/>
										</IconButton>
									</InputAdornment>
								)
							}
						}}
						hiddenLabel
						variant='filled'
						placeholder={`${t('password')}`}
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '200px',
							marginTop: '5px'
						}}
						required
						error={!!errors.password}
						helperText={errors.password?.message}
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
												'visibilityIconRepeatPassword'
											}
											sx={{margin: 0, padding: 0}}
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
							}
						}}
						hiddenLabel
						variant='filled'
						placeholder={`${t('repeat-password')}`}
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
			</AuthComponent>
		</Header>
	);
}
