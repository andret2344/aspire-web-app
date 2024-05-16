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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import {useTranslation} from 'react-i18next';

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
	const isSmallerThan900 = useMediaQuery(theme.breakpoints.up('md'));
	const [priority, setPriority] = React.useState<number>(1);
	const [description, setDescription] = React.useState<string | undefined>(
		props.editingItem?.description
	);
	const inputRefName = React.useRef<HTMLInputElement>(null);
	const inputRefDescription = React.useRef<HTMLInputElement>(null);
	const {enqueueSnackbar} = useSnackbar();
	const modules = {
		toolbar: [
			[{header: [1, 2, 3, 4, 5, 6, false]}],
			[{font: []}],
			[{size: []}],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[
				{list: 'ordered'},
				{List: 'bullet'},
				{indent: '-1'},
				{indent: '+1'}
			],

			['link', 'image', 'video']
		]
	};

	React.useEffect((): void => {
		if (props.editingItem) {
			setPriority(props.editingItem.priorityId);
			if (inputRefName.current) {
				inputRefName.current.value = props.editingItem.name;
			}

			setDescription(props.editingItem.description);
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
		setDescription('');
	};

	const handleSaveButton = async (): Promise<void> => {
		const wishlistItemName = inputRefName.current?.value;
		const wishlistItemDescription = description;
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
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: {
					xs: '0',
					md: '30px 0'
				}
			}}
		>
			<Paper
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '30px 0',
					width: {
						xs: '100%',
						md: '80%'
					},
					height: {
						xs: '100%',
						md: 'auto'
					}
				}}
			>
				<Typography>
					{props.editingItem?.description
						? 'Edit wish'
						: 'Add new wish'}
				</Typography>
				<TextField
					hiddenLabel
					variant={'filled'}
					placeholder={
						props.editingItem?.name || 'Type here your wish'
					}
					defaultValue={props.editingItem?.name || ''}
					inputRef={inputRefName}
					size={isSmallerThan900 ? 'small' : 'medium'}
					sx={{
						width: {
							xs: '95%',
							md: '80%'
						},
						marginTop: '15px'
					}}
				/>
				<FormControl
					sx={{
						m: 3,
						width: {
							xs: '95%',
							md: '80%'
						}
					}}
				>
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
