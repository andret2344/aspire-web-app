import {
	Box,
	Button,
	TextField,
	Theme,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React from 'react';
import {addWishlist} from '../../Services/WishListService';
import {WishList} from '../../Entity/WishList';
import {useTranslation} from 'react-i18next';
import {AspireModal} from './AspireModal';

interface WishlistModalProps {
	readonly opened: boolean;
	readonly onClose: () => void;
	readonly onAddWishlist: (newWishlist: WishList) => void;
}

export function CreateWishlistModal(
	props: WishlistModalProps
): React.ReactElement {
	const theme: Theme = useTheme();
	const {t} = useTranslation();
	const isSmallerThan600: boolean = useMediaQuery(theme.breakpoints.up('sm'));
	const [wishlistName, setWishlistName] = React.useState<string>('');

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setWishlistName(e.target.value);
	}

	async function handleSubmit(
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> {
		e.preventDefault();
		const newWishlist: WishList = await addWishlist(wishlistName.trim());
		props.onAddWishlist(newWishlist);
		setWishlistName('');
	}

	return (
		<AspireModal
			data-testid='add-wishlist-modal'
			onClose={props.onClose}
			opened={props.opened}
			title={t('enter-wishlist-name')}
			onSubmit={handleSubmit}
		>
			<TextField
				data-testid='input-wishlist-name'
				hiddenLabel
				variant='filled'
				placeholder={t('name')}
				value={wishlistName}
				onChange={handleNameChange}
				size={isSmallerThan600 ? 'small' : 'medium'}
				sx={{
					width: '300px',
					marginTop: '15px'
				}}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '80%',
					alignItems: 'center'
				}}
			>
				<Button
					data-testid='button-cancel'
					variant='outlined'
					color='error'
					sx={{
						marginTop: '10px'
					}}
					onClick={props.onClose}
				>
					{t('cancel')}
				</Button>
				<Button
					data-testid='button-save'
					color='primary'
					variant='contained'
					disabled={!wishlistName}
					sx={{
						marginTop: '10px'
					}}
					type='submit'
				>
					{t('save')}
				</Button>
			</Box>
		</AspireModal>
	);
}
