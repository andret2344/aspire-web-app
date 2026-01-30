import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Grid} from '@mui/material';
import {AddButton} from '@component/AddButton';
import {CreateWishlistModal} from '@component/Modals/CreateWishlistModal';
import {WishlistComponent} from '@component/WishlistComponent';
import {mapWishlistArrayFromDto, WishList} from '@entity/WishList';
import {WishlistItem} from '@entity/WishlistItem';
import {getWishlists} from '@service/WishListService';
import {appPaths} from '../AppRoutes';

export function WishlistListPage(): React.ReactElement {
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [isAddWishlistModalOpened, setIsAddWishlistModalOpened] = React.useState<boolean>(false);

	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();
	const {enqueueSnackbar} = useSnackbar();

	React.useEffect((): void => {
		getWishlists()
			.then(mapWishlistArrayFromDto)
			.then(setWishlists)
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				});
				navigate(appPaths.error, {replace: true});
			})
			.finally((): void => setIsLoading(false));
	}, []);

	function findWishlistIndexById(wishlistId: number): number {
		return wishlists.findIndex((wishlist: WishList): boolean => wishlistId === wishlist.id);
	}

	function handleNameEdit(wishlistId: number, newName: string): void {
		const number: number = findWishlistIndexById(wishlistId);
		wishlists[number] = {
			...wishlists[number],
			name: newName
		};
		setWishlists([...wishlists]);
	}

	function handlePasswordChange(wishlistId: number, newPassword: string): void {
		const index: number = findWishlistIndexById(wishlistId);
		wishlists[index] = {
			...wishlists[index],
			hasPassword: !!newPassword,
			items: wishlists[index].items.map(
				(element: WishlistItem): WishlistItem => ({
					...element,
					hidden: false
				})
			)
		};
		setWishlists([...wishlists]);
	}

	function renderWishlistButtons(): React.ReactNode[] {
		return wishlists.map(renderWishlistButton);
	}

	function handleWishlistRemove(wishlistId: number): void {
		setWishlists((prev: WishList[]): WishList[] => prev.filter((w: WishList): boolean => w.id !== wishlistId));
	}

	function renderWishlistButton(wishlist: WishList): React.ReactElement {
		return (
			<WishlistComponent
				key={wishlist.id}
				wishlist={wishlist}
				onRemove={handleWishlistRemove}
				onNameEdit={(newName: string): void => handleNameEdit(wishlist.id, newName)}
				onPasswordChange={(newPassword: string): void => handlePasswordChange(wishlist.id, newPassword)}
			/>
		);
	}

	function addNewWishlist(newWishlist: WishList): void {
		setWishlists((prevWishlists: WishList[]): WishList[] => [...prevWishlists, newWishlist]);
		setIsAddWishlistModalOpened(false);
		enqueueSnackbar(t('wishlist-created'), {
			variant: 'success'
		});
	}

	if (isLoading) {
		return <></>;
	}

	function handleAddClick(): void {
		setIsAddWishlistModalOpened(true);
	}

	return (
		<Grid
			data-testid='wishlist-list-page-grid-main'
			sx={{
				flexGrow: 1,
				paddingTop: '3.5rem'
			}}
			container
		>
			<Grid
				sx={{
					width: '100%'
				}}
			>
				{renderWishlistButtons()}
				<Grid
					display='flex'
					justifyContent='center'
					alignItems='center'
					sx={{
						padding: '2rem',
						paddingBottom: '3rem'
					}}
				>
					<AddButton onClick={handleAddClick}>{t('add-new-wishlist')}</AddButton>
				</Grid>
			</Grid>
			<CreateWishlistModal
				open={isAddWishlistModalOpened}
				onAddWishlist={addNewWishlist}
				onClose={(): void => setIsAddWishlistModalOpened(false)}
			/>
		</Grid>
	);
}
