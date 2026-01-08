import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Grid, Typography} from '@mui/material';
import {AddButton} from '@component/AddButton';
import {WishlistItemComponent} from '@component/WishlistItemComponent';
import {mapWishlistFromDto, WishList} from '@entity/WishList';
import {mapWishlistItemFromDto, mapWishlistItemToDto, WishlistItem, WishlistItemDto} from '@entity/WishlistItem';
import {getWishlist} from '@service/WishListService';
import {addWishlistItem} from '@service/WishlistItemService';

export function WishlistPage(): React.ReactElement {
	type Params = {
		readonly id?: string;
	};

	const [wishlist, setWishlist] = React.useState<WishList | undefined>(undefined);
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
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				});
				navigate('/error');
			})
			.finally((): void => setIsLoading(false));
	}, []);

	if (isLoading) {
		return <></>;
	}

	function handleItemRemove(itemId: number): void {
		const foundItem: number = wishlist!.items.findIndex((item: WishlistItem): boolean => item.id === itemId);
		wishlist!.items.splice(foundItem, 1);
		setWishlist({
			...wishlist!
		});
	}

	function renderItems(): React.ReactNode[] {
		const activeWishlistItems: WishlistItem[] = wishlist?.items ?? [];
		return activeWishlistItems.map(renderWishlistItem);
	}

	function renderWishlistItem(wishlistItem: WishlistItem, index: number): React.ReactElement {
		return (
			<WishlistItemComponent
				key={wishlistItem.id}
				item={wishlistItem}
				position={index + 1}
				wishlist={wishlist!}
				onRemove={handleItemRemove}
				onEdit={handleItemEdit}
				onDuplicate={handleItemDuplicate}
			/>
		);
	}

	function handleItemEdit(item: WishlistItem): void {
		const itemId: number = wishlist!.items.findIndex((i: WishlistItem): boolean => i.id === item.id) ?? -1;
		if (itemId === -1) {
			return;
		}
		wishlist!.items[itemId] = {
			...item
		};
		setWishlist({
			...wishlist!
		});
	}

	function handleItemDuplicate(item: WishlistItem): void {
		executeAddWishlistItem(mapWishlistItemToDto(item)).then();
	}

	async function executeAddWishlistItem(item: Omit<WishlistItemDto, 'id'>): Promise<void> {
		const wishlistItem: WishlistItemDto = await addWishlistItem(wishlistId, item);
		const mappedItem: WishlistItem = mapWishlistItemFromDto(wishlistItem);
		wishlist!.items.push(mappedItem);
		setWishlist({
			...wishlist!
		});
	}

	async function handleAddClick(): Promise<void> {
		await executeAddWishlistItem({
			name: t('unnamed'),
			description: t('default-description'),
			priority: Math.floor((Math.random() * 3) % 3) + 1,
			hidden: false
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
				<Typography
					component='div'
					variant='h3'
					sx={{
						padding: '10px 0'
					}}
					align='center'
				>
					{wishlist?.name}
				</Typography>
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
					<AddButton onClick={handleAddClick}>{t('add-new-item')}</AddButton>
				</Grid>
			</Grid>
		</Grid>
	);
}
