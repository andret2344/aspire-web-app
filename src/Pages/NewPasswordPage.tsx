import {
	Button,
	IconButton,
	InputAdornment,
	TextField,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import '../../assets/fonts.css';
import {AuthComponent} from '../Components/AuthComponent';
import {RenderPasswordVisibilityIcon} from '../Components/PasswordVisibilityIcon';
import {useNavigate, useParams} from 'react-router-dom';
import {resetPassword} from '../Services/AuthService';
import {Header} from '../Components/Header';
import {useSnackbar} from 'notistack';

export const NewPasswordPage: React.FC = (): React.ReactElement => {
	type Inputs = {readonly password: string; readonly passwordRepeat: string};
	type Params = {readonly token?: string};
	const params: Params = useParams<Params>();
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [showPasswordRepeat, setShowPasswordRepeat] =
		React.useState<boolean>(false);
	const {enqueueSnackbar} = useSnackbar();

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
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = (data: Inputs): void => {
		if (data.password !== data.passwordRepeat) {
			setError('passwordRepeat', {
				type: 'manual',
				message: 'Passwords are not equal.'
			});
			return;
		}

		resetPassword(data.password, data.passwordRepeat, params.token ?? '')
			.then((response: number): void => {
				if ([200, 201].includes(response || -1)) {
					enqueueSnackbar('Successfully changed password!', {
						variant: 'success'
					});
					navigate('/');
				}
			})
			.catch((): void => {
				enqueueSnackbar('Some error occurred!', {
					variant: 'error'
				});
			});
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
						type={showPassword ? 'text' : 'password'}
						autoComplete={'new-password'}
						InputProps={{
							endAdornment: (
								<InputAdornment
									position='end'
									sx={{margin: 0, padding: 0}}
								>
									<IconButton
										data-testid={'visibilityIconPassword'}
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
						autoComplete={'new-password'}
						InputProps={{
							endAdornment: (
								<InputAdornment
									position='end'
									sx={{margin: 0, padding: 0}}
								>
									<IconButton
										data-testid={
											'visibilityIconRepeatPassword'
										}
										sx={{margin: 0, padding: 0}}
										onClick={handleClickShowPasswordRepeat}
									>
										<RenderPasswordVisibilityIcon
											showPassword={showPasswordRepeat}
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
						change password
					</Button>
				</form>
			</AuthComponent>
		</Header>
	);
};
