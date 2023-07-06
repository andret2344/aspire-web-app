import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { theme } from './theme';
import { FieldValues, useForm } from 'react-hook-form';
import React from 'react';
import '../assets/fonts.css';

export const LoginPage = () => {
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
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
			<Box
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				sx={{
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
					borderColor: theme.palette.otherColor.mainBlue,
					borderStyle: 'solid',
					borderWidth: '2px',
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
						fullWidth={true}
						sx={{
							borderRadius: '5px',
							border: 'none',
							width: {
								xs: '80%',
								sm: '250px',
							},
							margin: '5px',
							backgroundColor: 'white',
							'& .MuiFilledInput-underline:before': {
								borderBottom: 'none',
							},
							'& .MuiFilledInput-underline:after': {
								borderBottom: 'none',
							},
							'& .MuiFilledInput-underline:hover:not(.Mui-disabled):before':
								{
									borderBottom: 'none',
								},
						}}
						type={'email'}
						{...register('email', { required: true })}
					/>
					{errors.email && (
						<span style={{ color: 'black' }}>
							Login is mandatory
						</span>
					)}
					<TextField
						hiddenLabel
						variant={'filled'}
						placeholder={'Password'}
						size={isSmallerThan600 ? 'small' : 'medium'}
						fullWidth={true}
						sx={{
							borderRadius: '5px',
							border: 'none',
							width: {
								xs: '80%',
								sm: '250px',
							},
							margin: '5px',
							backgroundColor: 'white',
							'& .MuiFilledInput-underline:before': {
								borderBottom: 'none',
							},
							'& .MuiFilledInput-underline:after': {
								borderBottom: 'none',
							},
							'& .MuiFilledInput-underline:hover:not(.Mui-disabled):before':
								{
									borderBottom: 'none',
								},
						}}
						type="password"
						{...register('password')}
					/>
					<Button
						variant="contained"
						sx={{
							height: {
								xs: '60px',
								sm: '40px',
							},
							width: '150px',
							marginTop: '10px',
							backgroundColor: theme.palette.otherColor.mainBlue,
						}}
						type={'submit'}
					>
						Login
					</Button>
					<Button
						variant="contained"
						sx={{
							height: {
								xs: '60px',
								sm: '40px',
							},
							width: '150px',
							marginTop: '10px',
							backgroundColor: theme.palette.otherColor.mainBlue,
						}}
					>
						Register
					</Button>
				</form>
			</Box>
		</Container>
	);
};
