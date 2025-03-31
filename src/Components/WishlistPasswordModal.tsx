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
import React from 'react';
import {WishList} from '../Entity/WishList';
import {useTranslation} from 'react-i18next';

interface AccessPasswordModalProps {
	readonly wishlist: WishList;
	readonly open: boolean;
	readonly onClose: () => void;
	readonly onAccept: (id: number, password: string) => void;
}

export function WishlistPasswordModal(
	props: AccessPasswordModalProps
): React.ReactElement {
	const {t} = useTranslation();
	const [password, setPassword] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	function handleClickShowPassword(): void {
		setShowPassword((prev: boolean): boolean => !prev);
	}

	function handleCancelButton(): void {
		props.onClose();
	}

	function handleSubmitButton(): void {
		props.onAccept(props.wishlist.id, password);
	}

	function renderWarningTypography(): React.ReactElement {
		if (!props.wishlist?.hasPassword) {
			return <></>;
		}
		return (
			<Typography
				color='warning'
				variant='caption'
			>
				{t('wishlist-has-password')}
			</Typography>
		);
	}

	return (
		<Modal
			onClose={handleCancelButton}
			open={props.open}
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
				<Typography
					variant='body1'
					marginBottom='1em'
				>
					{t('set-wishlist-password')}
				</Typography>
				{renderWarningTypography()}
				<TextField
					data-testid='wishlist-password-modal-input'
					type={showPassword ? 'text' : 'password'}
					autoComplete='new-password'
					slotProps={{
						input: {
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
						}
					}}
					hiddenLabel
					variant='filled'
					placeholder={t('password')}
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
						data-testid='wishlist-password-modal-cancel'
						onClick={handleCancelButton}
						variant='contained'
						sx={{
							margin: '10px'
						}}
					>
						{t('cancel')}
					</Button>
					<Button
						data-testid='wishlist-password-modal-confirm'
						onClick={handleSubmitButton}
						disabled={!password}
						variant='contained'
						sx={{
							margin: '10px'
						}}
					>
						{t('confirm')}
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
}
