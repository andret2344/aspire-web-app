import {
	Box,
	Button,
	FormControl,
	MenuItem,
	Modal,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React from 'react';
import {
	addWishlistItem,
	editWishlistItem
} from '../Services/WishlistItemService';
import {getAllPriorities, Priority} from '../Entity/Priority';
import {WishlistItem} from '../Entity/WishlistItem';
import {useSnackbar} from 'notistack';

interface WishlistItemModalProps {
	readonly wishlistId?: number;
	readonly opened: boolean;
	readonly toggleModal: () => void;
	readonly getWishlistAgain: (id: number) => void;
	readonly editingItem?: WishlistItem;
}

export const WishlistItemModal = (
	props: WishlistItemModalProps
): React.ReactElement => {
	const theme = useTheme();
	const isSmallerThan600 = useMediaQuery(theme.breakpoints.up('sm'));
	const [priority, setPriority] = React.useState<number>(1);
	const inputRefName = React.useRef<HTMLInputElement>(null);
	const inputRefDescription = React.useRef<HTMLInputElement>(null);
	const {enqueueSnackbar} = useSnackbar();

	React.useEffect((): void => {
		if (props.editingItem) {
			setPriority(props.editingItem.priorityId);
			if (inputRefName.current) {
				inputRefName.current.value = props.editingItem.name;
			}
			if (inputRefDescription.current) {
				inputRefDescription.current.value =
					props.editingItem.description;
			}
		}
	}, [props.editingItem]);

	const handleChangePriority = (
		event: SelectChangeEvent<typeof priority>
	): void => {
		setPriority(event.target.value as number);
	};

	const toggleModalAndClearFields = (): void => {
		props.toggleModal();
		setPriority(1);
		if (inputRefName.current) {
			inputRefName.current.value = '';
		}
		if (inputRefDescription.current) {
			inputRefDescription.current.value = '';
		}
	};

	const handleSaveButton = async (): Promise<void> => {
		const wishlistItemName = inputRefName.current?.value;
		const wishlistItemDescription = inputRefDescription.current?.value;
		if (props.wishlistId && wishlistItemName && wishlistItemDescription) {
			if (props.editingItem) {
				const updatedWishlistItem = await editWishlistItem(
					props.wishlistId,
					props.editingItem.id,
					wishlistItemName,
					wishlistItemDescription,
					priority
				);
				if (updatedWishlistItem) {
					props.getWishlistAgain(props.wishlistId);
					toggleModalAndClearFields();
				}
			} else {
				if (priority) {
					setPriority(1);
				}

				const newWishlistItem = await addWishlistItem(
					props.wishlistId,
					wishlistItemName,
					wishlistItemDescription,
					priority
				);

				if (newWishlistItem) {
					props.getWishlistAgain(props.wishlistId);
					toggleModalAndClearFields();
					enqueueSnackbar('Successfully saved wishlist item.', {
						variant: 'success'
					});
				} else {
					enqueueSnackbar('Too long name or description.', {
						variant: 'error'
					});
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
					height: '550px',
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
				<TextField
					hiddenLabel
					variant={'filled'}
					placeholder={
						props.editingItem?.name || 'Type here your wish'
					}
					defaultValue={props.editingItem?.name || ''}
					inputRef={inputRefName}
					size={isSmallerThan600 ? 'small' : 'medium'}
					sx={{
						width: '300px',
						marginTop: '15px'
					}}
				/>
				<FormControl sx={{m: 1, width: '300px'}}>
					<Select
						labelId='demo-simple-select-autowidth-label'
						id='demo-simple-select-autowidth'
						value={priority}
						onChange={handleChangePriority}
						displayEmpty
						required
					>
						{getAllPriorities().map(
							(priorityItem: Priority): React.ReactElement => (
								<MenuItem
									key={priorityItem.value}
									value={priorityItem.value}
								>
									{`${priorityItem.value}\u00A0\u00A0 ${priorityItem.description}`}
								</MenuItem>
							)
						)}
					</Select>
				</FormControl>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '300px'
					}}
				>
					<Typography
						id='modal-modal-title'
						variant='h6'
						component='h2'
						sx={{alignSelf: 'flex-start'}}
					>
						Description
					</Typography>
					<TextField
						aria-label={'wishlist item description'}
						hiddenLabel
						variant={'filled'}
						defaultValue={props.editingItem?.description || ''}
						multiline
						rows={5}
						inputRef={inputRefDescription}
						size={isSmallerThan600 ? 'small' : 'medium'}
						sx={{
							width: '300px'
						}}
					/>
				</Box>
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
						onClick={toggleModalAndClearFields}
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
						Confirm
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};
