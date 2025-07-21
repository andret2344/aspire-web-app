import {Grid} from '@mui/material';
import React from 'react';
import {WishlistItemComponent} from '../Components/WishlistItemComponent';
import {mapWishlistFromDto, WishList} from '../Entity/WishList';
import {getWishlist} from '../Services/WishListService';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {WishlistItem} from '../Entity/WishlistItem';
import {EditItemModal} from '../Components/Modals/EditItemModal';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
import {AddButton} from '../Components/AddButton';

export function WishlistPage(): React.ReactElement {
	type Params = {readonly id?: string};

	const [wishlist, setWishlist] = React.useState<WishList | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [isAddItemModalOpened, setIsAddItemModalOpened] =
		React.useState<boolean>(false);
	const [editingWishlistItem, setEditingWishlistItem] = React.useState<
		WishlistItem | undefined
	>(undefined);

	const params: Params = useParams<Params>();
	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();
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
			.finally((): void => setIsLoading(false));
	}, []);

	if (isLoading) {
		return <></>;
	}

	function handleItemEdit(item: WishlistItem): void {
		setEditingWishlistItem(item);
		setIsAddItemModalOpened(true);
	}

	function openAddClick(): void {
		setEditingWishlistItem(undefined);
		setIsAddItemModalOpened(true);
	}

	function closeEditModal(): void {
		setIsAddItemModalOpened(false);
	}

	function handleItemRemove(itemId: number): void {
		const foundItem: number = wishlist!.wishlistItems.findIndex(
			(item: WishlistItem): boolean => item.id === itemId
		);
		wishlist!.wishlistItems.splice(foundItem, 1);
		setWishlist({...wishlist!});
	}

	function handleEditAccept(item: WishlistItem): void {
		if (editingWishlistItem) {
			const foundItem: number = wishlist!.wishlistItems.findIndex(
				(it: WishlistItem): boolean => it.id === editingWishlistItem.id
			);
			wishlist!.wishlistItems[foundItem] = item;
		} else {
			wishlist!.wishlistItems.push(item);
		}
		setWishlist({...wishlist!});
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
		return (
			<WishlistItemComponent
				key={wishlistItem.id}
				item={wishlistItem}
				position={index + 1}
				wishlist={wishlist!}
				onEdit={handleItemEdit}
				onRemove={handleItemRemove}
				onWishlistEdit={(wishlist: WishList): void => {
					setWishlist({...wishlist});
				}}
			/>
		);
	}

	return (
		<Grid
			data-testid='wishlist-page-grid-main'
			sx={{
				paddingBottom: '50px',
				flexGrow: 1,
				height: '100vh',
				overflowY: 'auto',
				paddingTop: '56px'
			}}
			container
		>
			<Grid
				sx={{
					width: '100%'
				}}
			>
				{renderItems()}
				<Grid
					display='flex'
					justifyContent='center'
					alignItems='center'
					sx={{
						padding: '2rem',
						paddingBottom: '3rem'
					}}
				>
					<AddButton onClick={openAddClick}>
						{t('add-new-item')}
					</AddButton>
				</Grid>
			</Grid>
			<EditItemModal
				key={editingWishlistItem?.id}
				wishlistId={wishlistId}
				wishlistPassword={wishlist?.hasPassword}
				open={isAddItemModalOpened}
				onClose={closeEditModal}
				onAccept={handleEditAccept}
				item={editingWishlistItem}
			/>
		</Grid>
	);
}
