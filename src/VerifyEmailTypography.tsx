import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

export const VerifyEmailTypography = (props: TypographyProps) => {
	return (
		<Typography
			align={'center'}
			sx={{
				color: 'black',
				fontFamily: 'Montserrat',
				fontWeight: 400,
				marginTop: '10px',
			}}
			{...props}
		>
			{props.children}
		</Typography>
	);
};
