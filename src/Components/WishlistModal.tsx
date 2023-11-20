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
import {addWishlist} from '../Services/WishListService';
import {WishList} from '../Entity/WishList';

interface WishlistModalProps {
	readonly opened: boolean;
	readonly toggleModal: () => void;
	readonly addNewWishlist: (newWishlist: WishList) => void;
}

export const WishlistModal = (
	props: WishlistModalProps
): React.ReactElement => {
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleSaveButton = async (): Promise<void> => {
		const wishlistName = inputRef.current?.value;
		if (wishlistName) {
			const newWishlist = await addWishlist(wishlistName);
			if (newWishlist) {
				props.addNewWishlist(newWishlist);
				props.toggleModal();
				if (inputRef.current) {
					inputRef.current.value = '';
				}
			}
		}
	};

	return (
		<Modal
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
					Type a name of your new wishlist
				</Typography>
				<TextField
					hiddenLabel
					variant={'filled'}
					placeholder={'Name'}
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
						Cancel
					</Button>
					<Button
						onClick={handleSaveButton}
						variant='contained'
						sx={{
							marginTop: '10px'
						}}
					>
						Save
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};
