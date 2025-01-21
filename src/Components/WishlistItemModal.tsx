import {
	Box,
	Button,
	Checkbox,
	ClickAwayListener,
	FormControl,
	FormControlLabel,
	MenuItem,
	Modal,
	Paper,
	Select,
	SelectChangeEvent,
	TextField,
	Tooltip,
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
import {StringMap} from 'quill';
import {useTranslation} from 'react-i18next';

interface WishlistItemModalProps {
	readonly wishlistId?: number;
	readonly opened: boolean;
	readonly toggleModal: () => void;
	readonly getWishlistAgain: (id: number) => void;
	readonly editingItem?: WishlistItem;
}

export function WishlistItemModal(
	props: WishlistItemModalProps
): React.ReactElement {
	const theme = useTheme();
	const isSmallerThan900 = useMediaQuery(theme.breakpoints.up('md'));
	const [priority, setPriority] = React.useState<number>(1);
	const [hidden, setHidden] = React.useState<boolean>(false);
	const [open, setOpen] = React.useState<boolean>(false);
	const [description, setDescription] = React.useState<string | undefined>(
		props.editingItem?.description
	);
	const {t} = useTranslation();
	const inputRefName = React.useRef<HTMLInputElement>(null);
	const {enqueueSnackbar} = useSnackbar();
	const modules: StringMap = {
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

	function handleChangePriority(event: SelectChangeEvent<number>): void {
		setPriority(+event.target.value);
	}

	const handleTooltipClose = () => {
		setOpen(false);
	};

	const handleTooltipOpen = () => {
		setOpen(true);
	};

	function toggleModalAndClearFields(): void {
		props.toggleModal();
		setPriority(1);
		if (inputRefName.current) {
			inputRefName.current.value = '';
		}
		setDescription('');
	}

	async function handleSaveButton(): Promise<void> {
		const wishlistItemName: string | undefined =
			inputRefName.current?.value;
		const wishlistItemDescription: string | undefined = description;
		if (props.wishlistId && wishlistItemName && wishlistItemDescription) {
			if (props.editingItem) {
				const updatedWishlistItem = await editWishlistItem(
					props.wishlistId,
					props.editingItem.id,
					wishlistItemName,
					wishlistItemDescription,
					priority,
					hidden
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
					priority,
					hidden
				);

				if (newWishlistItem) {
					props.getWishlistAgain(props.wishlistId);
					toggleModalAndClearFields();
					enqueueSnackbar(t('saved'), {variant: 'success'});
				} else {
					enqueueSnackbar(t('too-long'), {variant: 'error'});
				}
			}
		}
	}

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
						? t('edit-item')
						: t('new-item')}
				</Typography>
				<TextField
					hiddenLabel
					variant='filled'
					placeholder={props.editingItem?.name ?? t('enter-item')}
					defaultValue={props.editingItem?.name ?? ''}
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
					<Box>
						<ClickAwayListener onClickAway={handleTooltipClose}>
							<Tooltip
								title='If you want to hide this wish, set a password for the wishlist'
								placement='right'
								PopperProps={{
									disablePortal: true
								}}
								open={open}
								disableFocusListener
								disableHoverListener
								disableTouchListener
							>
								<FormControlLabel
									onClick={() => {
										setHidden((prev): boolean => !prev);
										console.log(hidden);
										handleTooltipOpen();
									}}
									disabled
									control={<Checkbox />}
									data-testid='tooltip-test'
									label='Hide this wish'
								/>
							</Tooltip>
						</ClickAwayListener>
					</Box>
				</FormControl>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: {
							xs: '95%',
							md: '80%'
						}
					}}
				>
					<Box
						sx={{
							width: '100%',
							marginBottom: '20px'
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
						<Box
							sx={{
								paddingBottom: '10px',
								height: {
									xs: '450px',
									md: '300px'
								}
							}}
							data-testid='test-quill'
						>
							<ReactQuill
								style={{
									height: isSmallerThan900
										? '250px'
										: '450px',
									scrollbarWidth: 'none'
								}}
								theme={isSmallerThan900 ? 'snow' : 'bubble'}
								value={description}
								onChange={setDescription}
								modules={modules}
								placeholder={t('type-description-here')}
							/>
						</Box>
					</Box>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-around',
							alignItems: 'center',
							width: '80%'
						}}
					>
						<Button
							variant='contained'
							sx={{
								margin: '10px'
							}}
							onClick={toggleModalAndClearFields}
						>
							{t('cancel')}
						</Button>
						<Button
							onClick={handleSaveButton}
							variant='contained'
							sx={{
								margin: '10px'
							}}
						>
							{t('confirm')}
						</Button>
					</Box>
				</Box>
			</Paper>
		</Modal>
	);
}
