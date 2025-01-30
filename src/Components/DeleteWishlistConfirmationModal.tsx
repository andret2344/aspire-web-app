import {Box, Button, Modal, Paper, Typography} from '@mui/material';
import React, {KeyboardEvent} from 'react';
import {Trans, useTranslation} from 'react-i18next';

interface WishlistConfirmationModalProps {
	readonly opened: boolean;
	readonly wishlistName: string;
	readonly toggleModal: () => void;
	readonly onRemove: () => void;
}

export function DeleteWishlistConfirmationModal(
	props: WishlistConfirmationModalProps
): React.ReactElement {
	const {t} = useTranslation();

	function handleDeleteOnKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			props.onRemove();
		}
	}

	return (
		<Modal
			data-testid='wishlistConfModal'
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center'
			}}
			onKeyDown={handleDeleteOnKeyDown}
			onClose={props.toggleModal}
			open={props.opened}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Paper
				sx={{
					padding: '30px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-evenly'
				}}
			>
				<Typography
					id='modal-modal-title'
					variant='h5'
					component='h2'
					data-testid='delete-confirmation'
				>
					<Trans
						i18nKey='delete-confirmation'
						values={{wishlist: props.wishlistName}}
					>
						Are you sure you want to delete the{' '}
						<strong>{props.wishlistName}</strong> wishlist?
					</Trans>
				</Typography>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						width: '80%',
						marginTop: '20px'
					}}
				>
					<Button
						onClick={props.toggleModal}
						variant='outlined'
					>
						{t('cancel')}
					</Button>
					<Button
						data-testid='button-ok'
						onClick={props.onRemove}
						variant='contained'
					>
						ok
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
}
