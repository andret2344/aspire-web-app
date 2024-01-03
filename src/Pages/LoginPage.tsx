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
import {logIn} from '../Services/AuthService';
import {useNavigate} from 'react-router-dom';
import {RenderPasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {Header} from '../Components/Header';
import {useSnackbar} from 'notistack';

export const LoginPage: React.FC = (): React.ReactElement => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const {enqueueSnackbar} = useSnackbar();

	const handleClickShowPassword = (): void => {
		setShowPassword((prev: boolean): boolean => !prev);
	};

	const {register, handleSubmit} = useForm();

	const onSubmit = async (data: FieldValues): Promise<void> => {
		await logIn(data.email, data.password).then(
			(response: number): void => {
				if ([200, 201].includes(response)) {
					navigate('/wishlists');
					enqueueSnackbar('Successfully logged in.', {
						variant: 'info'
					});
				} else if ([401].includes(response)) {
					enqueueSnackbar('Wrong login or password. Try again!', {
						variant: 'warning'
					});
				} else {
					enqueueSnackbar('Something went wrong. Try again later.', {
						variant: 'error'
					});
				}
			}
		);
	};

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
						autoComplete={'new-password'}
						hiddenLabel
						variant={'filled'}
						placeholder={'Login'}
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '200px',
							marginTop: '5px'
						}}
						type={'email'}
						{...register('email', {required: true})}
					/>
					<TextField
						type={showPassword ? 'text' : 'password'}
						autoComplete={'new-password'}
						InputProps={{
							endAdornment: (
								<InputAdornment
									position='end'
									sx={{margin: 0, padding: 0}}
								>
									<IconButton
										sx={{margin: 0, padding: 0}}
										onClick={handleClickShowPassword}
									>
										<RenderPasswordVisibilityIcon
											showPassword={showPassword}
										/>
									</IconButton>
								</InputAdornment>
							)
						}}
						hiddenLabel
						variant={'filled'}
						placeholder={'Password'}
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
						type={'submit'}
					>
						Login
					</Button>
					<Link
						href='#'
						sx={{
							marginTop: '10px',
							fontFamily: 'Montserrat',
							textDecoration: 'underline',
							fontWeight: 400
						}}
					>
						Forgot password?
					</Link>
					<Box
						mt={'10px'}
						display={'flex'}
						alignItems={'center'}
					>
						<Typography
							sx={{
								fontFamily: 'Montserrat',
								marginRight: 0,
								paddingRight: 0,
								fontWeight: 400
							}}
						>
							Don&apos;t have an account?
						</Typography>
						<Link
							href='register'
							sx={{
								paddingLeft: '3px',
								fontFamily: 'Montserrat',
								marginLeft: 0,
								textDecoration: 'underline',
								fontWeight: 400
							}}
						>
							Sign up
						</Link>
					</Box>
				</form>
			</AuthComponent>
		</Header>
	);
};
