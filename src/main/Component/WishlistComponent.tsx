import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ShareIcon from '@mui/icons-material/Share';
import {Box, Grid, IconButton, Theme, Tooltip, Typography} from '@mui/material';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import {useUserData} from '@context/UserDataContext';
import {WishList} from '@entity/WishList';
import {getApiConfig} from '@service/ApiInstance';
import {removeWishlist, setWishlistPassword, updateWishlistName} from '@service/WishListService';
import {getThemeColor} from '@util/theme';
import {appPaths} from '../AppRoutes';
import {EditableNameComponent} from './EditableNameComponent';
import {DeleteWishlistModal} from './Modals/DeleteWishlistModal';
import {WishlistSetupPasswordModal} from './Modals/WishlistSetupPasswordModal';

interface WishlistComponentProps {
	readonly wishlist: WishList;
	readonly onRemove: (wishlistId: number) => void;
	readonly onNameEdit: (newName: string) => void;
	readonly onPasswordChange: (newPassword: string) => void;
}

export function WishlistComponent(props: WishlistComponentProps): React.ReactElement {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);
	const [isPasswordModalOpened, setIsPasswordModalOpened] = React.useState<boolean>(false);

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
		return (
			<Tooltip title={t('wishlist.set-wishlist-password')}>
				<KeyIcon data-testid='icon-key' />
			</Tooltip>
		);
	}

	function renderLockIcon(): React.ReactElement {
		if (props.wishlist.hasPassword) {
			return (
				<Tooltip title={t('wishlist.access-code-set')}>
					<LockIcon
						fontSize='small'
						data-testid='icon-lock'
					/>
				</Tooltip>
			);
		}
		return (
			<Tooltip title={t('wishlist.access-code-not-set')}>
				<LockOpenIcon
					data-testid='icon-lock-open'
					fontSize='small'
					color='disabled'
				/>
			</Tooltip>
		);
	}

	async function handleNameChange(name: string): Promise<string> {
		await updateWishlistName(props.wishlist.id, name);
		props.onNameEdit(name);
		enqueueSnackbar(t('wishlist.wishlist-renamed'), {
			variant: 'success'
		});
		return name;
	}

	function handleShareIconClick(event: React.MouseEvent): void {
		event.stopPropagation();
		navigator.clipboard
			.writeText(`${getApiConfig().frontend}/wishlist/${props.wishlist.uuid}`)
			.then((): string | number =>
				enqueueSnackbar(t('messages.url-copied'), {
					variant: 'info'
				})
			)
			.catch((): string | number =>
				enqueueSnackbar(t('messages.something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	function handleWishlistRemove(): void {
		removeWishlist(props.wishlist.id)
			.then((): void => {
				enqueueSnackbar(t('wishlist.wishlist-removed'), {
					variant: 'success'
				});
				props.onRemove(props.wishlist.id);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('messages.something-went-wrong'), {
					variant: 'error'
				})
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
				enqueueSnackbar(t('wishlist.access-code-cleared'), {
					variant: 'success'
				});
				props.onPasswordChange('');
				setIsPasswordModalOpened(false);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('messages.something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	async function handlePasswordAccept(id: number, password: string): Promise<void> {
		setWishlistPassword(id, password)
			.then((): void => {
				enqueueSnackbar(t('wishlist.access-code-changed'), {
					variant: 'success'
				});
				props.onPasswordChange(password);
				setIsPasswordModalOpened(false);
			})
			.catch((): string | number =>
				enqueueSnackbar(t('messages.something-went-wrong'), {
					variant: 'error'
				})
			);
	}

	function handleItemClick(): void {
		navigate(appPaths.wishlist.replace(':id', `${props.wishlist.id}`));
	}

	function disabledShareIconClickHandler(event: React.MouseEvent): void {
		event.stopPropagation();
	}

	function renderShareIcon(): React.ReactElement {
		if (user?.isVerified) {
			return <Tooltip title={t('wishlist.copy-wishlist-url')}>{renderShareIconButton(false)}</Tooltip>;
		}
		return (
			<Tooltip
				title={t('wishlist.share-disabled')}
				onClick={disabledShareIconClickHandler}
			>
				<span>{renderShareIconButton(true)}</span>
			</Tooltip>
		);
	}

	function renderShareIconButton(disabled: boolean): React.ReactElement {
		return (
			<IconButton
				data-testid={`share-icon-button-${props.wishlist.id}`}
				onClick={handleShareIconClick}
				size='large'
				aria-label='share'
				disabled={disabled}
			>
				<ShareIcon />
			</IconButton>
		);
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
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					{renderLockIcon()}
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
					{renderShareIcon()}
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
					<Tooltip title={t('common.delete')}>
						<IconButton
							onClick={handleDeleteIconClick}
							size='large'
							data-testid={`delete-wishlist-${props.wishlist.id}`}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
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
