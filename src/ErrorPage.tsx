import { Box, Typography } from '@mui/material';
import React from 'react';

export const ErrorPage = () => {
	return (
		<Box
			sx={{
				height: '100vh',
				flexDirection: 'column',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Typography variant={'h4'}>Page not found.</Typography>
		</Box>
	);
};
