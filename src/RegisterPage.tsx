import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Link,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import '../assets/fonts.css';
import { AuthComponent, renderPasswordVisibilityIcon } from './AuthComponent';

export const RegisterPage = () => {
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [showPasswordRepeat, setShowPasswordRepeat] =
		React.useState<boolean>(false);

	const handleClickShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleClickShowPasswordRepeat = () => {
		setShowPasswordRepeat((prev) => !prev);
	};

	const { register, handleSubmit } = useForm();

	const onSubmit = (data: FieldValues) => console.log(data);

	return (
		<AuthComponent>
			<form
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				className="loginForm"
				onSubmit={handleSubmit(onSubmit)}
			>
				<TextField
					hiddenLabel
					variant={'filled'}
					placeholder={'E-mail address'}
					size={isSmallerThan600 ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px',
					}}
					type={'email'}
					{...register('email', { required: true })}
				/>
				<TextField
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment
								position="end"
								sx={{ margin: 0, padding: 0 }}
							>
								<IconButton
									sx={{ margin: 0, padding: 0 }}
									onClick={handleClickShowPassword}
								>
									{renderPasswordVisibilityIcon(showPassword)}
								</IconButton>
							</InputAdornment>
						),
					}}
					hiddenLabel
					variant={'filled'}
					placeholder={'Password'}
					size={isSmallerThan600 ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px',
					}}
					required
					{...register('password')}
				/>
				<TextField
					type={showPasswordRepeat ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment
								position="end"
								sx={{ margin: 0, padding: 0 }}
							>
								<IconButton
									sx={{ margin: 0, padding: 0 }}
									onClick={handleClickShowPasswordRepeat}
								>
									{renderPasswordVisibilityIcon(
										showPasswordRepeat
									)}
								</IconButton>
							</InputAdornment>
						),
					}}
					hiddenLabel
					variant={'filled'}
					placeholder={'Repeat password'}
					size={isSmallerThan600 ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px',
					}}
					required
					{...register('passwordRepeat')}
				/>
				<Button
					variant="contained"
					sx={{
						marginTop: '10px',
					}}
					type={'submit'}
				>
					Register
				</Button>
				<Box mt={'10px'} display={'flex'} alignItems={'center'}>
					<Typography
						sx={{
							fontFamily: 'Montserrat',
							marginRight: 0,
							paddingRight: 0,
							fontWeight: 400,
						}}
					>
						Already have an account?
					</Typography>
					<Link
						href="#"
						sx={{
							paddingLeft: '3px',
							fontFamily: 'Montserrat',
							marginLeft: 0,
							textDecoration: 'underline',
							fontWeight: 400,
						}}
					>
						Sign in
					</Link>
				</Box>
			</form>
		</AuthComponent>
	);
};
