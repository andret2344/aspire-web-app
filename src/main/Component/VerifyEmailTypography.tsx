import React from 'react';
import {Typography, TypographyProps} from '@mui/material';

export function VerifyEmailTypography(props: TypographyProps): React.ReactElement {
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
