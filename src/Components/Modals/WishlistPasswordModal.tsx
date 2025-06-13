import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	TextField,
	Typography
} from '@mui/material';
import '../../../assets/fonts.css';
import {PasswordVisibilityIcon} from '../PasswordVisibilityIcon';
import React from 'react';
import {WishList} from '../../Entity/WishList';
import {useTranslation} from 'react-i18next';
import {AspireModal} from './AspireModal';

interface AccessPasswordModalProps {
	readonly wishlist: WishList;
	readonly open: boolean;
	readonly onAccept: (wishlistId: number, password: string) => void;
	readonly onClear: (wishlistId: number) => void;
	readonly onClose: () => void;
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

	function handlePasswordChange(
		e: React.ChangeEvent<HTMLInputElement>
	): void {
		setPassword(e.target.value.trim());
	}

	function handleSubmitButton(): void {
		props.onAccept(props.wishlist.id, password);
	}

	function handleClearButton(): void {
		props.onClear(props.wishlist.id);
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
		<AspireModal
			title={t('set-wishlist-password')}
			opened={props.open}
			onClose={handleCancelButton}
		>
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
				onChange={handlePasswordChange}
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
					color='error'
					variant='outlined'
					sx={{
						margin: '10px'
					}}
				>
					{t('cancel')}
				</Button>
				<Button
					data-testid='wishlist-password-modal-clear'
					onClick={handleClearButton}
					disabled={!props.wishlist?.hasPassword}
					color='error'
					variant='contained'
					sx={{
						margin: '10px'
					}}
				>
					{t('clear')}
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
		</AspireModal>
	);
}
