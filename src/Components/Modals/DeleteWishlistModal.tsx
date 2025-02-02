import {Box, Button, Modal, Paper, Typography} from '@mui/material';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';

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

	return (
		<Modal
			data-testid='delete-wishlist-modal'
			onClose={props.onCancel}
			open={props.opened}
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
		>
			<Paper
				sx={{
					width: '400px',
					height: '250px',
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-evenly'
				}}
				component='form'
				onSubmit={props.onRemove}
			>
				<Typography
					id='modal-title'
					variant='h5'
					component='div'
					data-testid='delete-confirmation'
				>
					<Trans values={{wishlist: props.wishlistName}}>
						Are you sure you want to delete the{' '}
						<strong>{props.wishlistName}</strong> wishlist?
					</Trans>
				</Typography>
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
			</Paper>
		</Modal>
	);
}
