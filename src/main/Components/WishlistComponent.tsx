import React from 'react';
import {Box, IconButton, Input, Theme, Typography} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {getThemeColor} from '../Styles/theme';
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
	readonly active: boolean;
	readonly onRemove: (wishlistId: number) => void;
	readonly onNameEdit: (newName: string) => void;
	readonly onPasswordChange: (newPassword: string) => void;
}

export function WishlistComponent(
	props: WishlistComponentProps
): React.ReactElement {
	const [deleteModalOpen, setDeleteModalOpen] =
		React.useState<boolean>(false);

	const navigate: NavigateFunction = useNavigate();
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();

	const [editedName, setEditedName] = React.useState<string | undefined>(
		undefined
	);
	const [passwordModalOpened, setPasswordModalOpened] =
		React.useState<boolean>(false);

	function handlePasswordModalClose(): void {
		setPasswordModalOpened(false);
	}

	function handlePasswordModalOpen(): void {
		setPasswordModalOpened(true);
	}

	function handleNameClick(): void {
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

	function copyUrlToClipboard(): void {
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

	function handleDeleteClick(): void {
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
			<Typography
				aria-label='wishlist-name'
				data-testid='wishlist-name'
				onClick={handleNameClick}
				sx={{
					textAlign: 'center',
					textDecoration: 'none',
					fontFamily: 'Montserrat',
					fontSize: '25px',
					fontWeight: 500
				}}
			>
				{props.wishlist.name}
				<IconButton
					size='small'
					sx={{marginLeft: '5px'}}
				>
					<EditIcon data-testid='edit-icon' />
				</IconButton>
			</Typography>
		);
	}

	function renderInputName(): React.ReactElement {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Input
					data-testid='wishlist-edit-name-input'
					defaultValue={editedName}
					onChange={handleNameChange}
					onBlur={handleNameSubmit}
					autoFocus
					sx={{
						marginBottom: '10px',
						textDecoration: 'none',
						fontFamily: 'Montserrat',
						fontSize: '25px',
						fontWeight: 500
					}}
				/>
				<DoneIcon
					data-testid='wishlist-edit-done'
					fontSize='medium'
					sx={{marginLeft: '10px'}}
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
		navigate(`/wishlist/${props.wishlist.uuid}`);
	}

	return (
		<Box
			onClick={handleItemClick}
			sx={(theme: Theme): SystemStyleObject<Theme> => ({
				color: 'inherit',
				textDecoration: 'none',
				cursor: 'pointer',
				borderRadius: '10px',
				backgroundColor: getThemeColor(theme, 'activeBlue'),
				margin: '15px',
				padding: '10px',
				width: '90%',
				'&:hover': {
					backgroundColor: '#3f91de'
				}
			})}
		>
			{renderName()}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center'
				}}
			>
				<IconButton
					data-testid={`share-icon-button-${props.wishlist.id}`}
					onClick={copyUrlToClipboard}
					size='large'
					aria-label='share'
				>
					<ShareIcon />
				</IconButton>
				<IconButton
					data-testid='hidden-items-icon-button'
					onClick={handlePasswordModalOpen}
					size='large'
					aria-label='access-password-modal'
				>
					{renderPasswordIcon()}
				</IconButton>
				<IconButton
					onClick={handleDeleteClick}
					size='large'
					data-testid={`delete-wishlist-${props.wishlist.id}`}
					aria-label={`delete-wishlist-${props.wishlist.id}`}
				>
					<DeleteIcon />
				</IconButton>
			</Box>
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
				wishlistName={props.wishlist?.name ?? ''}
			/>
		</Box>
	);
}
