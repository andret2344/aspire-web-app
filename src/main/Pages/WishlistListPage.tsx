import {Button, Grid} from '@mui/material';
import React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {mapWishlistArrayFromDto, WishList} from '../Entity/WishList';
import {WishlistComponent} from '../Components/WishlistComponent';
import {getWishlists} from '../Services/WishListService';
import {CreateWishlistModal} from '../Components/Modals/CreateWishlistModal';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {WishlistItem} from '../Entity/WishlistItem';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';

export function WishlistListPage(): React.ReactElement {
	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [addWishlistModalOpened, setAddWishlistModalOpened] =
		React.useState<boolean>(false);

	const {enqueueSnackbar} = useSnackbar();

	React.useEffect((): void => {
		getWishlists()
			.then(mapWishlistArrayFromDto)
			.then(setWishlists)
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'});
				navigate('/error');
			})
			.finally((): void => setLoading(false));
	}, []);

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

	function renderWishlistButtons(): React.ReactNode[] {
		return wishlists.map(renderWishlistButton);
	}

	function handleWishlistRemove(wishlistId: number): void {
		setWishlists((prev: WishList[]): WishList[] =>
			prev.filter((w: WishList): boolean => w.id !== wishlistId)
		);
	}

	function renderWishlistButton(wishlist: WishList): React.ReactElement {
		return (
			<WishlistComponent
				key={wishlist.id}
				wishlist={wishlist}
				onRemove={handleWishlistRemove}
				onNameEdit={(newName: string): void =>
					handleNameEdit(wishlist.id, newName)
				}
				onPasswordChange={(newPassword: string): void =>
					handlePasswordChange(wishlist.id, newPassword)
				}
			/>
		);
	}

	function addNewWishlist(newWishlist: WishList): void {
		setWishlists((prevWishlists: WishList[]): WishList[] => [
			...prevWishlists,
			newWishlist
		]);
		setAddWishlistModalOpened(false);
		enqueueSnackbar(t('wishlist-created'), {variant: 'success'});
	}

	if (loading) {
		return <></>;
	}

	return (
		<Grid
			data-testid='wishlist-list-page-grid-main'
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
				sx={{
					width: '100%'
				}}
			>
				{renderWishlistButtons()}
				<Grid sx={{padding: '15px'}}>
					<Button
						data-testid='open-modal-button'
						onClick={(): void => setAddWishlistModalOpened(true)}
						variant='outlined'
						sx={{
							margin: '15px'
						}}
						startIcon={<AddCircleOutlineIcon />}
					>
						{t('add-new-wishlist')}
					</Button>
				</Grid>
			</Grid>
			<CreateWishlistModal
				opened={addWishlistModalOpened}
				onAddWishlist={addNewWishlist}
				onClose={(): void => setAddWishlistModalOpened(false)}
			/>
		</Grid>
	);
}
