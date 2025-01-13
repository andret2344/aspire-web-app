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
import {FieldValues, useForm} from 'react-hook-form';
import React from 'react';
import '../../assets/fonts.css';
import {AuthComponent} from '../Components/AuthComponent';
import {isTokenValid, logIn} from '../Services/AuthService';
import {Link as Anchor, useNavigate} from 'react-router-dom';
import {RenderPasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {Header} from '../Components/Header';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';

export function LoginPage(): React.ReactElement {
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();
	const {register, handleSubmit} = useForm();

	React.useEffect((): void => {
		if (isTokenValid()) {
			navigate(`wishlists/`);
		}
	}, [navigate]);

	function handleClickShowPassword(): void {
		setShowPassword((prev: boolean): boolean => !prev);
	}

	async function onSubmit(data: FieldValues): Promise<void> {
		await logIn(data.email, data.password).then(
			(response: number): void => {
				if ([200, 201].includes(response)) {
					navigate('/wishlists');
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
			}
		);
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
						hiddenLabel
						variant='filled'
						placeholder={t('login')}
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '200px',
							marginTop: '5px'
						}}
						type='email'
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
											data-testid='visibilityIcon'
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
						placeholder={t('password')}
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '200px',
							marginTop: '5px'
						}}
						required
						{...register('password')}
					/>
					<Button
						variant='contained'
						sx={{
							marginTop: '10px'
						}}
						type='submit'
					>
						{t('log-in')}
					</Button>
					<Link
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
			</AuthComponent>
		</Header>
	);
}
