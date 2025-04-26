import {
	Box,
	Button,
	Checkbox,
	ClickAwayListener,
	FormControl,
	FormControlLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Theme,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import React, {RefObject} from 'react';
import {
	addWishlistItem,
	editWishlistItem
} from '../../Services/WishlistItemService';
import {getAllPriorities, Priority} from '../../Entity/Priority';
import {WishlistItem} from '../../Entity/WishlistItem';
import {useSnackbar} from 'notistack';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import {StringMap} from 'quill';
import {useTranslation} from 'react-i18next';
import {AspireModal} from './AspireModal';

interface EditItemModalProps {
	readonly wishlistId: number;
	readonly wishlistPassword?: boolean;
	readonly opened: boolean;
	readonly toggleModal: () => void;
	readonly onAccept: (wishlistId: number, item: WishlistItem) => void;
	readonly item?: WishlistItem;
}

export function EditItemModal(props: EditItemModalProps): React.ReactElement {
	const theme: Theme = useTheme();
	const isSmallerThan900: boolean = useMediaQuery(theme.breakpoints.up('md'));
	const [priority, setPriority] = React.useState<number>(1);
	const [hidden, setHidden] = React.useState<boolean>(
		props.item?.hidden || false
	);
	const [open, setOpen] = React.useState<boolean>(false);
	const [description, setDescription] = React.useState<string>(
		props.item?.description ?? ''
	);
	const {t} = useTranslation();
	const inputRefName: RefObject<HTMLInputElement> =
		React.useRef<HTMLInputElement>(null);
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
		if (props.item) {
			setPriority(props.item.priorityId);
			setHidden(props.item.hidden || false);
			if (inputRefName.current) {
				inputRefName.current.value = props.item.name;
			}

			setDescription(props.item.description);
		}
	}, [props.item]);

	function handleChangePriority(event: SelectChangeEvent<number>): void {
		setPriority(+event.target.value);
	}

	function handleChangeHidden(): void {
		setHidden((prev: boolean): boolean => !prev);
	}

	function handleTooltipClose() {
		setOpen(false);
	}

	function handleTooltipOpen() {
		setOpen(true);
	}

	function toggleModalAndClearFields(): void {
		props.toggleModal();
		setPriority(1);
		if (inputRefName.current) {
			inputRefName.current.value = '';
		}
		setDescription('');
		setHidden(true);
	}

	async function handleSubmit(): Promise<void> {
		const wishlistItemName: string = inputRefName.current!.value;
		if (!wishlistItemName) {
			return undefined;
		}
		if (props.item) {
			const updatedWishlistItem: WishlistItem | null =
				await editWishlistItem(
					props.wishlistId,
					props.item.id,
					wishlistItemName,
					description,
					priority,
					hidden
				);
			if (updatedWishlistItem) {
				props.onAccept(props.wishlistId, updatedWishlistItem);
				toggleModalAndClearFields();
			}
		} else {
			if (priority) {
				setPriority(1);
			}

			const newWishlistItem: WishlistItem | null = await addWishlistItem(
				props.wishlistId,
				wishlistItemName,
				description,
				priority,
				hidden
			);

			if (newWishlistItem) {
				props.onAccept(props.wishlistId, newWishlistItem);
				toggleModalAndClearFields();
				enqueueSnackbar(t('saved'), {variant: 'success'});
			} else {
				enqueueSnackbar(t('too-long'), {variant: 'error'});
			}
		}
	}

	function handleDisabledCheckboxClick(): void {
		if (props.wishlistPassword) {
			return;
		}
		return handleTooltipOpen();
	}

	function renderTooltip(): React.ReactElement {
		return (
			<Box>
				<ClickAwayListener onClickAway={handleTooltipClose}>
					<Tooltip
						title={t('hide-item-tooltip')}
						placement='right'
						slotProps={{
							popper: {
								disablePortal: false
							}
						}}
						open={open}
						disableFocusListener
						disableHoverListener
						disableTouchListener
					>
						<FormControlLabel
							onClick={handleDisabledCheckboxClick}
							control={
								<Checkbox
									defaultChecked={props.item?.hidden}
									disabled={!props.wishlistPassword}
									onClick={handleChangeHidden}
								/>
							}
							data-testid='tooltip-test'
							label={t('hide-wish')}
						/>
					</Tooltip>
				</ClickAwayListener>
			</Box>
		);
	}

	return (
		<AspireModal
			onClose={props.toggleModal}
			opened={props.opened}
			title={props.item?.description ? t('edit-item') : t('new-item')}
			onSubmit={handleSubmit}
			width='80%'
		>
			<TextField
				hiddenLabel
				variant='filled'
				placeholder={props.item?.name ?? t('enter-item')}
				defaultValue={props.item?.name ?? ''}
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
				{renderTooltip()}
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
						id='modal-title'
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
								height: isSmallerThan900 ? '250px' : '450px',
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
						data-testid='edit-item-modal-cancel'
						variant='contained'
						sx={{
							margin: '10px'
						}}
						onClick={toggleModalAndClearFields}
					>
						{t('cancel')}
					</Button>
					<Button
						data-testid='edit-item-modal-confirm'
						type='submit'
						variant='contained'
						sx={{
							margin: '10px'
						}}
					>
						{t('confirm')}
					</Button>
				</Box>
			</Box>
		</AspireModal>
	);
}
