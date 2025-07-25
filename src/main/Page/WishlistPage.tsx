import {Grid} from '@mui/material';
import React from 'react';
import {WishlistItemComponent} from '../Component/WishlistItemComponent';
import {mapWishlistFromDto, WishList} from '../Entity/WishList';
import {getWishlist} from '../Service/WishListService';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {WishlistItem, mapWishlistItemFromDto} from '../Entity/WishlistItem';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
import {AddButton} from '../Component//AddButton';
import {addWishlistItem} from '../Service/WishlistItemService';

export function WishlistPage(): React.ReactElement {
	type Params = {readonly id?: string};

	const [wishlist, setWishlist] = React.useState<WishList | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

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

	function handleItemRemove(itemId: number): void {
		const foundItem: number = wishlist!.wishlistItems.findIndex(
			(item: WishlistItem): boolean => item.id === itemId
		);
		wishlist!.wishlistItems.splice(foundItem, 1);
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
				onRemove={handleItemRemove}
				onEdit={handleItemEdit}
			/>
		);

		function handleItemEdit(item: WishlistItem): void {
			const itemId: number =
				wishlist!.wishlistItems.findIndex(
					(i: WishlistItem): boolean => i.id === item.id
				) ?? -1;
			if (itemId === -1) {
				return;
			}
			wishlist!.wishlistItems[itemId] = {...item};
			setWishlist({...wishlist!});
		}
	}

	function handleAddClick(): void {
		addWishlistItem(wishlistId, {
			name: t('unnamed'),
			description: t('default-description'),
			priority_id: Math.floor((Math.random() * 3) % 3) + 1,
			hidden: false
		})
			.then(mapWishlistItemFromDto)
			.then((item: WishlistItem): void => {
				wishlist?.wishlistItems.push(item);
				setWishlist({...wishlist!});
			});
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
					<AddButton onClick={handleAddClick}>
						{t('add-new-item')}
					</AddButton>
				</Grid>
			</Grid>
		</Grid>
	);
}
