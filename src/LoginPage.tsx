import {
	Box,
	Button,
	Container,
	IconButton,
	InputAdornment,
	Link,
	Paper,
	TextField,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { theme } from './theme';
import { FieldValues, useForm } from 'react-hook-form';
import React from 'react';
import '../assets/fonts.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const renderPasswordVisibilityIcon = (showPassword: boolean) => {
	return showPassword ? (
		<Visibility sx={{ margin: 0, padding: 0 }} />
	) : (
		<VisibilityOff sx={{ margin: 0, padding: 0 }} />
	);
};

export const LoginPage = () => {
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const handleClickShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data: FieldValues) => console.log(data);

	return (
		<Container
			sx={{
				scrollbarWidth: 'thin',
				padding: {
					xs: '0',
				},
				display: 'flex',
				flexDirection: 'column',
				justifyContent: {
					xs: 'flex-start',
					sm: 'center',
				},
				alignItems: {
					xs: 'flex-start',
					sm: 'center',
				},
				height: '100vh',
				minHeight: '700px',
				overflowX: 'auto',
			}}
		>
			<Paper
				elevation={5}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '30px 0',
					height: {
						xs: '100%',
						sm: 'auto',
					},
					width: {
						xs: '100%',
						sm: '350px',
					},
					minWidth: '300px',
					margin: {
						xs: '0px',
						sm: '10px 20px 10px 20px',
					},
				}}
			>
				<Typography
					variant="h6"
					noWrap
					component="a"
					href="/"
					sx={{
						display: 'flex',
						fontFamily: 'Courgette',
						fontWeight: 700,
						fontSize: '45px',
						letterSpacing: '.3rem',
						color: theme.palette.otherColor.mainBlue,
						textDecoration: 'none',
					}}
				>
					wishlist
				</Typography>
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
						placeholder={'Login'}
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '200px',
							marginTop: '5px',
						}}
						type={'email'}
						{...register('email', { required: true })}
					/>
					{errors.email && (
						<span
							style={{ fontFamily: 'Montserrat', color: 'black' }}
						>
							Login is mandatory
						</span>
					)}
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
										{renderPasswordVisibilityIcon(
											showPassword
										)}
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
					<Button
						variant="contained"
						sx={{
							marginTop: '10px',
							backgroundColor: theme.palette.otherColor.mainBlue,
						}}
						type={'submit'}
					>
						Login
					</Button>
					<Link
						href="#"
						sx={{
							marginTop: '10px',
							color: 'black',
							fontFamily: 'Montserrat',
							textDecoration: 'underline',
							fontWeight: 400,
						}}
					>
						Forgot password?
					</Link>
					<Box mt={'10px'} display={'flex'} alignItems={'center'}>
						<Typography
							sx={{
								color: 'black',
								fontFamily: 'Montserrat',
								marginRight: 0,
								paddingRight: 0,
								fontWeight: 400,
							}}
						>
							Don&apos;t have an account?
						</Typography>
						<Link
							href="#"
							sx={{
								paddingLeft: '3px',
								fontFamily: 'Montserrat',
								marginLeft: 0,
								color: 'black',
								textDecoration: 'underline',
								fontWeight: 400,
							}}
						>
							Sign up
						</Link>
					</Box>
				</form>
			</Paper>
		</Container>
	);
};
