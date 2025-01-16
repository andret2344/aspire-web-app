import React from 'react';
import {Box, IconButton, Link, Theme, Typography} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {getThemeColor} from '../Styles/theme';
import {WishList} from '../Entity/WishList';
import {Link as Anchor} from 'react-router-dom';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import {AccessPasswordModal} from './AccessPasswordModal';

interface WishlistSidebarItemProps {
	readonly wishlist: WishList;
	readonly active: boolean;
	readonly onShare: () => void;
	readonly onRemove: () => void;
	readonly onDisplay: () => React.ReactElement;
	readonly getWishlistHiddenItems: (id: number) => void;
}

export function WishlistSidebarItem(
	props: WishlistSidebarItemProps
): React.ReactElement {
	const [revealPassModalOpened, setRevealPassModalOpened] =
		React.useState<boolean>(false);
	const toggleRevealPassModal = (): void => {
		setRevealPassModalOpened((prev): boolean => !prev);
		console.log(props.wishlist);
	};

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
					{props.onDisplay()}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<IconButton
							data-testid={`shareIcon-${props.wishlist.id}`}
							onClick={props.onShare}
							size='large'
							aria-label='share'
						>
							<ShareIcon />
						</IconButton>
						<IconButton
							data-testid={'hidden-items-icon-button'}
							onClick={toggleRevealPassModal}
							size='large'
							aria-label={'access-password-modal'}
						>
							<VisibilityRoundedIcon />
						</IconButton>
						<IconButton
							onClick={props.onRemove}
							size='large'
							aria-label={`delete-wishlist-${props.wishlist.id}`}
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				</Box>
				<AccessPasswordModal
					wishlist={props.wishlist}
					setHidePassModalOpened={() => undefined}
					hidePassModalOpened={false}
					setRevealPassModalOpened={toggleRevealPassModal}
					revealPassModalOpened={revealPassModalOpened}
					getWishlistHiddenItems={props.getWishlistHiddenItems}
				/>
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
