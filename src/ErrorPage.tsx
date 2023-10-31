import { Box, Typography } from '@mui/material';
import React from 'react';

export const ErrorPage: React.FC = (): React.ReactElement => {
	return (
		<Box
			sx={{
				height: '100vh',
				flexDirection: 'column',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Typography variant={'h4'}>Something went wrong.</Typography>
		</Box>
	);
};
