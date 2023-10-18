import {
	Box,
	Collapse,
	IconButton,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { WishlistItem } from './Entity/WishlistItem';
import React from 'react';
import { PriorityBadge } from './PriorityBadge';

interface RowProps {
	readonly row: WishlistItem;
}

const Row: React.FC<RowProps> = (props: RowProps) => {
	const [open, setOpen] = React.useState(false);

	const handleToggleExpandButton = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	function ExpandButton() {
		return open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />;
	}

	return (
		<React.Fragment>
			<TableRow sx={{ borderBottom: 'unset' }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={handleToggleExpandButton}
					>
						<ExpandButton />
					</IconButton>
				</TableCell>
				<TableCell align="left">{props.row.id}</TableCell>
				<TableCell align="left">{props.row.name}</TableCell>
				<TableCell align="center">
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<PriorityBadge priorityId={3} />
					</Box>
				</TableCell>
				<TableCell>
					<Box sx={{ display: 'flex', flexDirection: 'row' }}>
						<IconButton
							sx={{ marginLeft: '15px' }}
							aria-label={'share'}
						>
							<ShareIcon fontSize={'large'} />
						</IconButton>
						<IconButton
							sx={{ marginLeft: '15px' }}
							aria-label={'edit'}
						>
							<EditIcon fontSize={'large'} />
						</IconButton>
						<IconButton
							sx={{ marginLeft: '15px', marginRight: '20px' }}
							aria-label={'delete'}
						>
							<DeleteIcon fontSize={'large'} />
						</IconButton>
					</Box>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={6}
				>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography component="div">
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
