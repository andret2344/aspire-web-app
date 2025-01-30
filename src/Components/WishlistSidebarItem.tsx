import React from 'react';
import {Box, IconButton, Input, Link, Theme, Typography} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import {getThemeColor} from '../Styles/theme';
import {WishList} from '../Entity/WishList';
import {Link as Anchor} from 'react-router-dom';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {updateWishlistName} from '../Services/WishListService';
import {useSnackbar} from 'notistack';
import {useTranslation} from 'react-i18next';
import {getFrontendUrl} from '../Services/ApiInstance';

interface WishlistSidebarItemProps {
	readonly wishlist: WishList;
	readonly active: boolean;
	readonly onRemove: () => void;
	readonly onNameEdit: (newName: string) => void;
}

export function WishlistSidebarItem(
	props: WishlistSidebarItemProps
): React.ReactElement {
	const {enqueueSnackbar} = useSnackbar();
	const {t} = useTranslation();

	const [editedName, setEditedName] = React.useState<string | undefined>(
		undefined
	);

	function handleNameClick(): void {
		setEditedName(props.wishlist.name);
	}

	function handleNameChange(
		event: React.ChangeEvent<HTMLInputElement>
	): void {
		setEditedName(event.target.value);
	}

	async function handleNameSubmit(): Promise<void> {
		if (editedName) {
			try {
				await updateWishlistName(props.wishlist.id, editedName);
				props.onNameEdit(editedName);
				enqueueSnackbar(t('wishlist-renamed'), {
					variant: 'success'
				});
			} catch (err) {
				enqueueSnackbar(t('something-went-wrong'), {
					variant: 'error'
				});
			}
		}
		setEditedName(undefined);
	}

	function copyUrlToClipboard(): void {
		navigator.clipboard
			.writeText(`${getFrontendUrl()}/wishlist/${props.wishlist.uuid}`)
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
		return editedName ? renderInputName() : renderTypographyName();
	}

	function renderTypographyName(): React.ReactElement {
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
					fontSize='medium'
					sx={{marginLeft: '10px'}}
				/>
			</Box>
		);
	}

	if (props.active) {
		return (
			<Link
				sx={(theme: Theme): SystemStyleObject<Theme> => ({
					color: 'inherit',
					textDecoration: 'none',
					cursor: 'pointer',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '10px',
					backgroundColor: getThemeColor(theme, 'activeBlue'),
					marginTop: '15px',
					width: '80%',
					'&:hover': {
						backgroundColor: '#3f91de'
					}
				})}
				component={Anchor}
				to={`/wishlists/${props.wishlist.id}`}
			>
				<Box
					sx={{
						padding: '10px'
					}}
				>
					{renderName()}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<IconButton
							data-testid={`shareIcon-${props.wishlist.id}`}
							onClick={copyUrlToClipboard}
							sx={{marginLeft: '15px'}}
							size='large'
							aria-label='share'
						>
							<ShareIcon />
						</IconButton>
						<IconButton
							onClick={props.onRemove}
							sx={{
								marginLeft: '15px',
								marginRight: '20px'
							}}
							size='large'
							aria-label={`delete-wishlist-${props.wishlist.id}`}
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				</Box>
			</Link>
		);
	}
	return (
		<Link
			sx={(theme: Theme): SystemStyleObject<Theme> => ({
				color: 'inherit',
				textDecoration: 'none',
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: '10px',
				backgroundColor: getThemeColor(theme, 'blue'),
				marginTop: '15px',
				width: '80%',
				'&:hover': {
					backgroundColor: '#3f91de'
				}
			})}
			component={Anchor}
			to={`/wishlists/${props.wishlist.id}`}
		>
			<Box>
				<Typography
					sx={{
						textAlign: 'center',
						textDecoration: 'none',
						margin: '10px',
						fontFamily: 'Montserrat',
						fontSize: {
							xs: '20px',
							md: '25px'
						},
						fontWeight: 500
					}}
				>
					{props.wishlist.name}
				</Typography>
			</Box>
		</Link>
	);
}
