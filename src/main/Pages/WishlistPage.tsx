import {Grid, IconButton} from '@mui/material';
import React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {WishlistItemComponent} from '../Components/WishlistItemComponent';
import {mapWishlistFromDto, WishList} from '../Entity/WishList';
import {getWishlist} from '../Services/WishListService';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {WishlistItem} from '../Entity/WishlistItem';
import {EditItemModal} from '../Components/Modals/EditItemModal';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';

export function WishlistPage(): React.ReactElement {
	type Params = {readonly id?: string};
	const params: Params = useParams<Params>();
	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();
	const [wishlist, setWishlist] = React.useState<WishList | undefined>(
		undefined
	);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [addItemModalOpened, setAddItemModalOpened] =
		React.useState<boolean>(false);
	const [editingWishlistItem, setEditingWishlistItem] = React.useState<
		WishlistItem | undefined
	>(undefined);

	const {enqueueSnackbar} = useSnackbar();
	const wishlistId: number = +(params?.id ?? -1);

	React.useEffect((): void => {
		getWishlist(wishlistId)
			.then(mapWishlistFromDto)
			.then(setWishlist)
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'});
				navigate('/error');
			})
			.finally((): void => setLoading(false));
	}, []);

	if (loading) {
		return <></>;
	}

	function handleItemEdit(item: WishlistItem): void {
		setEditingWishlistItem(item);
		setAddItemModalOpened(true);
	}

	function openEditModal(): void {
		setEditingWishlistItem(undefined);
		setAddItemModalOpened(true);
	}

	function closeEditModal(): void {
		setAddItemModalOpened(false);
	}

	function handleItemRemove(itemId: number): void {
		if (!wishlist) {
			return;
		}
		const foundItem: number = wishlist.wishlistItems.findIndex(
			(item: WishlistItem): boolean => item.id === itemId
		);
		wishlist.wishlistItems.splice(foundItem, 1);
		setWishlist({...wishlist});
	}

	function handleEditAccept(item: WishlistItem): void {
		if (!wishlist) {
			return;
		}
		if (editingWishlistItem) {
			const foundItem: number = wishlist.wishlistItems.findIndex(
				(it: WishlistItem): boolean => it.id === editingWishlistItem.id
			);
			wishlist.wishlistItems[foundItem] = item;
		} else {
			wishlist.wishlistItems.push(item);
		}
		setWishlist({...wishlist});
	}

	function renderItems(): React.ReactNode[] {
		const activeWishlistItems: WishlistItem[] =
			wishlist?.wishlistItems ?? [];
		return activeWishlistItems.map(renderWishlistItem);
	}

	function renderWishlistItem(
		wishlistItem: WishlistItem,
		index: number
	): React.ReactElement {
		if (!wishlist) {
			return <></>;
		}
		return (
			<WishlistItemComponent
				key={wishlistItem.id}
				item={wishlistItem}
				position={index + 1}
				wishlist={wishlist}
				onEdit={handleItemEdit}
				onRemove={handleItemRemove}
				onWishlistEdit={(wishlist: WishList): void => {
					setWishlist({...wishlist});
				}}
			/>
		);
	}

	return (
		<>
			<Grid
				data-testid='wishlist-page-grid-main'
				sx={{
					paddingBottom: '50px',
					flexGrow: 1,
					height: '100vh',
					overflowY: 'auto',
					paddingTop: '56px',
					overflow: {xs: 'none', md: 'auto'},
					maxHeight: {xs: 'none', md: '100%'}
				}}
				container
			>
				{renderItems()}
				<Grid
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
						sx={{margin: '12px', padding: '12px'}}
					>
						<AddCircleOutlineIcon fontSize='large' />
					</IconButton>
				</Grid>
			</Grid>
			<EditItemModal
				key={editingWishlistItem?.id}
				wishlistId={wishlistId}
				wishlistPassword={wishlist?.hasPassword}
				opened={addItemModalOpened}
				onClose={closeEditModal}
				onAccept={handleEditAccept}
				item={editingWishlistItem}
			/>
		</>
	);
}
