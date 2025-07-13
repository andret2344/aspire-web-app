import {
	Box,
	CircularProgress,
	Collapse,
	Grid,
	IconButton,
	Typography
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import {WishlistItem, WishlistItemDto} from '../Entity/WishlistItem';
import React from 'react';
import {PriorityBadge} from './PriorityBadge';
import {removeWishlistItem} from '../Services/WishlistItemService';
import {useSnackbar} from 'notistack';
import MarkdownView from 'react-showdown';
import {useTranslation} from 'react-i18next';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverOutlined from '@mui/icons-material/DeleteForeverOutlined';

interface WishlistItemComponentProps {
	readonly item: WishlistItem;
	readonly wishlistId: number;
	readonly canBeHidden?: boolean;
	readonly position: number;
	readonly onEdit?: (item: WishlistItem) => void;
	readonly onItemUpdate?: (
		itemId: number,
		update: Partial<WishlistItemDto>
	) => void;
	readonly loadingVisibility: boolean;
	readonly onRemove?: (wishlistId: number, itemId: number) => void;
}

export function WishlistItemComponent(
	props: WishlistItemComponentProps
): React.ReactElement {
	const [open, setOpen] = React.useState<boolean>(false);
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();

	function handleToggleExpandButton(): void {
		setOpen((prevOpen: boolean): boolean => !prevOpen);
	}

	function renderExpandButton(): React.ReactElement {
		if (!open) {
			return <KeyboardArrowDownIcon />;
		}
		return <KeyboardArrowUpIcon />;
	}

	function renderVisibilityIcon(): React.ReactElement {
		if (props.loadingVisibility) {
			return (
				<CircularProgress
					data-testid='item-loading-progress'
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

	function handleVisibilityClick(event: React.MouseEvent): void {
		if (props.canBeHidden) {
			event.stopPropagation();
			props.onItemUpdate!(props.item.id, {hidden: !props.item.hidden});
		}
	}

	function renderVisibilityIconCell(): React.ReactElement {
		if (!props.onItemUpdate) {
			return <></>;
		}
		return <Grid size={1}>{renderVisibilityIcon()}</Grid>;
	}

	function renderEditButton(): React.ReactElement {
		if (!props.onEdit) {
			return <></>;
		}
		return (
			<IconButton
				aria-label='edit'
				onClick={handleEditButton}
				data-testid={`edit-wishlist-item-${props.wishlistId}-${props.item.id}`}
			>
				<EditIcon />
			</IconButton>
		);
	}

	function renderRemoveButton(): React.ReactElement {
		if (!props.onRemove) {
			return <></>;
		}
		return (
			<Grid size={1}>
				<IconButton
					aria-label='delete'
					onClick={handleRemoveButton}
					data-testid={`remove-wishlist-item-${props.wishlistId}-${props.item.id}`}
				>
					<DeleteForeverOutlined color='error' />
				</IconButton>
			</Grid>
		);
	}

	async function handleRemoveButton(event: React.MouseEvent): Promise<void> {
		event.stopPropagation();
		await removeWishlistItem(props.wishlistId, props.item.id)
			.then((): void => {
				props.onRemove!(props.wishlistId, props.item.id);
				enqueueSnackbar(t('item-removed'), {
					variant: 'success'
				});
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'})
			);
	}

	function handleEditButton(event: React.MouseEvent): void {
		event.stopPropagation();
		return props.onEdit!(props.item);
	}

	return (
		<div
			data-testid='wishlist-item-row'
			style={{
				backgroundColor: 'darkblue',
				borderRadius: '12px',
				padding: '8px',
				margin: '16px'
			}}
		>
			<Grid
				columns={24}
				alignItems='center'
				justifyContent='center'
				direction='row'
				key={props.item.id}
				container
				spacing={1}
				data-testid='wishlist-item-row-grid'
				sx={{
					borderBottom: 'unset',
					position: 'relative'
				}}
				style={{
					cursor: 'pointer'
				}}
				onClick={handleToggleExpandButton}
			>
				<Grid>
					<IconButton aria-label='expand row'>
						{renderExpandButton()}
					</IconButton>
				</Grid>
				<Grid>
					<Typography
						color='#888888'
						variant='body2'
						padding='8px'
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
					{renderEditButton()}
					{props.item.name}
				</Grid>
				{renderVisibilityIconCell()}
				<Grid size={1}>
					<PriorityBadge priorityId={props.item.priorityId} />
				</Grid>
				{renderRemoveButton()}
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
		</div>
	);
}
