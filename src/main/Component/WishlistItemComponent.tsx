import {
	Box,
	Button,
	CircularProgress,
	Collapse,
	Grid,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Theme,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import {
	mapWishlistItemFromDto,
	mapWishlistItemToDto,
	WishlistItem,
	WishlistItemDto
} from '@entity/WishlistItem';
import React from 'react';
import {PriorityBadge} from './PriorityBadge';
import {
	removeWishlistItem,
	updateWishlistItem
} from '@service/WishlistItemService';
import {useSnackbar} from 'notistack';
import MarkdownView from 'react-showdown';
import {useTranslation} from 'react-i18next';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {getAllPriorities, getPriority, Priority} from '@entity/Priority';
import {WishList} from '@entity/WishList';
import {getThemeColor} from '@util/theme';
import {SystemStyleObject} from '@mui/system';
import {DescriptionModal} from './Modals/DescriptionModal';
import {EditableNameComponent} from './EditableNameComponent';
import {Condition} from '@util/Condition';

interface WishlistItemComponentProps {
	readonly item: WishlistItem;
	readonly wishlist: WishList;
	readonly position: number;
	readonly onEdit?: (item: WishlistItem) => void;
	readonly onRemove?: (itemId: number) => void;
	readonly onDuplicate?: (item: WishlistItem) => void;
}

export function WishlistItemComponent(
	props: WishlistItemComponentProps
): React.ReactElement {
	type ProgressField = (keyof WishlistItemDto)[];
	const [isOpened, setIsOpened] = React.useState<boolean>(false);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [circularProgress, setCircularProgress] =
		React.useState<ProgressField>([]);
	const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
		null
	);
	const [isDescriptionEdited, setIsDescriptionEdited] =
		React.useState<boolean>(false);

	const {enqueueSnackbar} = useSnackbar();

	const {t} = useTranslation();
	const theme: Theme = useTheme();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));

	/* HANDLERS */

	function handleRowClick(): void {
		setIsOpened((prevOpen: boolean): boolean => !prevOpen);
	}

	function handleVisibilityClick(event: React.MouseEvent): void {
		if (props.wishlist.hasPassword) {
			event.stopPropagation();
			handleItemUpdate(props.item.id, 'hidden', !props.item.hidden);
		}
	}

	function handlePriorityChoiceOpen(
		event: React.MouseEvent<HTMLElement>
	): void {
		if (props.onEdit) {
			event.stopPropagation();
			setAnchorEl(event.currentTarget);
		}
	}

	function handlePriorityChoiceClose(): void {
		setAnchorEl(null);
	}

	function handlePriorityChoice(
		event: React.MouseEvent<HTMLLIElement>
	): void {
		const priority: number = event.currentTarget.value;
		handleItemUpdate(props.item.id, 'priority', priority);
		handlePriorityChoiceClose();
	}

	async function handleNameChange(name: string): Promise<string> {
		const value: string = await handleItemUpdate(
			props.item.id,
			'name',
			name
		);
		enqueueSnackbar(t('item-updated'), {
			variant: 'success'
		});
		return value;
	}

	async function handleItemUpdate<K extends keyof WishlistItemDto>(
		itemId: number,
		field: K,
		newValue: WishlistItemDto[K]
	): Promise<WishlistItemDto[K]> {
		addToCircularProgress(field);
		const items: WishlistItem[] = props.wishlist.items;
		const itemIndex: number = items.findIndex(
			(i: WishlistItem): boolean => i.id === itemId
		);
		const item: WishlistItem = items[itemIndex];
		const itemDto: WishlistItemDto = mapWishlistItemToDto(item, {
			[field]: newValue
		});
		return updateWishlistItem(props.wishlist.id, itemDto)
			.then((): WishlistItemDto[K] => {
				props.onEdit!(mapWishlistItemFromDto(itemDto));
				return newValue;
			})
			.finally((): void => removeFromCircularProgress(field));
	}

	function handleRemoveButton(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		handleMenuClose(event);
		removeWishlistItem(props.wishlist.id, props.item.id)
			.then((): void => {
				props.onRemove!(props.item.id);
				enqueueSnackbar(t('item-removed'), {
					variant: 'success'
				});
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'})
			);
	}

	function handleAcceptModal(newDescription: string): void {
		handleItemUpdate(props.item.id, 'description', newDescription).then(
			(): void => handleCloseModal()
		);
	}

	function handleDuplicate(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		props.onDuplicate?.(props.item);
		setMenuAnchorEl(null);
	}

	function handleCloseModal(): void {
		setIsDescriptionEdited(false);
	}

	function handleModalOpen(): void {
		setIsDescriptionEdited(true);
	}

	/* MENU */

	function handleMenuOpen(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		setMenuAnchorEl(event.currentTarget);
	}

	function handleMenuClose(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		setMenuAnchorEl(null);
	}

	/* PROGRESS */

	function addToCircularProgress(field: keyof WishlistItemDto): void {
		setCircularProgress(
			(prev: ProgressField): ProgressField => [...prev, field]
		);
	}

	function removeFromCircularProgress(field: keyof WishlistItemDto): void {
		setCircularProgress(
			(prev: ProgressField): ProgressField =>
				prev.filter(
					(item: keyof WishlistItemDto): boolean => item !== field
				)
		);
	}

	/* RENDERING */

	function renderExpandIcon(): React.ReactElement {
		if (!isOpened) {
			return <KeyboardArrowDownIcon />;
		}
		return <KeyboardArrowUpIcon />;
	}

	function renderVisibilityGridItem(): React.ReactElement {
		return (
			<Condition check={!!props.onEdit}>
				<Grid
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					{renderVisibilityIcon()}
				</Grid>
			</Condition>
		);
	}

	function renderVisibilityIcon(): React.ReactElement {
		if (circularProgress.includes('hidden')) {
			return (
				<CircularProgress
					data-testid='progress-loading-hidden'
					size={24}
				/>
			);
		}
		if (props.item.hidden) {
			return (
				<IconButton
					onClick={handleVisibilityClick}
					data-testid='item-hidden-icon'
				>
					<VisibilityOffOutlinedIcon />
				</IconButton>
			);
		}
		return (
			<IconButton
				onClick={handleVisibilityClick}
				data-testid='item-visible-icon'
			>
				<VisibilityIcon />
			</IconButton>
		);
	}

	function renderPriorityGridItem(): React.ReactElement {
		return (
			<Condition check={!!props.onEdit}>
				<Grid
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					{renderPriorityChip()}
				</Grid>
			</Condition>
		);
	}

	function renderPriorityMenuItem(): React.ReactElement {
		const priority: Priority | undefined = getPriority(props.item.priority);
		return (
			<Condition check={!!props.onEdit}>
				<MenuItem onClick={handlePriorityChoiceOpen}>
					<ListItemIcon>{renderPriorityChip()}</ListItemIcon>
					<ListItemText>
						Priority:&nbsp;
						{t(priority?.descriptionKey ?? '')}
					</ListItemText>
				</MenuItem>
			</Condition>
		);
	}

	function renderSelectPriorityMenuItem(
		priority: Priority
	): React.ReactElement {
		return (
			<MenuItem
				onClick={handlePriorityChoice}
				key={priority.value}
				value={priority.value}
			>
				<PriorityBadge
					value={priority.value}
					data-testid={`priority-menu-item-${priority.value}`}
				/>
				&nbsp;-&nbsp;{t(priority.descriptionKey)}
			</MenuItem>
		);
	}

	function renderPriorityChip(): React.ReactElement {
		if (circularProgress.includes('priority')) {
			return (
				<CircularProgress
					data-testid='progress-loading-priority'
					size={24}
				/>
			);
		}
		return (
			<PriorityBadge
				value={props.item.priority}
				onClick={handlePriorityChoiceOpen}
			/>
		);
	}

	function renderRemoveButtonGridItem(): React.ReactElement {
		if (!props.onRemove) {
			return <></>;
		}
		return (
			<Grid
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<IconButton
					aria-label='delete'
					onClick={handleRemoveButton}
					data-testid={`remove-wishlist-item-${props.wishlist.id}-${props.item.id}`}
				>
					<DeleteForeverOutlined color='error' />
				</IconButton>
			</Grid>
		);
	}

	function renderRemoveButtonMenuItem(): React.ReactElement {
		return (
			<Condition check={!!props.onRemove}>
				<MenuItem onClick={handleRemoveButton}>
					<ListItemIcon>
						<DeleteForeverOutlined
							color='error'
							data-testid='menu-item-remove'
						/>
					</ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Condition>
		);
	}

	function renderDuplicateMenuItem(): React.ReactElement {
		return (
			<Condition check={!!props.onDuplicate}>
				<MenuItem onClick={handleDuplicate}>
					<ListItemIcon>
						<ContentCopyIcon data-testid='menu-item-duplicate' />
					</ListItemIcon>
					<ListItemText>{t('duplicate')}</ListItemText>
				</MenuItem>
			</Condition>
		);
	}

	function renderIcons(): React.ReactElement {
		return (
			<>
				{renderVisibilityGridItem()}
				<Condition check={!isMobile}>
					{renderPriorityGridItem()}
					{renderRemoveButtonGridItem()}
				</Condition>
				<Condition check={!!props.onEdit || !!props.onRemove}>
					<Grid>
						<IconButton
							onClick={handleMenuOpen}
							data-testid='wishlist-item-button-more'
						>
							<MoreHorizIcon />
						</IconButton>
						<Menu
							anchorEl={menuAnchorEl}
							open={Boolean(menuAnchorEl)}
							onClose={handleMenuClose}
						>
							{renderDuplicateMenuItem()}
							<Condition check={isMobile}>
								{renderPriorityMenuItem()}
								{renderRemoveButtonMenuItem()}
							</Condition>
						</Menu>
					</Grid>
				</Condition>
			</>
		);
	}

	return (
		<Box
			data-testid='wishlist-item-row'
			sx={(theme: Theme): SystemStyleObject<Theme> => ({
				backgroundColor: getThemeColor(theme, 'activeBlue'),
				borderRadius: '0.75rem',
				padding: '0.5rem',
				margin: '1rem'
			})}
		>
			<Grid
				alignItems='center'
				justifyContent='center'
				container
				spacing={1}
				data-testid={`wishlist-item-row-grid-${props.wishlist.id}-${props.item.id}`}
				sx={{
					borderBottom: 'unset',
					position: 'relative',
					cursor: 'pointer'
				}}
				onClick={handleRowClick}
			>
				<Grid>
					<IconButton aria-label='expand row'>
						{renderExpandIcon()}
					</IconButton>
				</Grid>
				<Grid
					size={{xs: 1, md: 0.5}}
					sx={{
						display: 'flex',
						justifyContent: 'flex-end'
					}}
				>
					<Typography
						color='#888888'
						variant='body2'
						padding='0.5rem'
					>
						<em>#{props.position}</em>
					</Typography>
				</Grid>
				<Grid
					size='grow'
					sx={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					<EditableNameComponent
						editable={props.onEdit !== undefined}
						name={props.item.name}
						onChange={handleNameChange}
					/>
				</Grid>
				{renderIcons()}
			</Grid>
			<Collapse
				in={isOpened}
				timeout='auto'
				unmountOnExit
			>
				<Box sx={{margin: '1rem'}}>
					<Typography component='div'>
						<MarkdownView markdown={props.item.description} />
					</Typography>
					<Condition check={props.onEdit !== undefined}>
						<Button
							data-testid={`component-wishlist-item-${props.item.id}-button-edit-description`}
							variant='contained'
							startIcon={<EditIcon />}
							onClick={handleModalOpen}
						>
							Edit
						</Button>
					</Condition>
				</Box>
			</Collapse>
			<Menu
				anchorEl={anchorEl}
				open={anchorEl !== null}
				onClose={handlePriorityChoiceClose}
				slotProps={{
					list: {
						'aria-labelledby': 'basic-button'
					}
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
			>
				{getAllPriorities().map(renderSelectPriorityMenuItem)}
			</Menu>
			<DescriptionModal
				open={isDescriptionEdited}
				loading={circularProgress.includes('description')}
				defaultDescription={props.item.description}
				onClose={handleCloseModal}
				onAccept={handleAcceptModal}
			/>
		</Box>
	);
}
