import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {Box, Button} from '@mui/material';
import {AspireModal} from './AspireModal';

interface DeleteWishlistModalProps {
	readonly open: boolean;
	readonly wishlistName: string;
	readonly onCancel: () => void;
	readonly onRemove: () => void;
}

export function DeleteWishlistModal(props: DeleteWishlistModalProps): React.ReactElement {
	const {t} = useTranslation();

	function createTitle(): React.ReactElement {
		return (
			<Trans
				i18nKey='delete-confirmation'
				values={{
					wishlist: props.wishlistName
				}}
				components={{
					strong: <strong />
				}}
				data-testid='delete-confirmation'
			/>
		);
	}

	return (
		<AspireModal
			data-testid='delete-wishlist-modal'
			title={createTitle()}
			open={props.open}
			onClose={props.onCancel}
			onSubmit={props.onRemove}
		>
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
					variant='outlined'
					color='primary'
					data-testid='delete-wishlist-modal-button-cancel'
					onClick={props.onCancel}
					sx={{
						margin: '0 20px'
					}}
				>
					{t('cancel')}
				</Button>
				<Button
					variant='contained'
					color='error'
					data-testid='delete-wishlist-modal-button-delete'
					onClick={props.onRemove}
					sx={{
						margin: '0 20px'
					}}
				>
					{t('delete')}
				</Button>
			</Box>
		</AspireModal>
	);
}
