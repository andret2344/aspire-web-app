import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {enqueueSnackbar} from 'notistack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Box, Grid, IconButton, Theme} from '@mui/material';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import {WishlistInputPasswordModal} from '@component/Modals/WishlistInputPasswordModal';
import {WishlistItemComponent} from '@component/WishlistItemComponent';
import {mapWishlistFromDto, WishList} from '@entity/WishList';
import {WishlistItem} from '@entity/WishlistItem';
import {getReadonlyWishlistByUUID} from '@service/WishListService';
import {getWishlistHiddenItems} from '@service/WishlistItemService';
import {getThemeColor} from '@util/theme';
import {appPaths} from '../AppRoutes';

export function ReadonlyWishlistPage(): React.ReactElement {
	type Params = {
		readonly uuid: string;
	};

	const [wishlist, setWishlist] = React.useState<WishList | undefined>(undefined);
	const [hiddenItems, setHiddenItems] = React.useState<WishlistItem[] | undefined>(undefined);
	const [isPasswordModalOpened, setIsPasswordModalOpened] = React.useState<boolean>(false);

	const params: Params = useParams<Params>() as Params;
	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();

	React.useEffect((): void => {
		getReadonlyWishlistByUUID(params.uuid)
			.then(mapWishlistFromDto)
			.then(setWishlist)
			.catch((): void | Promise<void> => navigate(appPaths.error, {replace: true}));
	}, [params.uuid]);

	if (!wishlist) {
		return <></>;
	}

	function handlePasswordModalClose(): void {
		setIsPasswordModalOpened(false);
	}

	function handlePasswordModalOpen(): void {
		setIsPasswordModalOpened(true);
	}

	function renderPasswordButton(): React.ReactElement {
		if (!wishlist!.hasPassword) {
			return <></>;
		}
		return (
			<IconButton
				data-testid='hidden-items-icon-button'
				onClick={handlePasswordModalOpen}
				size='large'
				aria-label='access-password-modal'
			>
				<LockOutlinedIcon />
			</IconButton>
		);
	}

	async function handlePasswordEnter(uuid: string, password: string): Promise<void> {
		await getWishlistHiddenItems(uuid, password)
			.then(setHiddenItems)
			.catch((): void => {
				enqueueSnackbar(t('access-code-invalid'), {
					variant: 'error'
				});
			});
		setIsPasswordModalOpened(false);
	}

	function renderWishlistItem(wishlistItem: WishlistItem, index: number): React.ReactElement {
		return (
			<WishlistItemComponent
				wishlist={wishlist!}
				key={wishlistItem.id}
				item={wishlistItem}
				position={index + 1}
			/>
		);
	}

	function renderItems(): React.ReactNode[] {
		const activeWishlistItems: WishlistItem[] = wishlist!.items;
		const items: WishlistItem[] = [...activeWishlistItems, ...(hiddenItems ?? [])];
		return items.map(renderWishlistItem);
	}

	return (
		<Grid
			flexGrow={{
				sx: 1
			}}
			container
			columnSpacing={2}
			sx={{
				paddingTop: '3.5rem'
			}}
		>
			<Grid
				size={{
					xs: 12
				}}
			>
				<Box
					sx={(theme: Theme): SystemStyleObject<Theme> => ({
						height: '60px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						backgroundColor: getThemeColor(theme, 'lightBlue'),
						borderTop: '2px #FFFFFF',
						paddingLeft: '10px'
					})}
				>
					{wishlist.name}
					{renderPasswordButton()}
				</Box>
				{renderItems()}
			</Grid>
			<WishlistInputPasswordModal
				alreadyEntered={hiddenItems !== undefined}
				wishlist={wishlist}
				open={isPasswordModalOpened}
				onAccept={handlePasswordEnter}
				onClose={handlePasswordModalClose}
			/>
		</Grid>
	);
}
