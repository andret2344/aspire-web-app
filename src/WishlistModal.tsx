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

interface WishlistModalProps {
	opened: boolean;
	toggleModal: () => void;
}

export const WishlistModal = (props: WishlistModalProps) => {
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));

	return (
		<Modal
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
