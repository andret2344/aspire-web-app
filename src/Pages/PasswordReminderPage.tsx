import React from 'react';
import {AuthContainer} from '../Components/AuthContainer';
import {
	Box,
	Button,
	Link,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import {useForm} from 'react-hook-form';
import {requestResetPassword} from '../Services/AuthService';
import {useSnackbar} from 'notistack';
import {Link as Anchor, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

export function PasswordReminderPage(): React.ReactElement {
	type Inputs = {readonly email: string};
	const navigate = useNavigate();
	const {t} = useTranslation();
	const theme = useTheme();
	const {enqueueSnackbar} = useSnackbar();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const {register, handleSubmit} = useForm<Inputs>();

	function onSubmit(data: Inputs): void {
		requestResetPassword(data.email)
			.then((): void => {
				enqueueSnackbar('Password reset link sent!', {
					variant: 'success'
				});
				navigate('/');
			})
			.catch((): void => {
				enqueueSnackbar('something-went-wrong', {
					variant: 'error'
				});
			});
	}

	return (
		<AuthContainer>
			<Box
				m='5px'
				display='flex'
				alignItems='center'
			>
				<Typography
					align='center'
					sx={{
						fontFamily: 'Montserrat',
						fontWeight: 400
					}}
				>
					{t('enter-email')}
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
					variant='filled'
					placeholder={t('email-address')}
					size={isSmallerThan600 ? 'small' : 'medium'}
					sx={{
						width: '200px',
						marginTop: '5px'
					}}
					type='email'
					{...register('email', {required: true})}
				/>
				<Button
					variant='contained'
					sx={{
						marginTop: '10px'
					}}
					type='submit'
				>
					{t('send')}
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
						{t('back-to')}
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
						{t('log-in')}
					</Link>
				</Box>
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
						sx={{
							paddingLeft: '3px',
							fontFamily: 'Montserrat',
							marginLeft: 0,
							textDecoration: 'underline',
							fontWeight: 400
						}}
					>
						{t('sign-up')}
					</Link>
				</Box>
			</form>
		</AuthContainer>
	);
}
