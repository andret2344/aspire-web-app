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
import {SubmitHandler, useForm} from 'react-hook-form';
import '../../assets/fonts.css';
import {AuthComponent} from '../Components/AuthComponent';
import {RenderPasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {useNavigate} from 'react-router-dom';
import {RegisterApiError, signUp} from '../Services/AuthService';
import {AxiosError, AxiosResponse} from 'axios';

interface IFormInput {
	readonly email: string;
	readonly password: string;
	readonly passwordRepeat: string;
}

export const RegisterPage: React.FC = (): React.ReactElement => {
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [showPasswordRepeat, setShowPasswordRepeat] =
		React.useState<boolean>(false);
	const navigate = useNavigate();

	const handleClickShowPassword = (): void => {
		setShowPassword((prev: boolean): boolean => !prev);
	};

	const handleClickShowPasswordRepeat = (): void => {
		setShowPasswordRepeat((prev: boolean): boolean => !prev);
	};

	const {
		register,
		setError,
		formState: {errors},
		handleSubmit
	} = useForm<IFormInput>();

	const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput): void => {
		if (data.password !== data.passwordRepeat) {
			setError('passwordRepeat', {
				type: 'manual',
				message: 'Passwords are not equal.'
			});
			navigate('/register');
			return;
		}

		signUp(data.email, data.password)
			.then((response: AxiosResponse): void => {
				if ([200, 201].includes(response?.status || -1)) {
					navigate('/');
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
	};

	return (
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
					required
					hiddenLabel
					variant={'filled'}
					placeholder={'E-mail address'}
					size={isSmallerThan600 ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px'
					}}
					type={'email'}
					error={!!errors.email}
					helperText={errors.email?.message}
					{...register('email', {required: true})}
				/>
				<TextField
					type={showPassword ? 'text' : 'password'}
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
					error={!!errors.password}
					helperText={errors.password?.message}
					{...register('password')}
				/>
				<TextField
					type={showPasswordRepeat ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment
								position='end'
								sx={{margin: 0, padding: 0}}
							>
								<IconButton
									sx={{margin: 0, padding: 0}}
									onClick={handleClickShowPasswordRepeat}
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
					placeholder={'Repeat password'}
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
					type={'submit'}
				>
					Register
				</Button>
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
						Already have an account?
					</Typography>
					<Link
						href='/'
						sx={{
							paddingLeft: '3px',
							fontFamily: 'Montserrat',
							marginLeft: 0,
							textDecoration: 'underline',
							fontWeight: 400
						}}
					>
						Sign in
					</Link>
				</Box>
			</form>
		</AuthComponent>
	);
};
