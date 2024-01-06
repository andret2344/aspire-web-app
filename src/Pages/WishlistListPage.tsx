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
	Input,
	Typography
} from '@mui/material';
import React from 'react';
import '../../assets/fonts.css';
import Grid from '@mui/material/Unstable_Grid2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
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
import {WishlistConfirmationModal} from '../Components/WishlistConfirmationModal';
import {WishlistItemModal} from '../Components/WishlistItemModal';
import {Header} from '../Components/Header';
import {useSnackbar} from 'notistack';
import {getFrontendUrl} from '../Services/ApiInstance';

export const WishlistListPage: React.FC = (): React.ReactElement => {
	type Params = {id?: string};
	const params: Params = useParams<Params>();
	const navigate = useNavigate();
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [activeWishlist, setActiveWishlist] = React.useState<WishList | null>(
		null
	);
	const [openAddWishlistModal, setOpenAddWishlistModal] =
		React.useState<boolean>(false);
	const [openConfWishlistModal, setOpenConfWishlistModal] =
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
		setEditedName(activeWishlist?.name ?? '');
	};

	const handleNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		setEditedName(event.target.value);
	};

	const handleNameSubmit = async (): Promise<void> => {
		if (editedName) {
			const updatedWishlist = await updateWishlistName(
				activeWishlist?.id,
				editedName
			);

			if (updatedWishlist) {
				if (activeWishlist) {
					setActiveWishlist({
						...activeWishlist,
						name: updatedWishlist?.name
					});
				}
				await fetchAndSetWishlists().then((): void => {
					enqueueSnackbar('Wishlist name changed successfully.', {
						variant: 'success'
					});
				});
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
					active={activeWishlist?.id === wishlist.id}
					onShare={addShareUrlToClipboard}
					onRemove={toggleWishlistConfirmationModal}
					onDisplay={(): React.ReactElement =>
						displayOrEditWishlistName(wishlist.name)
					}
				/>
			);
		});
	};

	const addNewWishlist = (newWishlist: WishList): void => {
		setWishlists((prevWishlists): WishList[] => [
			...prevWishlists,
			newWishlist
		]);
		enqueueSnackbar('Wishlist created.', {variant: 'success'});
	};

	const handleRemoveWishlistButton = async (): Promise<void> => {
		await removeWishlist(activeWishlist?.id)
			.then((): void => {
				enqueueSnackbar('Wishlist removed successfully.', {
					variant: 'success'
				});
			})
			.catch((): void => {
				enqueueSnackbar('Something went wrong!', {variant: 'error'});
			});
		await fetchAndSetWishlists();
		setActiveWishlist(null);
		setOpenConfWishlistModal(false);
	};

	const toggleWishlistModal = (): void => {
		setOpenAddWishlistModal((prev): boolean => !prev);
	};

	const toggleWishlistConfirmationModal = (): void => {
		setOpenConfWishlistModal((prev): boolean => !prev);
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
				setActiveWishlist(wishlist);
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
						setActiveWishlist(wishlist);
					} else {
						navigate('/error');
					}
				})
				.catch((): void => {
					navigate('error');
				});
		} else {
			setActiveWishlist(null);
		}
	}, [params.id]);

	const renderWishlistItem = (
		wishlistItem: WishlistItem,
		index: number
	): React.ReactElement => (
		<Row
			key={wishlistItem?.id}
			row={wishlistItem}
			position={index + 1}
			wishlistId={activeWishlist?.id}
			onEdit={openWishlistItemModalForEdit}
			onRemove={fetchAndSetWishlist}
		/>
	);

	const displayOrEditWishlistName = (name: string): React.ReactElement => {
		if (editedName === undefined) {
			return (
				<Typography
					onClick={handleNameClick}
					sx={{
						textAlign: 'center',
						textDecoration: 'none',
						fontFamily: 'Montserrat',
						fontSize: '25px',
						fontWeight: 500
					}}
				>
					{name}
					<EditIcon
						fontSize={'medium'}
						sx={{marginLeft: '10px'}}
					/>
				</Typography>
			);
		}
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Input
					placeholder={editedName}
					onChange={handleNameChange}
					onBlur={handleNameSubmit}
					autoFocus
					sx={{
						textAlign: 'center',
						marginBottom: '10px',
						textDecoration: 'none',
						fontFamily: 'Montserrat',
						fontSize: '25px',
						fontWeight: 500
					}}
				/>
				<EditIcon
					fontSize={'medium'}
					sx={{marginLeft: '10px'}}
				/>
			</Box>
		);
	};

	const addShareUrlToClipboard = (): void => {
		if (!activeWishlist) {
			enqueueSnackbar('Something went wrong!', {variant: 'error'});
			return;
		}
		navigator.clipboard
			.writeText(`${getFrontendUrl()}/wishlist/${activeWishlist.uuid}`)
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
				{activeWishlist && (
					<Grid
						xs={12}
						md={9}
					>
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
										<TableCell align='left'>
											Item No.
										</TableCell>
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
									{activeWishlist?.wishlistItems?.map(
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
			<WishlistConfirmationModal
				opened={openConfWishlistModal}
				toggleModal={toggleWishlistConfirmationModal}
				onRemove={handleRemoveWishlistButton}
				wishlistName={activeWishlist?.name}
			/>
			<WishlistItemModal
				wishlistId={activeWishlist?.id}
				opened={openAddWishlistItemModal}
				toggleModal={toggleWishlistItemModal}
				getWishlistAgain={fetchAndSetWishlist}
				editingItem={editingWishlistItem}
			/>
		</Header>
	);
};
