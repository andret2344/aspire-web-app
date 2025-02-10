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
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();

	function handleClickShowPassword(): void {
		setShowPassword((prev: boolean): boolean => !prev);
	}

	function handleSubmitButton(): void {
		if (!props.wishlist.has_password) {
			setWishlistPassword(props.wishlist.id, password).then((): void => {
				setPassword('');
				enqueueSnackbar(t('password-changed!'), {
					variant: 'success'
				});
				props.onClose();
			});
		}
		props.onAccept(props.wishlist.id, password);
		setPassword('');
		props.onClose();
		console.log(props.wishlist.wishlistItems);
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
				<Typography>Enter password for this wishlist</Typography>
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
						onClick={() => {
							props.onClose();
							setPassword('');
						}}
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
