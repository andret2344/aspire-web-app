import React from 'react';
import {AuthComponent} from '../Components/AuthComponent';
import {Header} from '../Components/Header';
import {
	Box,
	Button,
	TextField,
	Typography,
	useMediaQuery,
	Link,
	useTheme
} from '@mui/material';
import {useForm} from 'react-hook-form';
import {requestResetPassword} from '../Services/AuthService';
import {useSnackbar} from 'notistack';
import {Link as Anchor, useNavigate} from 'react-router-dom';

export const PasswordReminderPage: React.FC = (): React.ReactElement => {
	type Inputs = {
		readonly email: string;
	};
	const navigate = useNavigate();
	const theme = useTheme();
	const {enqueueSnackbar} = useSnackbar();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));

	const onSubmit = (data: Inputs): void => {
		requestResetPassword(data.email)
			.then((): void => {
				enqueueSnackbar('Password reset link sent!', {
					variant: 'success'
				});
				navigate('/');
			})
			.catch((): void => {
				enqueueSnackbar('Some error occurred!', {
					variant: 'error'
				});
			});
	};

	const {register, handleSubmit} = useForm<Inputs>();

	return (
		<Header>
			<AuthComponent>
				<Box
					m={'5px'}
					display={'flex'}
					alignItems={'center'}
				>
					<Typography
						align={'center'}
						sx={{
							fontFamily: 'Montserrat',
							fontWeight: 400
						}}
					>
						Enter your e-mail and we&apos;ll send you a link to
						reset your password
					</Typography>
				</Box>
				<form
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
					className='reminderForm'
					onSubmit={handleSubmit(onSubmit)}
				>
					<TextField
						hiddenLabel
						variant={'filled'}
						placeholder={'E-mail address'}
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '200px',
							marginTop: '5px'
						}}
						type={'email'}
						{...register('email', {required: true})}
					/>
					<Button
						variant='contained'
						sx={{
							marginTop: '10px'
						}}
						type={'submit'}
					>
						send
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
							Back to
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
							Log in
						</Link>
					</Box>
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
							component={Anchor}
							to={'/register'}
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
