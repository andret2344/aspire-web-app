import React from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Button, TextField, Theme, useMediaQuery, useTheme} from '@mui/material';
import {mapWishlistFromDto, WishList, WishListDto} from '@entity/WishList';
import {addWishlist} from '@service/WishListService';
import {AspireModal} from './AspireModal';

interface WishlistModalProps {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly onAddWishlist: (newWishlist: WishList) => void;
}

export function CreateWishlistModal(props: WishlistModalProps): React.ReactElement {
	const [wishlistName, setWishlistName] = React.useState<string>('');

	const theme: Theme = useTheme();
	const {t} = useTranslation();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setWishlistName(e.target.value);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();
		const newWishlist: WishListDto = await addWishlist(wishlistName.trim());
		props.onAddWishlist(mapWishlistFromDto(newWishlist));
		setWishlistName('');
	}

	return (
		<AspireModal
			data-testid='add-wishlist-modal'
			onClose={props.onClose}
			open={props.open}
			title={t('enter-wishlist-name')}
			onSubmit={handleSubmit}
		>
			<TextField
				data-testid='input-wishlist-name'
				id='demo-helper-text-misaligned-no-helper'
				label={t('name')}
				value={wishlistName}
				onChange={handleNameChange}
				size={isMobile ? 'small' : 'medium'}
				sx={{
					width: '300px',
					marginTop: '15px'
				}}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '10px'
				}}
			>
				<Button
					data-testid='button-cancel'
					variant='outlined'
					color='error'
					sx={{
						margin: '10px 20px 0 20px'
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
						margin: '10px 20px 0 20px'
					}}
					type='submit'
				>
					{t('save')}
				</Button>
			</Box>
		</AspireModal>
	);
}
