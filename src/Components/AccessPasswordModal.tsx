import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Modal,
	Paper,
	TextField,
	Typography
} from '@mui/material';
import '../../assets/fonts.css';
import {PasswordVisibilityIcon} from './PasswordVisibilityIcon';
import {setWishlistPassword} from '../Services/WishListService';
import React from 'react';
import {WishList} from '../Entity/WishList';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';

interface AccessPasswordModalProps {
	readonly wishlist: WishList;
	readonly onClose: () => void;
	readonly onAccept: (id: number, password: string) => void;
	readonly opened: boolean;
}

export const AccessPasswordModal = (
	props: AccessPasswordModalProps
): React.ReactElement => {
	const [password, setPassword] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [forgotPassword, setForgotPassword] = React.useState<boolean>(
		props.wishlist.has_password
	);
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();

	function handleClickShowPassword(): void {
		setShowPassword((prev: boolean): boolean => !prev);
	}

	function handleClickForgotPassword(): void {
		setForgotPassword((prev: boolean): boolean => !prev);
	}

	function handleCancelButton(): void {
		props.onClose();
		setPassword('');
		setForgotPassword(props.wishlist.has_password);
	}

	function handleSubmitButton(): void {
		if (!forgotPassword) {
			setWishlistPassword(props.wishlist.id, password).then((): void => {
				setPassword('');
				enqueueSnackbar(t('password-changed!'), {
					variant: 'success'
				});
				props.onClose();
				setForgotPassword(props.wishlist.has_password);
			});
		} else {
			props.onAccept(props.wishlist.id, password);
			setPassword('');
			props.onClose();
			setForgotPassword(props.wishlist.has_password);
		}
	}

	return (
		<Modal
			open={props.opened}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: {
					xs: '0',
					md: '30px 0'
				}
			}}
		>
			<Paper
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '30px 0',
					width: {
						xs: '100%',
						md: '40%'
					},
					height: {
						xs: '25%',
						md: 'auto'
					}
				}}
			>
				<Typography>
					{!forgotPassword
						? `Set password for this
					wishlist`
						: `Enter password to reveal ${props.wishlist.name} hidden items`}
				</Typography>
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
									data-testid={'visibilityIcon'}
									sx={{margin: 0, padding: 0}}
									onClick={handleClickShowPassword}
								>
									<PasswordVisibilityIcon
										visible={showPassword}
									/>
								</IconButton>
							</InputAdornment>
						)
					}}
					hiddenLabel
					variant={'filled'}
					placeholder={'Password'}
					onChange={(e) => {
						setPassword(e.currentTarget.value);
					}}
					sx={{
						width: {
							xs: '55%',
							md: '70%'
						},
						margin: '10px 0'
					}}
					required
				/>
				{forgotPassword && (
					<Button
						variant='text'
						onClick={() => handleClickForgotPassword()}
						style={{
							textDecoration: 'underline',
							margin: '5px',
							fontFamily: 'Montserrat',
							fontWeight: '400'
						}}
					>
						{t('forgot-password')}
					</Button>
				)}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						width: '80%'
					}}
				>
					<Button
						onClick={() => handleCancelButton()}
						variant='contained'
						sx={{
							margin: '10px'
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => handleSubmitButton()}
						disabled={!password}
						variant='contained'
						sx={{
							margin: '10px'
						}}
					>
						Confirm
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};
