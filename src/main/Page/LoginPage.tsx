import React from 'react';
import {FieldValues, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Link as Anchor, NavigateFunction, useNavigate} from 'react-router-dom';
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
import {logIn} from '@service/AuthService';

export function LoginPage(): React.ReactElement {
	const [isPasswordShown, setIsPasswordShown] = React.useState<boolean>(false);

	const navigate: NavigateFunction = useNavigate();
	const theme: Theme = useTheme();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();
	const {register, handleSubmit} = useForm();

	function handleClickShowPassword(): void {
		setIsPasswordShown((prev: boolean): boolean => !prev);
	}

	async function onSubmit(data: FieldValues): Promise<void> {
		await logIn(data.email, data.password).then((response: number): void => {
			if ([200, 201].includes(response)) {
				navigate('/wishlists', {replace: true});
				enqueueSnackbar(`${t('successfully-logged-in')}`, {
					variant: 'info'
				});
			} else if ([401].includes(response)) {
				enqueueSnackbar(`${t('wrong-login-or-password')}`, {
					variant: 'warning'
				});
			} else {
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				});
			}
		});
	}

	return (
		<AuthContainer>
			<form
				data-testid='login-page-form'
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
					data-testid='login-page-input-username'
					autoComplete='new-password'
					hiddenLabel
					variant='filled'
					placeholder={t('login')}
					size={isMobile ? 'small' : 'medium'}
					sx={{
						width: '350px',
						marginTop: '5px'
					}}
					type='email'
					{...register('email', {
						required: true
					})}
				/>
				<TextField
					data-testid='login-page-input-password'
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
										data-testid='password-visibility-icon'
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
					{...register('password')}
				/>
				<Button
					data-testid='login-page-button-login'
					variant='contained'
					sx={{
						marginTop: '10px'
					}}
					type='submit'
				>
					{t('log-in')}
				</Button>
				<Link
					data-testid='login-page-button-forgot'
					component={Anchor}
					to='/reset-password'
					marginTop='10px'
					fontFamily='Montserrat'
					fontWeight={400}
					style={{
						textDecoration: 'underline'
					}}
				>
					{t('forgot-password')}
				</Link>
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
						{t('no-account')}
					</Typography>
					<Link
						component={Anchor}
						to='/register'
						paddingLeft='3px'
						fontFamily='Montserrat'
						marginLeft={0}
						fontWeight={400}
						sx={{
							textDecoration: 'underline'
						}}
					>
						{t('sign-up')}
					</Link>
				</Box>
			</form>
		</AuthContainer>
	);
}
