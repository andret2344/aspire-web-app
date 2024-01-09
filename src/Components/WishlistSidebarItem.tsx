import React from 'react';
import {Box, Link, Typography, IconButton} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import {getThemeColor} from '../Styles/theme';
import {WishList} from '../Entity/WishList';
import {Link as Anchor} from 'react-router-dom';

interface WishlistSidebarItemProps {
	readonly wishlist: WishList;
	readonly active: boolean;
	readonly onShare: () => void;
	readonly onRemove: () => void;
	readonly onDisplay: () => React.ReactElement;
}

export const WishlistSidebarItem: React.FC<WishlistSidebarItemProps> = (
	props: WishlistSidebarItemProps
): React.ReactElement => {
	if (props.active) {
		return (
			<Link
				sx={(
					theme
				): {
					cursor: 'pointer';
					backgroundColor: string | undefined;
					color: 'inherit';
					alignItems: 'center';
					borderRadius: '10px';
					flexDirection: 'column';
					display: 'flex';
					width: string;
					textDecoration: 'none';
					'&:hover': {backgroundColor: string};
					justifyContent: 'center';
					marginTop: '15px';
				} => ({
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
							onClick={props.onShare}
							sx={{marginLeft: '15px'}}
							size='large'
							aria-label={'share'}
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
							aria-label={'delete'}
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
			sx={(
				theme
			): {
				cursor: 'pointer';
				backgroundColor: string | undefined;
				color: 'inherit';
				alignItems: 'center';
				borderRadius: '10px';
				flexDirection: 'column';
				display: 'flex';
				width: string;
				textDecoration: 'none';
				'&:hover': {backgroundColor: string};
				justifyContent: 'center';
				marginTop: '15px';
			} => ({
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
};
