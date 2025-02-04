import {
	Box,
	Button,
	Grid2,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	useTheme
} from '@mui/material';
import React from 'react';
import '../../assets/fonts.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {WishlistItemComponent} from '../Components/WishlistItemComponent';
import {WishList} from '../Entity/WishList';
import {WishlistSidebarItem} from '../Components/WishlistSidebarItem';
import {getWishlists, removeWishlist} from '../Services/WishListService';
import {CreateWishlistModal} from '../Components/Modals/CreateWishlistModal';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {WishlistItem} from '../Entity/WishlistItem';
import {DeleteWishlistModal} from '../Components/Modals/DeleteWishlistModal';
import {EditItemModal} from '../Components/Modals/EditItemModal';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
import {useTokenValidation} from '../Hooks/useTokenValidation';

export function WishlistListPage(): React.ReactElement {
	type Params = {readonly id?: string};
	const params: Params = useParams<Params>();
	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [openAddWishlistModal, setOpenAddWishlistModal] =
		React.useState<boolean>(false);
	const [deleteModalOpened, setDeleteModalOpened] =
		React.useState<boolean>(false);
	const [addItemModalOpened, setAddItemModalOpened] =
		React.useState<boolean>(false);
	const [editingWishlistItem, setEditingWishlistItem] = React.useState<
		WishlistItem | undefined
	>(undefined);
	const {enqueueSnackbar} = useSnackbar();
	const theme: Theme = useTheme();
	const {tokenLoading, tokenValid} = useTokenValidation();
	const activeWishlistId: number = +(params?.id ?? -1);

	React.useEffect((): void => {
		if (tokenLoading || !tokenValid) {
			return;
		}
		getWishlists()
			.then(setWishlists)
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'});
				navigate('/error');
			});
	}, [tokenValid]);

	if (tokenLoading) {
		return <></>;
	}

	if (!tokenValid) {
		navigate('/');
		return <></>;
	}

	function findWishlistById(wishlistId: number): WishList | undefined {
		return wishlists.find(
			(wishlist: WishList): boolean => wishlistId === wishlist.id
		);
	}

	function findWishlistIndexById(wishlistId: number): number {
		return wishlists.findIndex(
			(wishlist: WishList): boolean => wishlistId === wishlist.id
		);
	}

	function handleNameEdit(wishlistId: number, newName: string): void {
		const number: number = findWishlistIndexById(wishlistId);
		wishlists[number] = {
			...wishlists[number],
			name: newName
		};
		setWishlists([...wishlists]);
	}

	function openWishlistItemModalForEdit(item: WishlistItem): void {
		setEditingWishlistItem(item);
		setAddItemModalOpened(true);
	}

	function renderWishlistSidebarItem(wishlist: WishList): React.ReactElement {
		return (
			<WishlistSidebarItem
				key={wishlist.id}
				wishlist={wishlist}
				active={activeWishlistId === wishlist.id}
				onRemove={handleDeleteClick}
				onNameEdit={(newName: string): void =>
					handleNameEdit(wishlist.id, newName)
				}
			/>
		);
	}

	function addNewWishlist(newWishlist: WishList): void {
		setWishlists((prevWishlists: WishList[]): WishList[] => [
			...prevWishlists,
			newWishlist
		]);
		toggleWishlistModal();
		navigate(`/wishlists/${newWishlist?.id}`);
		enqueueSnackbar(t('wishlist-created'), {variant: 'success'});
	}

	function handleWishlistRemove(wishlistId: number): void {
		removeWishlist(wishlistId)
			.then((): void => {
				enqueueSnackbar(t('wishlist-removed'), {variant: 'success'});
				setWishlists(
					wishlists.filter(
						(wishlist: WishList): boolean =>
							wishlistId !== wishlist.id
					)
				);
				navigate('/wishlists');
			})
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'});
			})
			.finally((): void => {
				setDeleteModalOpened(false);
			});
	}

	function toggleWishlistModal(): void {
		setOpenAddWishlistModal((prev: boolean): boolean => !prev);
	}

	function handleDeleteClick(): void {
		setDeleteModalOpened(true);
	}

	function handleDeleteCancel(): void {
		setDeleteModalOpened(false);
	}

	function toggleWishlistItemModal(): void {
		setEditingWishlistItem(undefined);
		setAddItemModalOpened((prev: boolean): boolean => !prev);
	}

	function handleItemRemove(wishlistId: number, itemId: number): void {
		const found: number = findWishlistIndexById(wishlistId);
		const foundItem: number = wishlists[found].wishlistItems.findIndex(
			(item: WishlistItem): boolean => item.id === itemId
		);
		wishlists[found].wishlistItems.splice(foundItem, 1);
		setWishlists([...wishlists]);
	}

	function renderWishlistItem(
		wishlistItem: WishlistItem,
		index: number
	): React.ReactElement {
		return (
			<WishlistItemComponent
				key={wishlistItem?.id}
				item={wishlistItem}
				position={index + 1}
				wishlistId={activeWishlistId}
				onEdit={openWishlistItemModalForEdit}
				onRemove={handleItemRemove}
			/>
		);
	}

	function renderItems(): React.ReactNode[] | undefined {
		return findWishlistById(activeWishlistId)?.wishlistItems.map(
			renderWishlistItem
		);
	}

	function handleEditAccept(wishlistId: number, item: WishlistItem): void {
		const found: number = wishlists.findIndex(
			(wishlist: WishList): boolean => wishlist.id === wishlistId
		);
		if (editingWishlistItem) {
			const foundItem: number = wishlists[found]?.wishlistItems.findIndex(
				(it: WishlistItem): boolean => it.id === editingWishlistItem.id
			);
			wishlists[found].wishlistItems[foundItem] = item;
		} else {
			wishlists[found].wishlistItems.push(item);
		}
		setWishlists([...wishlists]);
	}

	return (
		<>
			<Grid2
				sx={{
					paddingBottom: 'auto',
					flexGrow: 1,
					maxHeight: {
						xs: '100vh',
						md: 'none'
					},
					overflowY: {
						xs: 'auto',
						md: 'none'
					}
				}}
				container
			>
				<Grid2
					size={{xs: 12, md: 3}}
					overflow={{xs: 'none', md: 'auto'}}
					maxHeight={{xs: 'none', md: '100vh'}}
					style={{
						paddingBottom: '15px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center',
						borderRight: `2px solid ${theme.palette.divider}`
					}}
				>
					{wishlists.map(renderWishlistSidebarItem)}
					<Button
						data-testid='open-modal-button'
						onClick={toggleWishlistModal}
						variant='outlined'
						sx={{
							margin: '15px',
							marginBottom: {
								xs: '0px',
								md: '50px'
							}
						}}
						startIcon={<AddCircleOutlineIcon />}
					>
						{t('add-new-wishlist')}
					</Button>
				</Grid2>
				{activeWishlistId !== -1 && (
					<Grid2
						size={{xs: 12, md: 9}}
						overflow={{xs: 'none', md: 'auto'}}
						maxHeight={{xs: 'none', md: '100vh'}}
						paddingBottom='50px'
					>
						<TableContainer component={Paper}>
							<Table aria-label='collapsible table'>
								<TableHead>
									<TableRow>
										<TableCell
											width='5%'
											align='left'
										/>
										<TableCell align='left'>
											{t('item-no')}
										</TableCell>
										<TableCell align='left'>
											{t('name')}
										</TableCell>
										<TableCell
											width='10%'
											align='center'
										>
											{t('priority')}
										</TableCell>
										<TableCell
											width='10%'
											align='center'
										>
											{t('action')}
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>{renderItems()}</TableBody>
							</Table>
						</TableContainer>
						<Box
							aria-label='add item box'
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'flex-end',
								justifyContent: 'flex-end'
							}}
						>
							<IconButton
								aria-label='Add item'
								onClick={toggleWishlistItemModal}
								sx={{margin: '25px', padding: '25px'}}
							>
								<AddCircleOutlineIcon fontSize='large' />
							</IconButton>
						</Box>
						<DeleteWishlistModal
							opened={deleteModalOpened}
							onCancel={handleDeleteCancel}
							onRemove={(): void =>
								handleWishlistRemove(activeWishlistId)
							}
							wishlistName={
								findWishlistById(activeWishlistId)?.name ?? ''
							}
						/>
						<EditItemModal
							wishlistId={activeWishlistId}
							opened={addItemModalOpened}
							toggleModal={toggleWishlistItemModal}
							onAccept={handleEditAccept}
							item={editingWishlistItem}
						/>
					</Grid2>
				)}
			</Grid2>
			<CreateWishlistModal
				opened={openAddWishlistModal}
				onAddWishlist={addNewWishlist}
				onClose={toggleWishlistModal}
			/>
		</>
	);
}
