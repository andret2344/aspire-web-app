import {
	Box,
	CircularProgress,
	Collapse,
	Grid,
	IconButton,
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
} from '../Entity/WishlistItem';
import React from 'react';
import {PriorityBadge} from './PriorityBadge';
import {
	removeWishlistItem,
	updateWishlistItem
} from '../Services/WishlistItemService';
import {useSnackbar} from 'notistack';
import MarkdownView from 'react-showdown';
import {useTranslation} from 'react-i18next';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import {getAllPriorities, Priority} from '../Entity/Priority';
import {WishList} from '../Entity/WishList';
import {getThemeColor} from '../Utils/theme';
import {SystemStyleObject} from '@mui/system';

interface WishlistItemComponentProps {
	readonly item: WishlistItem;
	readonly wishlist: WishList;
	readonly position: number;
	readonly onEdit?: (item: WishlistItem) => void;
	readonly onWishlistEdit?: (wishlist: WishList) => void;
	readonly onRemove?: (wishlistId: number, itemId: number) => void;
}

export function WishlistItemComponent(
	props: WishlistItemComponentProps
): React.ReactElement {
	type ProgressField = (keyof WishlistItemDto)[];
	const [open, setOpen] = React.useState<boolean>(false);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const {enqueueSnackbar} = useSnackbar();
	const [circularProgress, setCircularProgress] =
		React.useState<ProgressField>([]);
	const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
		null
	);
	const {t} = useTranslation();
	const theme: Theme = useTheme();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));

	/* HANDLERS */

	function handleRowClick(): void {
		setOpen((prevOpen: boolean): boolean => !prevOpen);
	}

	function handleEditButton(event: React.MouseEvent): void {
		event.stopPropagation();
		return props.onEdit!(props.item);
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
		if (props.onWishlistEdit) {
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
		const priorityId: number = event.currentTarget.value;
		handleItemUpdate(props.item.id, 'priority_id', priorityId);
		handlePriorityChoiceClose();
	}

	function handleItemUpdate<K extends keyof WishlistItemDto>(
		itemId: number,
		field: K,
		newValue: WishlistItemDto[K]
	): void {
		addToCircularProgress(field);
		const wishlistItems: WishlistItem[] = props.wishlist.wishlistItems;
		const itemIndex: number = wishlistItems.findIndex(
			(i: WishlistItem): boolean => i.id === itemId
		);
		const item: WishlistItem = wishlistItems[itemIndex];
		const itemDto: WishlistItemDto = mapWishlistItemToDto(item, {
			[field]: newValue
		});
		updateWishlistItem(props.wishlist.id, itemDto)
			.then((): void => {
				props.wishlist.wishlistItems[itemIndex] =
					mapWishlistItemFromDto(itemDto);
				props.onWishlistEdit!(props.wishlist);
			})
			.finally((): void => removeFromCircularProgress(field));
	}

	function handleRemoveButton(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		handleMenuClose(event);
		removeWishlistItem(props.wishlist.id, props.item.id)
			.then((): void => {
				props.onRemove!(props.wishlist.id, props.item.id);
				enqueueSnackbar(t('item-removed'), {
					variant: 'success'
				});
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'})
			);
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
		if (!open) {
			return <KeyboardArrowDownIcon />;
		}
		return <KeyboardArrowUpIcon />;
	}

	function renderEditButton(): React.ReactElement {
		if (!props.onEdit) {
			return <></>;
		}
		return (
			<IconButton
				aria-label='edit'
				onClick={handleEditButton}
				data-testid={`edit-wishlist-item-${props.wishlist.id}-${props.item.id}`}
			>
				<EditIcon />
			</IconButton>
		);
	}

	function renderVisibilityGridItem(): React.ReactElement {
		if (!props.onWishlistEdit) {
			return <></>;
		}
		return (
			<Grid
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				{renderVisibilityIcon()}
			</Grid>
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
			<Grid
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				{renderPriorityChip()}
			</Grid>
		);
	}

	function renderPriorityChip(): React.ReactElement {
		if (circularProgress.includes('priority_id')) {
			return (
				<CircularProgress
					data-testid='progress-loading-priority'
					size={24}
				/>
			);
		}
		return (
			<PriorityBadge
				value={props.item.priorityId}
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

	function renderPriorityMenuItem(priority: Priority): React.ReactElement {
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

	function renderIcons(): React.ReactElement {
		if (!isMobile) {
			return (
				<>
					{renderPriorityGridItem()}
					{renderRemoveButtonGridItem()}
				</>
			);
		}
		return (
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
					<MenuItem onClick={handlePriorityChoiceOpen}>
						{renderPriorityChip()}
					</MenuItem>
					<MenuItem onClick={handleRemoveButton}>
						<DeleteForeverOutlined
							color='error'
							data-testid='menu-item-remove'
						/>
					</MenuItem>
				</Menu>
			</Grid>
		);
	}

	return (
		<Box
			data-testid='wishlist-item-row'
			sx={(theme: Theme): SystemStyleObject<Theme> => ({
				backgroundColor: getThemeColor(theme, 'activeBlue'),
				borderRadius: '12px',
				padding: '8px',
				margin: '16px'
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
				<Grid>
					<Typography
						color='#888888'
						variant='body2'
						padding='0.5rem'
					>
						<em>#{props.position}</em>
					</Typography>
				</Grid>
				<Grid>{renderEditButton()}</Grid>
				<Grid
					size='grow'
					sx={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					{props.item.name}
				</Grid>
				{renderVisibilityGridItem()}
				{renderIcons()}
			</Grid>
			<Collapse
				in={open}
				timeout='auto'
				unmountOnExit
			>
				<Box sx={{margin: 1}}>
					<Typography component='div'>
						<MarkdownView markdown={props.item.description} />
					</Typography>
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
				{getAllPriorities().map(renderPriorityMenuItem)}
			</Menu>
		</Box>
	);
}
