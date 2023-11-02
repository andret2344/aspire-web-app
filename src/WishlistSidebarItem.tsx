import React from 'react';
import {Box, Link, Typography} from '@mui/material';
import {getThemeColor} from './theme';
import {WishList} from './Entity/WishList';
import {Link as Anchor} from 'react-router-dom';

interface WishlistSidebarItemProps {
	readonly wishlist: WishList;
}

export const WishlistSidebarItem: React.FC<WishlistSidebarItemProps> = (
	props: WishlistSidebarItemProps
): React.ReactElement => {
	return (
		<Link
			sx={(theme) => ({
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
				width: {
					xs: '100%',
					md: '80%'
				},
				'&:hover': {
					backgroundColor: 'rgba(0, 109, 209, 0.4)'
				}
			})}
			component={Anchor}
			to={`/wishlists/${props.wishlist.id}`}
		>
			<Box>
				<Typography
					sx={{
						textDecoration: 'none',
						margin: '10px',
						fontFamily: 'Montserrat',
						fontSize: '25px',
						fontWeight: 500
					}}
				>
					{props.wishlist.name}
				</Typography>
			</Box>
		</Link>
	);
};
