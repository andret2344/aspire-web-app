import {Box, Typography} from '@mui/material';
import React from 'react';
import {useTranslation} from 'react-i18next';

export const ErrorPage: React.FC = (): React.ReactElement => {
	const {t} = useTranslation();
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
			<Typography variant={'h4'}>{t('Something went wrong.')}</Typography>
		</Box>
	);
};
