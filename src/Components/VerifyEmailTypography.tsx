import {Typography, TypographyProps} from '@mui/material';
import React from 'react';

export const VerifyEmailTypography: React.FC<TypographyProps> = (
	props: TypographyProps
): React.ReactElement => {
	return (
		<Typography
			align={'center'}
			sx={{
				fontFamily: 'Montserrat',
				fontWeight: 400,
				marginTop: '10px'
			}}
			{...props}
		>
			{props.children}
		</Typography>
	);
};
