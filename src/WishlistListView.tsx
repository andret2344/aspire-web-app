import {
	Box,
	Button,
	Container,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import React from 'react';
import '../assets/fonts.css';
import Grid from '@mui/material/Unstable_Grid2';
import { WishlistSidebarItem } from './WishlistSidebarItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ListItem } from './Entity/ListItem';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getThemeColor } from './theme';
import Row from './Row';

export const WishlistListView = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				padding: '0px',
			}}
		>
			<Container
				maxWidth={false}
				sx={{ backgroundColor: 'primary.main' }}
			>
				<Typography
					variant="h6"
					noWrap
					component="a"
					href="/"
					sx={{
						display: 'flex',
						fontFamily: 'Courgette',
						fontWeight: 700,
						fontSize: '35px',
						letterSpacing: '.3rem',
						color: 'white',
						textDecoration: 'none',
					}}
				>
					wishlist
				</Typography>
			</Container>
			<Grid
				sx={{ flexGrow: 1 }}
				disableEqualOverflow={true}
				container
				columnSpacing={2}
			>
				<Grid
					sx={(theme) => ({
						paddingBottom: '15px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center',
						borderRight: `2px solid ${theme.palette.divider}`,
					})}
					xs={12}
					md={3}
				>
					<WishlistSidebarItem />
					<WishlistSidebarItem />
					<WishlistSidebarItem />
					<WishlistSidebarItem />
					<Button
						variant={'outlined'}
						sx={{ margin: '15px' }}
						startIcon={<AddCircleOutlineIcon />}
					>
						Add new wishlist
					</Button>
				</Grid>
				<Grid xs={12} md={9}>
					<Box
						sx={(theme) => ({
							height: '60px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
							backgroundColor:
								theme.palette.mode === 'dark'
									? ''
									: getThemeColor(theme, 'lightBlue'),
							borderTop: '2px #FFFFFF',
						})}
					>
						<Typography sx={{ marginLeft: '50px' }}>
							Jan wishlist
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'row' }}>
							<IconButton
								sx={{ marginLeft: '15px' }}
								aria-label={'share'}
							>
								<ShareIcon fontSize={'large'} />
							</IconButton>
							<IconButton
								sx={{ marginLeft: '15px' }}
								aria-label={'share'}
							>
								<EditIcon fontSize={'large'} />
							</IconButton>
							<IconButton
								sx={{ marginLeft: '15px', marginRight: '20px' }}
								aria-label={'share'}
							>
								<DeleteIcon fontSize={'large'} />
							</IconButton>
						</Box>
					</Box>
					<TableContainer component={Paper}>
						<Table aria-label="collapsible table">
							<TableHead>
								<TableRow>
									<TableCell width={'5%'} align="left" />
									<TableCell align="left">Id</TableCell>
									<TableCell align="left">Name</TableCell>
									<TableCell width={'10%'} align="center">
										Priority
									</TableCell>
									<TableCell width={'10%'} align="center">
										Action
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<Row key={row.id} row={row} />
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		</Box>
	);
};

const rows: ListItem[] = [
	{
		id: 1,
		title: 'Papier toaletowy',
		description: 'KONIECZNIE',
		priorityId: 1,
	},
	{
		id: 2,
		title: 'Posciel',
		description: '220x200',
		priorityId: 2,
	},
	{
		id: 3,
		title: 'Wyjazd na mecz',
		description:
			'Musze sie jeszcze nad tym zastanowic, to bardzo duzy wydatek',
		priorityId: 3,
	},
];
