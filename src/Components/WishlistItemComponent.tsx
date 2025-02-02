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
import Linkify from 'linkify-react';
import parse from 'html-react-parser';
import {useTranslation} from 'react-i18next';

interface WishlistItemComponentProps {
	readonly item: WishlistItem;
	readonly wishlistId: number;
	readonly position: number;
	readonly onEdit: (item: WishlistItem) => void;
	readonly onRemove: (wishlistId: number, itemId: number) => void;
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
		if (open) {
			return <KeyboardArrowUpIcon />;
		}
		return <KeyboardArrowDownIcon />;
	}

	async function handleRemove(): Promise<void> {
		await removeWishlistItem(props.wishlistId, props.item.id)
			.then((): void => {
				props.onRemove(props.wishlistId, props.item.id);
				enqueueSnackbar(t('item-removed'), {
					variant: 'success'
				});
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'})
			);
	}

	return (
		<React.Fragment>
			<TableRow
				sx={{
					borderBottom: 'unset'
				}}
				style={{cursor: 'pointer'}}
				onClick={handleToggleExpandButton}
			>
				<TableCell>
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
				<TableCell>
					<Box sx={{display: 'flex', flexDirection: 'row'}}>
						<IconButton
							sx={{
								marginLeft: {
									xs: '0',
									md: '15px'
								}
							}}
							aria-label='edit'
							size='large'
							onClick={(): void => props.onEdit(props.item)}
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
						<IconButton
							sx={{
								margin: {
									xs: '0',
									md: '0 15px'
								}
							}}
							size='large'
							aria-label='delete'
							onClick={handleRemove}
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
								<Linkify
									options={{
										target: '_blank',
										rel: 'noopener noreferrer'
									}}
								>
									{parse(props.item.description)}
								</Linkify>
							</Typography>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}
