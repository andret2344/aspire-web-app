import {
	Box,
	Button,
	Grid2,
	IconButton,
	Input,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	Typography,
	useTheme
} from '@mui/material';
import React, {useCallback} from 'react';
import '../../assets/fonts.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import {Row} from '../Components/Row';
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
import {isTokenValid} from '../Services/AuthService';
import {getWishlistHiddenItems} from '../Services/WishlistItemService';
import {useTranslation} from 'react-i18next';

export function WishlistListPage(): React.ReactElement {
	type Params = {readonly id?: string};
	const params: Params = useParams<Params>();
	const navigate = useNavigate();
	const {t} = useTranslation();
	const [wishlists, setWishlists] = React.useState<WishList[]>([]);
	const [activeWishlist, setActiveWishlist] = React.useState<WishList | null>(
		null
	);
	const [activeWishlistHiddenItems, setActiveWishlistHiddenItems] =
		React.useState<WishlistItem[]>([]);
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
	const theme: Theme = useTheme();

	function handleNameClick(): void {
		setEditedName(activeWishlist?.name ?? '');
	}

	function handleNameChange(
		event: React.ChangeEvent<HTMLInputElement>
	): void {
		setEditedName(event.target.value);
	}

	async function handleNameSubmit(): Promise<void> {
		if (editedName && activeWishlist) {
			const updatedWishlist = await updateWishlistName(
				activeWishlist.id,
				editedName
			);

			if (updatedWishlist) {
				if (activeWishlist) {
					setActiveWishlist({
						...activeWishlist,
						name: updatedWishlist.name
					});
				}
				await fetchAndSetWishlists().then((): void => {
					enqueueSnackbar('wishlist-renamed', {
						variant: 'success'
					});
				});
			}
		}
		setEditedName(undefined);
	}

	function openWishlistItemModalForEdit(item: WishlistItem): void {
		setEditingWishlistItem(item);
		setOpenAddWishlistItemModal(true);
	}

	function renderWishlistSidebarItems(): React.ReactElement[] {
		return wishlists?.map(
			(wishlist): React.ReactElement => (
				<WishlistSidebarItem
					key={wishlist.id}
					wishlist={wishlist}
					active={activeWishlist?.id === wishlist.id}
					onShare={addShareUrlToClipboard}
					onRemove={toggleWishlistConfirmationModal}
					onDisplay={(): React.ReactElement =>
						displayOrEditWishlistName(wishlist.name)
					}
					getWishlistHiddenItems={fetchAndSetWishlistHiddenItems}
				/>
			)
		);
	}

	function addNewWishlist(newWishlist: WishList): void {
		setWishlists((prevWishlists): WishList[] => [
			...prevWishlists,
			newWishlist
		]);
		enqueueSnackbar('Wishlist created.', {variant: 'success'});
	}

	async function handleRemoveWishlistButton(
		wishlist: WishList
	): Promise<void> {
		await removeWishlist(wishlist.id)
			.then((): void => {
				enqueueSnackbar(t('wishlist-removed'), {variant: 'success'});
			})
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'});
			});
		await fetchAndSetWishlists();
		setActiveWishlist(null);
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
				.then((data) =>
					setActiveWishlist({
						id: data.id,
						uuid: data.uuid,
						name: data.name,
						wishlistItems: [
							...data.wishlistItems,
							...activeWishlistHiddenItems
						],
						has_hidden_items: data.has_hidden_items
					})
				)
				.catch((): void | Promise<void> => navigate('/error'));
		},
		[navigate, activeWishlistHiddenItems]
	);
	const fetchAndSetWishlistHiddenItems = useCallback(
		async (id: number): Promise<void> => {
			await getWishlistHiddenItems(id)
				.then(setActiveWishlistHiddenItems)
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
			setActiveWishlist(null);
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
		return activeWishlist?.wishlistItems.map(
			(item: WishlistItem, index: number): React.ReactNode =>
				renderWishlistItem(item, index, activeWishlist)
		);
	}

	function displayOrEditWishlistName(name: string): React.ReactElement {
		if (editedName === undefined) {
			return (
				<Typography
					aria-label='wishlist-name'
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
					<IconButton
						size='small'
						sx={{marginLeft: '5px'}}
					>
						<EditIcon data-testid='edit-icon' />
					</IconButton>
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
					data-testid='ActiveWishlistEditNameInput'
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
					fontSize='medium'
					sx={{marginLeft: '10px'}}
				/>
			</Box>
		);
	}

	function addShareUrlToClipboard(): void {
		if (activeWishlist) {
			navigator.clipboard
				.writeText(
					`${getFrontendUrl()}/wishlist/${activeWishlist.uuid}`
				)
				.then((): string | number =>
					enqueueSnackbar(t('url-copied'), {variant: 'info'})
				)
				.catch((): string | number =>
					enqueueSnackbar(t('something-went-wrong'), {
						variant: 'error'
					})
				);
		}
	}

	return (
		<Header>
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
					{renderWishlistSidebarItems()}
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
						<WishlistConfirmationModal
							opened={openConfWishlistModal}
							toggleModal={toggleWishlistConfirmationModal}
							onRemove={(): Promise<void> =>
								handleRemoveWishlistButton(activeWishlist)
							}
							wishlistName={activeWishlist.name}
						/>
						<WishlistItemModal
							wishlistId={activeWishlist.id}
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
		</Header>
	);
}
