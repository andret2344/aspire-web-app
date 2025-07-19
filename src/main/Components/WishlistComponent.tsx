import React from 'react';
import {Box, Grid, IconButton, Input, Theme, Typography} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {getThemeColor} from '../Utils/theme';
import {WishList} from '../Entity/WishList';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {
	removeWishlist,
	setWishlistPassword,
	updateWishlistName
} from '../Services/WishListService';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
import {getApiConfig} from '../Services/ApiInstance';
import {WishlistSetupPasswordModal} from './Modals/WishlistSetupPasswordModal';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {DeleteWishlistModal} from './Modals/DeleteWishlistModal';

interface WishlistComponentProps {
	readonly wishlist: WishList;
	readonly onRemove: (wishlistId: number) => void;
	readonly onNameEdit: (newName: string) => void;
	readonly onPasswordChange: (newPassword: string) => void;
}

export function WishlistComponent(
	props: WishlistComponentProps
): React.ReactElement {
	const [deleteModalOpen, setDeleteModalOpen] =
		React.useState<boolean>(false);
	const [editedName, setEditedName] = React.useState<string | undefined>(
		undefined
	);
	const [passwordModalOpened, setPasswordModalOpened] =
		React.useState<boolean>(false);

	const navigate: NavigateFunction = useNavigate();
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();

	function handlePasswordModalClose(): void {
		setPasswordModalOpened(false);
	}

	function handlePasswordIconClick(event: React.MouseEvent): void {
		event.stopPropagation();
		setPasswordModalOpened(true);
	}

	function handleNameClick(event: React.MouseEvent): void {
		event.stopPropagation();
		setEditedName(props.wishlist.name);
	}

	function renderPasswordIcon(): React.ReactElement {
		if (!props.wishlist.hasPassword) {
			return <LockOpenOutlinedIcon data-testid='icon-lock-open' />;
		}
		return <LockOutlinedIcon data-testid='icon-lock' />;
	}

	function handleNameChange(
		event: React.ChangeEvent<HTMLInputElement>
	): void {
		setEditedName(event.target.value);
	}

	function handleNameSubmit(): void {
		setEditedName(undefined);
		if (!editedName || editedName === props.wishlist.name) {
			return;
		}
		updateWishlistName(props.wishlist.id, editedName)
			.then((): void => {
				props.onNameEdit(editedName);
				enqueueSnackbar(t('wishlist-renamed'), {
					variant: 'success'
				});
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				})
			);
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

	function renderName(): React.ReactElement {
		return editedName === undefined
			? renderTypographyName()
			: renderInputName();
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
			.finally((): void => setDeleteModalOpen(false));
	}

	function handleDeleteIconClick(event: React.MouseEvent): void {
		event.stopPropagation();
		setDeleteModalOpen(true);
	}

	function handleDeleteCancel(): void {
		setDeleteModalOpen(false);
	}

	function handlePasswordClear(): void {
		setWishlistPassword(props.wishlist.id, '')
			.then((): void => {
				enqueueSnackbar(t('password-cleared'), {variant: 'success'});
				props.onPasswordChange('');
				setPasswordModalOpened(false);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	function renderTypographyName(): React.ReactElement {
		return (
			<Typography>
				<IconButton
					size='small'
					onClick={handleNameClick}
					data-testid='wishlist-item-name-edit'
				>
					<EditIcon data-testid='edit-icon' />
				</IconButton>
				{props.wishlist.name}
			</Typography>
		);
	}

	function renderInputName(): React.ReactElement {
		return (
			<Box>
				<DoneIcon data-testid='wishlist-edit-done' />
				<Input
					data-testid='wishlist-edit-name-input'
					defaultValue={editedName}
					onChange={handleNameChange}
					onBlur={handleNameSubmit}
					autoFocus
				/>
			</Box>
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
				setPasswordModalOpened(false);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	function handleItemClick(): void {
		if (editedName === undefined) {
			navigate(`/wishlists/${props.wishlist.id}`);
		}
	}

	return (
		<Box
			data-testid='wishlist-row'
			sx={(theme: Theme): SystemStyleObject<Theme> => ({
				backgroundColor: getThemeColor(theme, 'activeBlue'),
				borderRadius: '12px',
				padding: '8px',
				margin: '16px'
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
					{renderName()}
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
				open={passwordModalOpened}
				onAccept={handlePasswordAccept}
				onClear={handlePasswordClear}
				onClose={handlePasswordModalClose}
			/>
			<DeleteWishlistModal
				opened={deleteModalOpen}
				onCancel={handleDeleteCancel}
				onRemove={handleWishlistRemove}
				wishlistName={props.wishlist.name}
			/>
		</Box>
	);
}
