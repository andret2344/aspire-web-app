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
	updateWishlistItem
} from '@services/WishlistItemService';
import {getAllPriorities, Priority} from '@entity/Priority';
import {
	mapWishlistItemFromDto,
	WishlistItem,
	WishlistItemDto
} from '@entity/WishlistItem';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
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
import {useDarkMode} from '../DarkModeContext';

interface EditItemModalProps {
	readonly wishlistId: number;
	readonly wishlistPassword?: boolean;
	readonly open: boolean;
	readonly onClose: () => void;
	readonly onAccept: (item: WishlistItem) => void;
	readonly item?: WishlistItem;
}

export function EditItemModal(props: EditItemModalProps): React.ReactElement {
	const [priority, setPriority] = React.useState<number>(
		props.item?.priorityId ?? 1
	);
	const [hidden, setHidden] = React.useState<boolean>(
		props.item?.hidden ?? false
	);
	const [name, setName] = React.useState<string>(props.item?.name ?? '');
	const [isTooltipOpened, setIsTooltipOpened] =
		React.useState<boolean>(false);

	const descriptionEditorRef: RefObject<MDXEditorMethods | null> =
		React.useRef<MDXEditorMethods | null>(null);

	const theme: Theme = useTheme();
	const {darkMode} = useDarkMode();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));
	const {t} = useTranslation();
	const {enqueueSnackbar} = useSnackbar();

	function handleChangePriority(event: SelectChangeEvent<number>): void {
		setPriority(+event.target.value);
	}

	function handleChangeHidden(
		event: React.ChangeEvent<HTMLInputElement>
	): void {
		setHidden(event.target.checked);
	}

	function handleTooltipClose(): void {
		setIsTooltipOpened(false);
	}

	function handleTooltipOpen(): void {
		setIsTooltipOpened(true);
	}

	async function handleSubmit(
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> {
		event.preventDefault();
		const description: string =
			descriptionEditorRef.current?.getMarkdown() ?? '';
		if (props.item) {
			const updatedWishlistItem: WishlistItemDto | null =
				await updateWishlistItem(props.wishlistId, {
					id: props.item.id,
					name,
					description,
					priority_id: priority,
					hidden
				});
			if (updatedWishlistItem) {
				props.onAccept(mapWishlistItemFromDto(updatedWishlistItem));
				props.onClose();
			}
		} else {
			const newWishlistItem: WishlistItemDto | null =
				await addWishlistItem(props.wishlistId, {
					name,
					description,
					priority_id: priority,
					hidden
				});

			if (newWishlistItem) {
				props.onAccept(mapWishlistItemFromDto(newWishlistItem));
				props.onClose();
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

	function handleNameChange(
		event: React.ChangeEvent<HTMLInputElement>
	): void {
		setName(event.target.value);
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
						open={isTooltipOpened}
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
			onClose={props.onClose}
			open={props.open}
			title={props.item?.description ? t('edit-item') : t('new-item')}
			onSubmit={handleSubmit}
			width='80%'
		>
			<TextField
				hiddenLabel
				variant='filled'
				value={name}
				data-testid='edit-item-modal-input-name'
				onChange={handleNameChange}
				size={isMobile ? 'small' : 'medium'}
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
								data-testid={`priority-item-${priorityItem.value}`}
							>
								{`${priorityItem.value}\u00A0\u00A0 ${t(priorityItem.descriptionKey)}`}
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
							className={darkMode ? 'dark-theme' : ''}
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
						onClick={props.onClose}
					>
						{t('cancel')}
					</Button>
					<Button
						data-testid='edit-item-modal-confirm'
						type='submit'
						variant='contained'
						disabled={!name}
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
