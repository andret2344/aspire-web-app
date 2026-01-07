import React from 'react';
import {Box, Grid, IconButton, Theme, Typography} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {getThemeColor} from '@util/theme';
import {WishList} from '@entity/WishList';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import {
	removeWishlist,
	setWishlistPassword,
	updateWishlistName
} from '@service/WishListService';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
import {getApiConfig} from '@service/ApiInstance';
import {WishlistSetupPasswordModal} from './Modals/WishlistSetupPasswordModal';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {DeleteWishlistModal} from './Modals/DeleteWishlistModal';
import {EditableNameComponent} from './EditableNameComponent';
import {useUserData} from '../Context/UserDataContext';

interface WishlistComponentProps {
	readonly wishlist: WishList;
	readonly onRemove: (wishlistId: number) => void;
	readonly onNameEdit: (newName: string) => void;
	readonly onPasswordChange: (newPassword: string) => void;
}

export function WishlistComponent(
	props: WishlistComponentProps
): React.ReactElement {
	const [isDeleteModalOpen, setIsDeleteModalOpen] =
		React.useState<boolean>(false);
	const [isPasswordModalOpened, setIsPasswordModalOpened] =
		React.useState<boolean>(false);

	const navigate: NavigateFunction = useNavigate();
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();
	const {user} = useUserData();

	function handlePasswordModalClose(): void {
		setIsPasswordModalOpened(false);
	}

	function handlePasswordIconClick(event: React.MouseEvent): void {
		event.stopPropagation();
		setIsPasswordModalOpened(true);
	}

	function renderPasswordIcon(): React.ReactElement {
		if (!props.wishlist.hasPassword) {
			return <LockOpenOutlinedIcon data-testid='icon-lock-open' />;
		}
		return <LockOutlinedIcon data-testid='icon-lock' />;
	}

	async function handleNameChange(name: string): Promise<string> {
		await updateWishlistName(props.wishlist.id, name);
		props.onNameEdit(name);
		enqueueSnackbar(t('wishlist-renamed'), {
			variant: 'success'
		});
		return name;
	}

	function handleShareIconClick(event: React.MouseEvent): void {
		event.stopPropagation();
		navigator.clipboard
			.writeText(
				`${getApiConfig().frontend}/wishlist/${props.wishlist.uuid}`
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

	function handleWishlistRemove(): void {
		removeWishlist(props.wishlist.id)
			.then((): void => {
				enqueueSnackbar(t('wishlist-removed'), {variant: 'success'});
				props.onRemove(props.wishlist.id);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'})
			)
			.finally((): void => setIsDeleteModalOpen(false));
	}

	function handleDeleteIconClick(event: React.MouseEvent): void {
		event.stopPropagation();
		setIsDeleteModalOpen(true);
	}

	function handleDeleteCancel(): void {
		setIsDeleteModalOpen(false);
	}

	function handlePasswordClear(): void {
		setWishlistPassword(props.wishlist.id, '')
			.then((): void => {
				enqueueSnackbar(t('password-cleared'), {variant: 'success'});
				props.onPasswordChange('');
				setIsPasswordModalOpened(false);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	async function handlePasswordAccept(
		id: number,
		password: string
	): Promise<void> {
		setWishlistPassword(id, password)
			.then((): void => {
				enqueueSnackbar(t('password-changed'), {
					variant: 'success'
				});
				props.onPasswordChange(password);
				setIsPasswordModalOpened(false);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	function handleItemClick(): void {
		navigate(`/wishlists/${props.wishlist.id}`, {replace: true});
	}

	return (
		<Box
			data-testid='wishlist-row'
			sx={(theme: Theme): SystemStyleObject<Theme> => ({
				backgroundColor: getThemeColor(theme, 'activeBlue'),
				borderRadius: '0.75rem',
				padding: '0.5rem',
				margin: '1rem'
			})}
		>
			<Grid
				alignItems='center'
				justifyContent='center'
				container
				spacing={1}
				data-testid={`wishlist-row-grid-${props.wishlist.id}`}
				sx={{
					borderBottom: 'unset',
					position: 'relative',
					cursor: 'pointer'
				}}
				onClick={handleItemClick}
			>
				<Grid>
					<Typography
						color='#888888'
						variant='body2'
						padding='0.5rem'
					>
						<em>#{props.wishlist.id}</em>
					</Typography>
				</Grid>
				<Grid
					size='grow'
					sx={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}
				>
					<EditableNameComponent
						editable
						name={props.wishlist.name}
						onChange={handleNameChange}
					/>
				</Grid>
				<Grid
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<IconButton
						data-testid={`share-icon-button-${props.wishlist.id}`}
						onClick={handleShareIconClick}
						size='large'
						aria-label='share'
						disabled={!user?.isVerified}
					>
						<ShareIcon />
					</IconButton>
				</Grid>
				<Grid
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<IconButton
						data-testid='hidden-items-icon-button'
						onClick={handlePasswordIconClick}
						size='large'
						aria-label='access-password-modal'
					>
						{renderPasswordIcon()}
					</IconButton>
				</Grid>
				<Grid
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<IconButton
						onClick={handleDeleteIconClick}
						size='large'
						data-testid={`delete-wishlist-${props.wishlist.id}`}
					>
						<DeleteIcon />
					</IconButton>
				</Grid>
			</Grid>
			<WishlistSetupPasswordModal
				wishlist={props.wishlist}
				open={isPasswordModalOpened}
				onAccept={handlePasswordAccept}
				onClear={handlePasswordClear}
				onClose={handlePasswordModalClose}
			/>
			<DeleteWishlistModal
				open={isDeleteModalOpen}
				onCancel={handleDeleteCancel}
				onRemove={handleWishlistRemove}
				wishlistName={props.wishlist.name}
			/>
		</Box>
	);
}
