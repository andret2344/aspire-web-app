import React from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Typography} from '@mui/material';

export function ErrorPage(): React.ReactElement {
	const {t} = useTranslation();

	return (
		<Box
			height='100vh'
			flexDirection='column'
			display='flex'
			justifyContent='center'
			alignItems='center'
		>
			<Typography variant='h4'>{t('messages.something-went-wrong')}</Typography>
		</Box>
	);
}
