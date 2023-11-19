import {
	Box,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography
} from '@mui/material';
import React from 'react';
import '../../assets/fonts.css';
import Grid from '@mui/material/Unstable_Grid2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import {getThemeColor} from '../Styles/theme';
import Row from '../Components/Row';
import {WishList} from '../Entity/WishList';
import {WishlistSidebarItem} from '../Components/WishlistSidebarItem';
import {
	getWishlist,
	getWishlists,
	removeWishlist,
	updateWishlistName
} from '../Services/WishListService';
import {WishlistModal} from '../Components/WishlistModal';
import {useNavigate, useParams} from 'react-router-dom';
import {WishlistItem} from '../Entity/WishlistItem';
import {WishlistItemModal} from '../Components/WishlistItemModal';
import {Header} from '../Components/Header';
import {useSnackbar} from 'notistack';

export const WishlistListPage: React.FC = (): React.ReactElement => {
	type Params = {id?: string};
	const params: Params = useParams<Params>();
	const navigate = useNavigate();
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [wishlist, setWishlist] = React.useState<WishList | null>(null);
	const [openAddWishlistModal, setOpenAddWishlistModal] =
		React.useState<boolean>(false);
	const [openAddWishlistItemModal, setOpenAddWishlistItemModal] =
		React.useState<boolean>(false);
	const [editedName, setEditedName] = React.useState<string | undefined>(
		undefined
	);
	const [editingWishlistItem, setEditingWishlistItem] = React.useState<
		WishlistItem | undefined
	>(undefined);
	const {enqueueSnackbar} = useSnackbar();

	const handleNameClick = (): void => {
		setEditedName(wishlist?.name ?? '');
	};

	const handleNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		setEditedName(event.target.value);
	};

	const handleNameSubmit = async (): Promise<void> => {
		if (editedName) {
			const updatedWishlist = await updateWishlistName(
				wishlist?.id,
				editedName
			);

			if (updatedWishlist) {
				if (wishlist) {
					setWishlist({...wishlist, name: updatedWishlist?.name});
				}
				await fetchAndSetWishlists();
			}
		}
		setEditedName(undefined);
	};

	const openWishlistItemModalForEdit = (item: WishlistItem): void => {
		setEditingWishlistItem(item);
		setOpenAddWishlistItemModal(true);
	};

	const renderWishlistSidebarItems = (): React.ReactElement[] => {
		return wishlists?.map((wishlist): React.ReactElement => {
			return (
				<WishlistSidebarItem
					key={wishlist.id}
					wishlist={wishlist}
				/>
			);
		});
	};

	const addNewWishlist = (newWishlist: WishList): void => {
		setWishlists((prevWishlists): WishList[] => [
			...prevWishlists,
			newWishlist
		]);
	};

	const handleRemoveWishlistButton = async (): Promise<void> => {
		await removeWishlist(wishlist?.id);
		await fetchAndSetWishlists();
		setWishlist(null);
	};

	const toggleWishlistModal = (): void => {
		setOpenAddWishlistModal((prev): boolean => !prev);
	};

	const toggleWishlistItemModal = (): void => {
		setEditingWishlistItem(undefined);
		setOpenAddWishlistItemModal((prev): boolean => !prev);
	};

	const fetchWishlists = async (): Promise<WishList[]> => {
		return await getWishlists();
	};

	const fetchSelectedWishlist = async (
		id: number
	): Promise<WishList | null> => {
		return await getWishlist(id);
	};

	const fetchAndSetWishlist = async (id: number): Promise<void> => {
		await getWishlist(id).then((wishlist): void => {
			if (wishlist) {
				setWishlist(wishlist);
			} else {
				navigate('/error');
			}
		});
	};

	const fetchAndSetWishlists = async (): Promise<void> => {
		await fetchWishlists().then(setWishlists);
	};

	React.useEffect((): void => {
		fetchAndSetWishlists();

		if (params.id) {
			const paramId = parseInt(params.id);
			fetchSelectedWishlist(paramId)
				.then((wishlist): void => {
					if (wishlist) {
						setWishlist(wishlist);
					} else {
						navigate('/error');
					}
				})
				.catch((): void => {
					navigate('error');
				});
		} else {
			setWishlist(null);
		}
	}, [params.id]);

	const renderWishlistItem = (
		wishlistItem: WishlistItem
	): React.ReactElement => (
		<Row
			key={wishlistItem?.id}
			row={wishlistItem}
			wishlistId={wishlist?.id}
			onEdit={openWishlistItemModalForEdit}
			onRemove={fetchAndSetWishlist}
		/>
	);

	const displayOrEditWishlistName = (): React.ReactElement => {
		if (editedName === undefined) {
			return (
				<Typography
					onClick={handleNameClick}
					sx={{marginLeft: '50px'}}
				>
					{wishlist?.name}
				</Typography>
			);
		}
		return (
			<TextField
				value={editedName}
				onChange={handleNameChange}
				onBlur={handleNameSubmit}
				autoFocus
			/>
		);
	};

	const addShareUrlToClipboard = (): void => {
		navigator.clipboard
			.writeText(`${window.location.host}/wishlist/${wishlist?.uuid}`)
			.then((): string | number =>
				enqueueSnackbar('Share URL copied to clipboard.', {
					variant: 'info'
				})
			)
			.catch((): string | number =>
				enqueueSnackbar('Something went wrong!', {variant: 'error'})
			);
	};

	return (
		<Header>
			<Grid
				sx={{flexGrow: 1}}
				disableEqualOverflow={true}
				container
				columnSpacing={2}
			>
				<Grid
					sx={(
						theme
					): {
						paddingBottom: '15px';
						alignItems: 'center';
						flexDirection: 'column';
						borderRight: string;
						display: 'flex';
						justifyContent: 'flex-start';
						overflowY: 'auto';
						maxHeight: '100vh';
						'&::-webkit-scrollbar': {
							display: 'none';
						};
					} => ({
						paddingBottom: '15px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center',
						borderRight: `2px solid ${theme.palette.divider}`,
						overflowY: 'auto',
						maxHeight: '100vh',
						'&::-webkit-scrollbar': {
							display: 'none'
						}
					})}
					xs={12}
					md={3}
				>
					{renderWishlistSidebarItems()}
					<Button
						onClick={toggleWishlistModal}
						variant={'outlined'}
						sx={{
							margin: '15px',
							marginBottom: '150px'
						}}
						startIcon={<AddCircleOutlineIcon />}
					>
						Add new wishlist
					</Button>
				</Grid>
				{wishlist && (
					<Grid
						xs={12}
						md={9}
					>
						<Box
							sx={(
								theme
							): {
								backgroundColor: string | undefined;
								alignItems: 'center';
								display: 'flex';
								width: '100%';
								borderTop: '2px #FFFFFF';
								paddingLeft: '10px';
								justifyContent: 'space-between';
								height: '60px';
							} => ({
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
								paddingLeft: '10px'
							})}
						>
							{displayOrEditWishlistName()}
							<Box sx={{display: 'flex', flexDirection: 'row'}}>
								<IconButton
									onClick={addShareUrlToClipboard}
									sx={{marginLeft: '15px'}}
									aria-label={'share'}
								>
									<ShareIcon fontSize={'large'} />
								</IconButton>
								<IconButton
									onClick={handleRemoveWishlistButton}
									sx={{
										marginLeft: '15px',
										marginRight: '20px'
									}}
									aria-label={'delete'}
								>
									<DeleteIcon fontSize={'large'} />
								</IconButton>
							</Box>
						</Box>
						<TableContainer
							sx={{
								maxHeight: '75vh',
								overflowY: 'auto'
							}}
							component={Paper}
						>
							<Table aria-label='collapsible table'>
								<TableHead>
									<TableRow>
										<TableCell
											width={'5%'}
											align='left'
										/>
										<TableCell align='left'>Id</TableCell>
										<TableCell align='left'>Name</TableCell>
										<TableCell
											width={'10%'}
											align='center'
										>
											Priority
										</TableCell>
										<TableCell
											width={'10%'}
											align='center'
										>
											Action
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{wishlist?.wishlistItems?.map(
										renderWishlistItem
									)}
								</TableBody>
							</Table>
						</TableContainer>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'flex-end',
								justifyContent: 'flex-end'
							}}
						>
							<IconButton
								onClick={toggleWishlistItemModal}
								sx={{
									margin: '25px'
								}}
							>
								<AddCircleOutlineIcon fontSize={'large'} />
							</IconButton>
						</Box>
					</Grid>
				)}
			</Grid>
			<WishlistModal
				opened={openAddWishlistModal}
				toggleModal={toggleWishlistModal}
				addNewWishlist={addNewWishlist}
			/>
			<WishlistItemModal
				wishlistId={wishlist?.id}
				opened={openAddWishlistItemModal}
				toggleModal={toggleWishlistItemModal}
				getWishlistAgain={fetchAndSetWishlist}
				editingItem={editingWishlistItem}
			/>
		</Header>
	);
};
