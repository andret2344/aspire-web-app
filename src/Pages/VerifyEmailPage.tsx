import React from 'react';
import {AuthComponent} from '../Components/AuthComponent';
import {Box, Button, Link, Typography} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {VerifyEmailTypography} from '../Components/VerifyEmailTypography';
import {useTranslation} from 'react-i18next';

export const VerifyEmailPage: React.FC = (): React.ReactElement => {
	const emailPlaceholder: string = 'andret@wishlist.com';
	const handleClick = (): void => console.log('Resend');
	const {t} = useTranslation();

	return (
		<AuthComponent>
			<Box
				marginTop={'10px'}
				marginX={'20px'}
				marginBottom={'5px'}
				display={'flex'}
				alignItems={'center'}
				flexDirection={'column'}
			>
				<EmailOutlinedIcon sx={{fontSize: '74px'}} />
				<VerifyEmailTypography>
					{t('Please verify your e-mail.')}
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					{t('We sent an email to')}:
				</VerifyEmailTypography>
				<VerifyEmailTypography
					sx={{
						fontWeight: 900
					}}
				>
					{emailPlaceholder}
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					{t('Just click on the link in that email to complete your')}
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					{t("Didn't receive the email?")}
				</VerifyEmailTypography>
			</Box>
			<Button
				onClick={handleClick}
				variant='contained'
				sx={{
					marginTop: '0px'
				}}
				type={'submit'}
			>
				{t('Resend Verification E-mail')}
			</Button>
			<Box
				mt={'10px'}
				display={'flex'}
				alignItems={'center'}
				justifyContent={'center'}
			>
				<Typography
					sx={{
						fontFamily: 'Montserrat',
						marginRight: 0,
						paddingRight: 0,
						fontWeight: 400
					}}
				>
					{t('Already verified?')}
				</Typography>
				<Link
					href='#'
					sx={{
						paddingLeft: '3px',
						fontFamily: 'Montserrat',
						marginLeft: 0,
						textDecoration: 'underline',
						fontWeight: 400
					}}
				>
					{t('Sign in')}
				</Link>
			</Box>
		</AuthComponent>
	);
};
