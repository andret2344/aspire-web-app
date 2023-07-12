import React from 'react';
import { AuthComponent } from './AuthComponent';
import {
	Box,
	Button,
	TextField,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { theme } from './theme';
import { FieldValues, useForm } from 'react-hook-form';

export const PasswordReminderPage = () => {
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));

	const onSubmit = (data: FieldValues) => console.log(data);

	const { register, handleSubmit } = useForm();

	return (
		<AuthComponent>
			<Box m={'10px'} display={'flex'} alignItems={'center'}>
				<Typography
					align={'center'}
					sx={{
						color: 'black',
						fontFamily: 'Montserrat',
						fontWeight: 400,
					}}
				>
					Enter your e-mail and we&apos;ll send you a link to reset
					your password
				</Typography>
			</Box>
			<form
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				className="reminderForm"
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
				<Button
					variant="contained"
					sx={{
						marginTop: '10px',
						backgroundColor: theme.palette.otherColor.mainBlue,
					}}
					type={'submit'}
				>
					Send
				</Button>
			</form>
		</AuthComponent>
	);
};
