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
				i18nKey='delete-confirmation'
				values={{wishlist: props.wishlistName}}
				components={{strong: <strong />}}
				data-testid='delete-confirmation'
			/>
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
					data-testid='delete-wishlist-modal-button-cancel'
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
					data-testid='delete-wishlist-modal-button-delete'
					onClick={props.onRemove}
				>
					{t('delete')}
				</Button>
			</Box>
		</AspireModal>
	);
}
