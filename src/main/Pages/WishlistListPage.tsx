import {
	Box,
	Button,
	Grid,
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
import '../../../assets/fonts.css';
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
import {editWishlistItem} from '../Services/WishlistItemService';

export function WishlistListPage(): React.ReactElement {
	type Params = {readonly id?: string};
	const params: Params = useParams<Params>();
	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [hiddenItems, setHiddenItems] = React.useState<WishlistItem[]>([]);
	const [addWishlistModalOpened, setAddWishlistModalOpened] =
		React.useState<boolean>(false);
	const [deleteModalOpened, setDeleteModalOpened] =
		React.useState<boolean>(false);
	const [addItemModalOpened, setAddItemModalOpened] =
		React.useState<boolean>(false);
	const [editingWishlistItem, setEditingWishlistItem] = React.useState<
		WishlistItem | undefined
	>(undefined);
	const [loadingVisibilityItem, setLoadingVisibilityItem] =
		React.useState<number>(-1);
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
		setHiddenItems([]);
	}, [tokenValid, tokenLoading]);

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
		wishlists[number] = {...wishlists[number], name: newName};
		setWishlists([...wishlists]);
	}

	function handleItemEdit(item: WishlistItem): void {
		setEditingWishlistItem(item);
		setAddItemModalOpened(true);
	}

	function handlePasswordChange(
		wishlistId: number,
		newPassword: string
	): void {
		const index: number = findWishlistIndexById(wishlistId);
		wishlists[index] = {
			...wishlists[index],
			hasPassword: !!newPassword,
			wishlistItems: wishlists[index].wishlistItems.map(
				(element: WishlistItem): WishlistItem => ({
					...element,
					hidden: false
				})
			)
		};
		setWishlists([...wishlists]);
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
				onPasswordChange={(newPassword: string): void =>
					handlePasswordChange(wishlist.id, newPassword)
				}
			/>
		);
	}

	function renderSidebarItems(): React.ReactNode[] {
		return wishlists.map(renderWishlistSidebarItem);
	}

	function addNewWishlist(newWishlist: WishList): void {
		setWishlists((prevWishlists: WishList[]): WishList[] => [
			...prevWishlists,
			newWishlist
		]);
		toggleWishlistModal();
		navigate(`/wishlists/${newWishlist.id}`);
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
		setAddWishlistModalOpened((prev: boolean): boolean => !prev);
	}

	function handleDeleteClick(): void {
		setDeleteModalOpened(true);
	}

	function handleDeleteCancel(): void {
		setDeleteModalOpened(false);
	}

	function openEditModal(): void {
		setEditingWishlistItem(undefined);
		setAddItemModalOpened(true);
	}

	function closeEditModal(): void {
		setAddItemModalOpened(false);
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
				key={wishlistItem.id}
				item={wishlistItem}
				position={index + 1}
				wishlistId={activeWishlistId}
				canBeHidden={findWishlistById(activeWishlistId)?.hasPassword}
				loadingVisibility={loadingVisibilityItem === wishlistItem.id}
				onEdit={handleItemEdit}
				onVisibilityClick={handleVisibilityClick}
				onRemove={handleItemRemove}
			/>
		);
	}

	function handleVisibilityClick(itemId: number, changedTo: boolean): void {
		setLoadingVisibilityItem(itemId);
		const wishlistIndex: number = findWishlistIndexById(activeWishlistId);
		const wishlistItems: WishlistItem[] =
			wishlists[wishlistIndex].wishlistItems;
		const itemIndex: number = wishlistItems.findIndex(
			(i: WishlistItem): boolean => i.id === itemId
		);
		const item: WishlistItem = wishlistItems[itemIndex];
		editWishlistItem(
			activeWishlistId,
			item.id,
			item.name,
			item.description,
			item.priorityId,
			changedTo
		)
			.then((): void => {
				wishlists[wishlistIndex].wishlistItems[itemIndex] = {
					...item,
					hidden: changedTo
				};
				setWishlists([...wishlists]);
			})
			.finally((): void => setLoadingVisibilityItem(-1));
	}

	function renderItems(): React.ReactNode[] {
		const activeWishlistItems: WishlistItem[] =
			findWishlistById(activeWishlistId)?.wishlistItems ?? [];
		const items: WishlistItem[] = [
			...activeWishlistItems,
			...hiddenItems
		].map(
			(item: WishlistItem): WishlistItem =>
				item.wishlistId ? item : {...item, wishlistId: activeWishlistId}
		);
		return items.map(renderWishlistItem);
	}

	function handleEditAccept(wishlistId: number, item: WishlistItem): void {
		const found: number = wishlists.findIndex(
			(wishlist: WishList): boolean => wishlist.id === wishlistId
		);
		if (editingWishlistItem) {
			wishlists[found].wishlistItems.push(...hiddenItems);
			const foundItem: number = wishlists[found].wishlistItems.findIndex(
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
			<Grid
				sx={{
					paddingBottom: 'auto',
					flexGrow: 1,
					height: '100vh',
					overflowY: 'auto',
					paddingTop: '56px'
				}}
				container
			>
				<Grid
					size={{xs: 12, md: 3}}
					overflow={{xs: 'none', md: 'auto'}}
					height={{xs: 'none', md: '100%'}}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center',
						borderRight: `2px solid ${theme.palette.divider}`
					}}
				>
					{renderSidebarItems()}
					<Box sx={{padding: '15px'}}>
						<Button
							data-testid='open-modal-button'
							onClick={toggleWishlistModal}
							variant='outlined'
							sx={{
								margin: '15px'
							}}
							startIcon={<AddCircleOutlineIcon />}
						>
							{t('add-new-wishlist')}
						</Button>
					</Box>
				</Grid>
				{activeWishlistId !== -1 && (
					<Grid
						size={{xs: 12, md: 9}}
						overflow={{xs: 'none', md: 'auto'}}
						maxHeight={{xs: 'none', md: '100%'}}
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
										<TableCell
											align='left'
											width='5%'
										>
											{t('item-no')}
										</TableCell>
										<TableCell align='left'>
											{t('name')}
										</TableCell>
										<TableCell
											width='5%'
											align='center'
										>
											{t('visibility')}
										</TableCell>
										<TableCell
											width='5%'
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
								data-testid='add-item-button'
								aria-label='Add item'
								onClick={openEditModal}
								sx={{margin: '25px', padding: '25px'}}
							>
								<AddCircleOutlineIcon fontSize='large' />
							</IconButton>
						</Box>
					</Grid>
				)}
			</Grid>
			<CreateWishlistModal
				opened={addWishlistModalOpened}
				onAddWishlist={addNewWishlist}
				onClose={toggleWishlistModal}
			/>
			<EditItemModal
				key={editingWishlistItem?.id}
				wishlistId={activeWishlistId}
				wishlistPassword={
					findWishlistById(activeWishlistId)?.hasPassword
				}
				opened={addItemModalOpened}
				onClose={closeEditModal}
				onAccept={handleEditAccept}
				item={editingWishlistItem}
			/>
			<DeleteWishlistModal
				opened={deleteModalOpened}
				onCancel={handleDeleteCancel}
				onRemove={(): void => handleWishlistRemove(activeWishlistId)}
				wishlistName={findWishlistById(activeWishlistId)?.name ?? ''}
			/>
		</>
	);
}
