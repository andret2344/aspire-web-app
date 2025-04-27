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
import {
	mapWishlistItem,
	WishlistItem,
	WishlistItemDto
} from '../../Entity/WishlistItem';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import '@mdxeditor/editor/style.css';
import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CreateLink,
	headingsPlugin,
	InsertTable,
	InsertThematicBreak,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	ListsToggle,
	markdownShortcutPlugin,
	MDXEditor,
	MDXEditorMethods,
	quotePlugin,
	Separator,
	tablePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo
} from '@mdxeditor/editor';
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
	const [priority, setPriority] = React.useState<number>(
		props.item?.priorityId ?? 1
	);
	const [hidden, setHidden] = React.useState<boolean>(
		props.item?.hidden ?? false
	);
	const [open, setOpen] = React.useState<boolean>(false);
	const {t} = useTranslation();
	const nameInputRef: RefObject<HTMLInputElement> =
		React.useRef<HTMLInputElement>(null);
	const descriptionEditorRef: RefObject<MDXEditorMethods> =
		React.useRef<MDXEditorMethods>(null);
	const {enqueueSnackbar} = useSnackbar();

	React.useEffect((): void => {
		if (nameInputRef.current) {
			nameInputRef.current.value = props.item?.name ?? '';
		}
	}, [props.item]);

	function handleChangePriority(event: SelectChangeEvent<number>): void {
		setPriority(+event.target.value);
	}

	function handleChangeHidden(
		event: React.ChangeEvent<HTMLInputElement>
	): void {
		setHidden(event.target.checked);
	}

	function handleTooltipClose() {
		setOpen(false);
	}

	function handleTooltipOpen() {
		setOpen(true);
	}

	function toggleModalAndClearFields(): void {
		if (nameInputRef.current) {
			nameInputRef.current.value = '';
		}
		descriptionEditorRef.current?.setMarkdown('');
		props.toggleModal();
	}

	async function handleSubmit(): Promise<void> {
		const wishlistItemName: string | undefined =
			nameInputRef.current?.value;
		const wishlistItemDescription: string =
			descriptionEditorRef.current?.getMarkdown() ?? '';
		if (!wishlistItemName) {
			return undefined;
		}
		if (props.item) {
			const updatedWishlistItem: WishlistItemDto | null =
				await editWishlistItem(
					props.wishlistId,
					props.item.id,
					wishlistItemName,
					wishlistItemDescription,
					priority,
					hidden
				);
			if (updatedWishlistItem) {
				props.onAccept(
					props.wishlistId,
					mapWishlistItem(updatedWishlistItem)
				);
				toggleModalAndClearFields();
			}
		} else {
			if (priority) {
				setPriority(1);
			}

			const newWishlistItem: WishlistItemDto | null =
				await addWishlistItem(
					props.wishlistId,
					wishlistItemName,
					wishlistItemDescription,
					priority,
					hidden
				);

			if (newWishlistItem) {
				props.onAccept(
					props.wishlistId,
					mapWishlistItem(newWishlistItem)
				);
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
									onChange={handleChangeHidden}
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

	function renderToolbarContents(): React.ReactElement {
		return (
			<>
				{' '}
				<UndoRedo />
				<Separator />
				<BoldItalicUnderlineToggles />
				<Separator />
				<BlockTypeSelect />
				<Separator />
				<CreateLink />
				<InsertTable />
				<InsertThematicBreak />
				<Separator />
				<ListsToggle />
			</>
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
				inputRef={nameInputRef}
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
						data-testid='test-mdx'
					>
						<MDXEditor
							markdown={props.item?.description ?? ''}
							plugins={[
								headingsPlugin({
									allowedHeadingLevels: [1, 2, 3, 4, 5, 6]
								}),
								listsPlugin(),
								tablePlugin(),
								linkPlugin(),
								linkDialogPlugin(),
								quotePlugin(),
								markdownShortcutPlugin(),
								thematicBreakPlugin(),
								toolbarPlugin({
									toolbarClassName: 'my-classname',
									toolbarContents: renderToolbarContents
								})
							]}
							ref={descriptionEditorRef}
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
