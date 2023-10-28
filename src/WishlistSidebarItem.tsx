import React from 'react';
import { Box, Typography } from '@mui/material';
import { getThemeColor } from './theme';
import { WishList } from './Entity/WishList';

interface WishlistSidebarItemProps {
	readonly wishlist: WishList;
}

export const WishlistSidebarItem = (props: WishlistSidebarItemProps) => {
	const handleClick = () => {
		console.log('Wishlist listing item clicked');
	};

	return (
		<Box
			onClick={handleClick}
			sx={(theme) => ({
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
					md: '80%',
				},
				'&:hover': {
					backgroundColor: 'rgba(0, 109, 209, 0.4)',
				},
			})}
		>
			<Typography
				sx={{
					margin: '10px',
					fontFamily: 'Montserrat',
					fontSize: '25px',
					fontWeight: 500,
				}}
			>
				{props.wishlist.name}
			</Typography>
		</Box>
	);
};
