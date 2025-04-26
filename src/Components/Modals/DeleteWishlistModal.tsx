import {Box, Button} from '@mui/material';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {AspireModal} from './AspireModal';

interface DeleteWishlistModalProps {
	readonly opened: boolean;
	readonly wishlistName: string;
	readonly onCancel: () => void;
	readonly onRemove: () => void;
}

export function DeleteWishlistModal(
	props: DeleteWishlistModalProps
): React.ReactElement {
	const {t} = useTranslation();

	function createTitle(): React.ReactElement {
		return (
			<Trans
				values={{wishlist: props.wishlistName}}
				data-testid='delete-confirmation'
			>
				Are you sure you want to delete the{' '}
				<strong>{props.wishlistName}</strong> wishlist?
			</Trans>
		);
	}

	return (
		<AspireModal
			data-testid='delete-wishlist-modal'
			title={createTitle()}
			opened={props.opened}
			onClose={props.onCancel}
			onSubmit={props.onRemove}
		>
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
					variant='outlined'
					color='primary'
					sx={{
						marginTop: '10px'
					}}
					onClick={props.onCancel}
				>
					{t('cancel')}
				</Button>
				<Button
					variant='contained'
					color='error'
					sx={{
						marginTop: '10px'
					}}
					data-testid='button-delete'
					onClick={props.onRemove}
				>
					{t('delete')}
				</Button>
			</Box>
		</AspireModal>
	);
}
