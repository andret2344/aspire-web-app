import {
	Box,
	Collapse,
	IconButton,
	TableCell,
	TableRow,
	Typography
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {WishlistItem} from '../Entity/WishlistItem';
import React from 'react';
import {PriorityBadge} from './PriorityBadge';
import {removeWishlistItem} from '../Services/WishlistItemService';
import {useSnackbar} from 'notistack';
import MarkdownView from 'react-showdown';
import {useTranslation} from 'react-i18next';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

interface WishlistItemComponentProps {
	readonly item: WishlistItem;
	readonly wishlistId: number;
	readonly position: number;
	readonly onEdit?: (item: WishlistItem) => void;
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

	function renderVisiblityIcon(): React.ReactElement {
		if (!props.item.hidden) {
			return <></>;
		}
		return (
			<VisibilityOffOutlinedIcon
				sx={{
					position: 'absolute',
					top: '0',
					left: '0',
					margin: '0.3em'
				}}
			/>
		);
	}

	function renderEditButton(): React.ReactElement {
		if (!props.onEdit) {
			return <></>;
		}
		return (
			<IconButton
				sx={{
					marginLeft: {
						xs: '0',
						md: '15px'
					}
				}}
				aria-label='edit'
				size='large'
				onClick={handleEditButton}
				data-testid='edit-wishlist-item'
			>
				<EditIcon
					sx={{
						fontSize: {
							xs: '25px',
							md: '35px'
						}
					}}
				/>
			</IconButton>
		);
	}

	function renderRemoveButton(): React.ReactElement {
		if (!props.onRemove) {
			return <></>;
		}
		return (
			<IconButton
				sx={{
					margin: {
						xs: '0',
						md: '0 15px'
					}
				}}
				size='large'
				aria-label='delete'
				onClick={handleRemoveButton}
				data-testid='remove-wishlist-item'
			>
				<DeleteIcon
					sx={{
						fontSize: {
							xs: '25px',
							md: '35px'
						}
					}}
				/>
			</IconButton>
		);
	}

	async function handleRemoveButton(event: React.MouseEvent): Promise<void> {
		event.stopPropagation();
		await removeWishlistItem(props.wishlistId, props.item.id)
			.then((): void => {
				props.onRemove?.(props.wishlistId, props.item.id);
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
		return props.onEdit?.(props.item);
	}

	return (
		<React.Fragment>
			<TableRow
				data-testid='wishlist-item-row'
				sx={{
					borderBottom: 'unset',
					position: 'relative'
				}}
				style={{
					cursor: 'pointer'
				}}
				onClick={handleToggleExpandButton}
			>
				<TableCell>
					{renderVisiblityIcon()}
					<IconButton
						aria-label='expand row'
						size='small'
					>
						{renderExpandButton()}
					</IconButton>
				</TableCell>
				<TableCell align='left'>{props.position}</TableCell>
				<TableCell
					align='left'
					sx={{
						maxWidth: '150px',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					{props.item.name}
				</TableCell>
				<TableCell align='center'>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<PriorityBadge priorityId={props.item.priorityId} />
					</Box>
				</TableCell>
				<TableCell
					style={{
						display: `${props.onEdit || props.onRemove ? 'block' : 'none'}`
					}}
				>
					<Box sx={{display: 'flex', flexDirection: 'row'}}>
						{renderEditButton()}
						{renderRemoveButton()}
					</Box>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					style={{paddingBottom: 0, paddingTop: 0}}
					colSpan={6}
				>
					<Collapse
						in={open}
						timeout='auto'
						unmountOnExit
					>
						<Box sx={{margin: 1}}>
							<Typography component='div'>
								<MarkdownView
									markdown={props.item.description}
								/>
							</Typography>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}
