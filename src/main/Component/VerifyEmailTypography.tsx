import {Typography, TypographyProps} from '@mui/material';
import React from 'react';

export function VerifyEmailTypography(
	props: TypographyProps
): React.ReactElement {
	return (
		<Typography
			align='center'
			fontFamily='Montserrat'
			fontWeight={400}
			marginTop='10px'
			{...props}
		>
			{props.children}
		</Typography>
	);
}
