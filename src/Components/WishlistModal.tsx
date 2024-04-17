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
import React, {KeyboardEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {addWishlist} from '../Services/WishListService';
import {WishList} from '../Entity/WishList';
import {useTranslation} from 'react-i18next';
interface WishlistModalProps {
	readonly opened: boolean;
	readonly toggleModal: () => void;
	readonly addNewWishlist: (newWishlist: WishList) => void;
}

export const WishlistModal = (
	props: WishlistModalProps
): React.ReactElement => {
	const theme = useTheme();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleSaveOnKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleSaveButton();
		}
	};

	const handleSaveButton = async (): Promise<void> => {
		const wishlistName = inputRef.current?.value;
		if (wishlistName) {
			const newWishlist = await addWishlist(wishlistName);
			if (newWishlist) {
				props.addNewWishlist(newWishlist);
				props.toggleModal();
				navigate(`/wishlists/${newWishlist?.id}`);
				if (inputRef.current) {
					inputRef.current.value = '';
				}
			}
		}
	};

	return (
		<Modal
			data-testid='addWishlistModal'
			onKeyDown={handleSaveOnKeyDown}
			onClose={props.toggleModal}
			open={props.opened}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
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
			>
				<Typography
					id='modal-modal-title'
					variant='h5'
					component='h2'
				>
					{t('Type a name of your new wishlist')}
				</Typography>
				<TextField
					hiddenLabel
					variant={'filled'}
					placeholder={`${t('Name')}`}
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
						variant='contained'
						sx={{
							marginTop: '10px'
						}}
						onClick={props.toggleModal}
					>
						{t('Cancel')}
					</Button>
					<Button
						onClick={handleSaveButton}
						variant='contained'
						sx={{
							marginTop: '10px'
						}}
					>
						{t('Save')}
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};
