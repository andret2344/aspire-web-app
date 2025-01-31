import {
	Box,
	Button,
	Modal,
	Paper,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React from 'react';
import {addWishlist} from '../../Services/WishListService';
import {WishList} from '../../Entity/WishList';
import {useTranslation} from 'react-i18next';

interface WishlistModalProps {
	readonly opened: boolean;
	readonly onClose: () => void;
	readonly onAddWishlist: (newWishlist: WishList) => void;
}

export function CreateWishlistModal(
	props: WishlistModalProps
): React.ReactElement {
	const theme = useTheme();
	const {t} = useTranslation();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const inputRef = React.useRef<HTMLInputElement>(null);

	async function handleSubmit(
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> {
		if (!inputRef.current) {
			return;
		}
		e.preventDefault();
		const wishlistName: string = inputRef.current.value;
		if (!wishlistName) {
			return;
		}
		const newWishlist: WishList = await addWishlist(wishlistName);
		props.onAddWishlist(newWishlist);
		inputRef.current.value = '';
	}

	return (
		<Modal
			data-testid='add-wishlist-modal'
			onClose={props.onClose}
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
				onSubmit={handleSubmit}
			>
				<Typography
					id='modal-title'
					variant='h5'
					component='div'
				>
					{t('enter-wishlist-name')}
				</Typography>
				<TextField
					hiddenLabel
					variant='filled'
					placeholder={t('name')}
					inputRef={inputRef}
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
						color='primary'
						variant='contained'
						sx={{
							marginTop: '10px'
						}}
						type='submit'
					>
						{t('save')}
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
}
