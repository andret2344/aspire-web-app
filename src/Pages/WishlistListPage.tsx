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
import React, {useCallback} from 'react';
import '../../assets/fonts.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {Row} from '../Components/Row';
import {WishList} from '../Entity/WishList';
import {WishlistSidebarItem} from '../Components/WishlistSidebarItem';
import {
	getWishlist,
	getWishlists,
	removeWishlist
} from '../Services/WishListService';
import {WishlistModal} from '../Components/WishlistModal';
import {useNavigate, useParams} from 'react-router-dom';
import {WishlistItem} from '../Entity/WishlistItem';
import {DeleteWishlistConfirmationModal} from '../Components/DeleteWishlistConfirmationModal';
import {WishlistItemModal} from '../Components/WishlistItemModal';
import {useSnackbar} from 'notistack';
import {isTokenValid} from '../Services/AuthService';
import {useTranslation} from 'react-i18next';

export function WishlistListPage(): React.ReactElement {
	type Params = {readonly id?: string};
	const params: Params = useParams<Params>();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [activeWishlist, setActiveWishlist] = React.useState<number>(-1);
	const [openAddWishlistModal, setOpenAddWishlistModal] =
		React.useState<boolean>(false);
	const [openConfWishlistModal, setOpenConfWishlistModal] =
		React.useState<boolean>(false);
	const [openAddWishlistItemModal, setOpenAddWishlistItemModal] =
		React.useState<boolean>(false);
	const [editingWishlistItem, setEditingWishlistItem] = React.useState<
		WishlistItem | undefined
	>(undefined);
	const {enqueueSnackbar} = useSnackbar();
	const theme: Theme = useTheme();

	function handleNameEdit(wishlistId: number, newName: string): void {
		const number: number = wishlists.findIndex(
			(wishlist: WishList): boolean => wishlist.id === wishlistId
		);
		wishlists[number] = {
			...wishlists[number],
			name: newName
		};
		setWishlists([...wishlists]);
	}

	function openWishlistItemModalForEdit(item: WishlistItem): void {
		setEditingWishlistItem(item);
		setOpenAddWishlistItemModal(true);
	}

	function renderWishlistSidebarItem(wishlist: WishList): React.ReactElement {
		console.log('rendering', wishlist.name);
		return (
			<WishlistSidebarItem
				key={wishlist.id}
				wishlist={wishlist}
				active={activeWishlist === wishlist.id}
				onRemove={toggleWishlistConfirmationModal}
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
		enqueueSnackbar('Wishlist created.', {variant: 'success'});
	}

	async function handleRemoveWishlistButton(
		wishlistId: number
	): Promise<void> {
		await removeWishlist(wishlistId)
			.then((): void => {
				enqueueSnackbar(t('wishlist-removed'), {variant: 'success'});
			})
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'});
			});
		await fetchAndSetWishlists();
		setActiveWishlist(-1);
		setOpenConfWishlistModal(false);
	}

	function toggleWishlistModal(): void {
		setOpenAddWishlistModal((prev: boolean): boolean => !prev);
	}

	function toggleWishlistConfirmationModal(): void {
		setOpenConfWishlistModal((prev: boolean): boolean => !prev);
	}

	function toggleWishlistItemModal(): void {
		setEditingWishlistItem(undefined);
		setOpenAddWishlistItemModal((prev: boolean): boolean => !prev);
	}

	const fetchAndSetWishlist = useCallback(
		async (id: number): Promise<void> => {
			await getWishlist(id)
				.then((): void => setActiveWishlist(id))
				.catch((): void | Promise<void> => navigate('/error'));
		},
		[navigate]
	);

	async function fetchAndSetWishlists(): Promise<void> {
		await getWishlists().then(setWishlists);
	}

	React.useEffect((): void => {
		if (!isTokenValid()) {
			navigate('/');
			return;
		}
		fetchAndSetWishlists().catch((): string | number =>
			enqueueSnackbar(t('something-went-wrong'), {variant: 'error'})
		);

		if (params.id) {
			const paramId = parseInt(params.id);
			fetchAndSetWishlist(paramId).then();
		} else {
			setActiveWishlist(-1);
		}
	}, [params.id, enqueueSnackbar, fetchAndSetWishlist, navigate, t]);

	function renderWishlistItem(
		wishlistItem: WishlistItem,
		index: number,
		currentWishlist: WishList
	): React.ReactElement {
		return (
			<Row
				key={wishlistItem?.id}
				row={wishlistItem}
				position={index + 1}
				wishlistId={currentWishlist.id}
				onEdit={openWishlistItemModalForEdit}
				onRemove={fetchAndSetWishlist}
			/>
		);
	}

	function renderItems(): React.ReactNode[] | undefined {
		return wishlists[activeWishlist]?.wishlistItems.map(
			(item: WishlistItem, index: number): React.ReactNode =>
				renderWishlistItem(item, index, wishlists[activeWishlist])
		);
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
						data-testid='openModalButton'
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
				{activeWishlist && (
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
						<DeleteWishlistConfirmationModal
							opened={openConfWishlistModal}
							toggleModal={toggleWishlistConfirmationModal}
							onRemove={(): Promise<void> =>
								handleRemoveWishlistButton(activeWishlist)
							}
							wishlistName={wishlists[activeWishlist]?.name}
						/>
						<WishlistItemModal
							wishlistId={activeWishlist}
							opened={openAddWishlistItemModal}
							toggleModal={toggleWishlistItemModal}
							getWishlistAgain={fetchAndSetWishlist}
							editingItem={editingWishlistItem}
						/>
					</Grid2>
				)}
			</Grid2>
			<WishlistModal
				opened={openAddWishlistModal}
				toggleModal={toggleWishlistModal}
				addNewWishlist={addNewWishlist}
			/>
		</>
	);
}
