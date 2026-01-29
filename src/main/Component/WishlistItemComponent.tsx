import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSnackbar} from 'notistack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
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
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import {SystemStyleObject} from '@mui/system';
import {getAllPriorities, getPriority, Priority} from '@entity/Priority';
import {WishList} from '@entity/WishList';
import {mapWishlistItemFromDto, mapWishlistItemToDto, WishlistItem, WishlistItemDto} from '@entity/WishlistItem';
import {removeWishlistItem, updateWishlistItem} from '@service/WishlistItemService';
import {Condition} from '@util/Condition';
import {getThemeColor} from '@util/theme';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, {defaultSchema} from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import {EditableNameComponent} from './EditableNameComponent';
import {DescriptionModal} from './Modals/DescriptionModal';
import {PriorityBadge} from './PriorityBadge';

interface WishlistItemComponentProps {
	readonly item: WishlistItem;
	readonly wishlist: WishList;
	readonly position: number;
	readonly onEdit?: (item: WishlistItem) => void;
	readonly onRemove?: (itemId: number) => void;
	readonly onDuplicate?: (item: WishlistItem) => void;
}

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	children?: React.ReactNode;
};

function MarkdownExternalLink({children, target, rel, ...props}: ExternalLinkProps): React.ReactElement {
	return (
		<a
			{...props}
			target={target ?? '_blank'}
			rel={rel ?? 'noopener noreferrer'}
		>
			{children}
		</a>
	);
}

export function WishlistItemComponent(props: WishlistItemComponentProps): React.ReactElement {
	const allowedTags: string[] = [...(defaultSchema.tagNames || []), 'u', 'sub', 'sup'];
	type ProgressField = (keyof WishlistItemDto)[];
	const [isOpened, setIsOpened] = React.useState<boolean>(false);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [circularProgress, setCircularProgress] = React.useState<ProgressField>([]);
	const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(null);
	const [isDescriptionEdited, setIsDescriptionEdited] = React.useState<boolean>(false);

	const {enqueueSnackbar} = useSnackbar();

	const {t} = useTranslation();
	const theme: Theme = useTheme();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down('md'));

	/* HANDLERS */

	function handleRowClick(): void {
		setIsOpened((prevOpen: boolean): boolean => !prevOpen);
	}

	function handleVisibilityClick(event: React.MouseEvent): void {
		event.stopPropagation();
		if (props.wishlist.hasPassword) {
			handleItemUpdate(props.item.id, 'hidden', !props.item.hidden);
		}
	}

	function handlePriorityChoiceOpen(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	}

	function handlePriorityChoiceClose(): void {
		setAnchorEl(null);
	}

	function handlePriorityChoice(event: React.MouseEvent<HTMLLIElement>): void {
		const priority: number = event.currentTarget.value;
		handleItemUpdate(props.item.id, 'priority', priority);
		handlePriorityChoiceClose();
	}

	async function handleNameChange(name: string): Promise<string> {
		const value: string = await handleItemUpdate(props.item.id, 'name', name);
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
		const itemIndex: number = items.findIndex((i: WishlistItem): boolean => i.id === itemId);
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
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	function handleAcceptModal(newDescription: string): void {
		handleItemUpdate(props.item.id, 'description', newDescription).then((): void => handleCloseModal());
	}

	function handleDuplicate(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
		props.onDuplicate!(props.item);
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
		setCircularProgress((prev: ProgressField): ProgressField => [...prev, field]);
	}

	function removeFromCircularProgress(field: keyof WishlistItemDto): void {
		setCircularProgress(
			(prev: ProgressField): ProgressField =>
				prev.filter((item: keyof WishlistItemDto): boolean => item !== field)
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
				<Tooltip title={t('unhide-item')}>
					<IconButton
						onClick={handleVisibilityClick}
						data-testid='item-hidden-icon'
					>
						<VisibilityOffOutlinedIcon />
					</IconButton>
				</Tooltip>
			);
		}
		return (
			<Tooltip title={t(props.wishlist.hasPassword ? 'hide-item' : 'set-wishlist-password-first')}>
				<IconButton
					onClick={handleVisibilityClick}
					data-testid='item-visible-icon'
				>
					<VisibilityIcon />
				</IconButton>
			</Tooltip>
		);
	}

	function renderPriorityGridItem(): React.ReactElement {
		return (
			<>
				<Condition check={!props.onEdit}>
					<PriorityBadge value={props.item.priority} />
				</Condition>
				<Condition check={!!props.onEdit}>
					<Grid
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						{renderPriorityChip()}
					</Grid>
				</Condition>
			</>
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

	function renderSelectPriorityMenuItem(priority: Priority): React.ReactElement {
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
					<IconButton aria-label='expand row'>{renderExpandIcon()}</IconButton>
				</Grid>
				<Grid
					size={{
						xs: 1,
						md: 0.5
					}}
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
				<Box
					sx={{
						margin: '1rem'
					}}
				>
					<Typography
						component='div'
						className='md-render'
					>
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeRaw, [rehypeSanitize, {tagNames: allowedTags}]]}
							components={{
								a: MarkdownExternalLink
							}}
						>
							{props.item.description}
						</ReactMarkdown>
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
