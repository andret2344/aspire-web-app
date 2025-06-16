import {
	Button,
	IconButton,
	InputAdornment,
	Stack,
	TextField
} from '@mui/material';
import '../../../../assets/fonts.css';
import {PasswordVisibilityIcon} from '../PasswordVisibilityIcon';
import React from 'react';
import {WishList} from '../../Entity/WishList';
import {useTranslation} from 'react-i18next';
import {AspireModal} from './AspireModal';

interface WishlistInputPasswordModalProps {
	readonly wishlist: WishList;
	readonly open: boolean;
	readonly onAccept: (wishlistId: number, password: string) => void;
	readonly onClose: () => void;
}

export function WishlistInputPasswordModal(
	props: WishlistInputPasswordModalProps
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

	return (
		<AspireModal
			title={t('access-wishlist-password')}
			opened={props.open}
			onClose={handleCancelButton}
		>
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
									data-testid='password-visibility-icon'
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
			<Stack
				direction='row'
				spacing={1}
			>
				<Button
					data-testid='wishlist-password-modal-cancel'
					onClick={handleCancelButton}
					color='error'
					variant='outlined'
				>
					{t('cancel')}
				</Button>
				<Button
					data-testid='wishlist-password-modal-confirm'
					onClick={handleSubmitButton}
					disabled={!password}
					variant='contained'
				>
					{t('confirm')}
				</Button>
			</Stack>
		</AspireModal>
	);
}
