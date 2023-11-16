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

interface RowProps {
	readonly row: WishlistItem;
	readonly wishlistId?: number;
	readonly onEdit?: (item: WishlistItem) => void;
	readonly onRemove?: (id: number) => void;
}

const Row: React.FC<RowProps> = (props: RowProps): React.ReactElement => {
	const [open, setOpen] = React.useState<boolean>(false);
	const {enqueueSnackbar} = useSnackbar();

	const handleToggleExpandButton = (): void => {
		setOpen((prevOpen: boolean): boolean => !prevOpen);
	};

	const renderExpandButton = (): React.ReactElement => {
		if (open) {
			return <KeyboardArrowUpIcon />;
		}
		return <KeyboardArrowDownIcon />;
	};

	const handleRemoveWishlistItemButton = async (): Promise<void> => {
		if (props.wishlistId) {
			await removeWishlistItem(props.wishlistId, props.row.id)
				.then((): string | number =>
					enqueueSnackbar('Successfully removed wishlist item.', {
						variant: 'success'
					})
				)
				.catch((): string | number =>
					enqueueSnackbar('Something went wrong!', {variant: 'error'})
				);
			props.onRemove?.(props.wishlistId);
		}
	};

	return (
		<React.Fragment>
			<TableRow sx={{borderBottom: 'unset'}}>
				<TableCell>
					<IconButton
						aria-label='expand row'
						size='small'
						onClick={handleToggleExpandButton}
					>
						{renderExpandButton()}
					</IconButton>
				</TableCell>
				<TableCell align='left'>{props.row.id}</TableCell>
				<TableCell align='left'>{props.row.name}</TableCell>
				<TableCell align='center'>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<PriorityBadge priorityId={props.row.priorityId} />
					</Box>
				</TableCell>
				{props.onRemove && props.onEdit && (
					<TableCell>
						<Box sx={{display: 'flex', flexDirection: 'row'}}>
							<IconButton
								sx={{marginLeft: '15px'}}
								aria-label={'edit'}
								onClick={(): void => props.onEdit?.(props.row)}
							>
								<EditIcon fontSize={'large'} />
							</IconButton>
							<IconButton
								sx={{marginLeft: '15px', marginRight: '20px'}}
								aria-label={'delete'}
								onClick={handleRemoveWishlistItemButton}
							>
								<DeleteIcon fontSize={'large'} />
							</IconButton>
						</Box>
					</TableCell>
				)}
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
								{props.row.description}
							</Typography>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
};

export default Row;
