import React from 'react';
import {Box, Link, Typography} from '@mui/material';
import {getThemeColor} from '../Styles/theme';
import {WishList} from '../Entity/WishList';
import {Link as Anchor} from 'react-router-dom';

interface WishlistSidebarItemProps {
	readonly wishlist: WishList;
	readonly readonly?: boolean;
}

export const WishlistSidebarItem: React.FC<WishlistSidebarItemProps> = (
	props: WishlistSidebarItemProps
): React.ReactElement => {
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
				width: {md: string; xs: string};
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
				width: {
					xs: '100%',
					md: '80%'
				},
				'&:hover': {
					backgroundColor: 'rgba(0, 109, 209, 0.4)'
				}
			})}
			component={Anchor}
			to={props.readonly ? '' : `/wishlists/${props.wishlist.id}`}
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
