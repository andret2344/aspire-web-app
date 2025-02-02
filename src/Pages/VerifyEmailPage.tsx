import React from 'react';
import {AuthContainer} from '../Components/AuthContainer';
import {Box, Button, Link, Typography} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {VerifyEmailTypography} from '../Components/VerifyEmailTypography';
import {useTranslation} from 'react-i18next';

export function VerifyEmailPage(): React.ReactElement {
	const emailPlaceholder: string = 'andret@wishlist.com';
	const {t} = useTranslation();

	function handleClick(): void {
		return console.log('Resend');
	}

	return (
		<AuthContainer>
			<Box
				marginTop='10px'
				marginX='20px'
				marginBottom='5px'
				display='flex'
				alignItems='center'
				flexDirection='column'
			>
				<EmailOutlinedIcon sx={{fontSize: '74px'}} />
				<VerifyEmailTypography>
					{t('verify-email')}
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					{t('email-sent')}:
				</VerifyEmailTypography>
				<VerifyEmailTypography
					sx={{
						fontWeight: 900
					}}
				>
					{emailPlaceholder}
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					{t('click-the-link')}
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					{t('no-email-received')}
				</VerifyEmailTypography>
			</Box>
			<Button
				onClick={handleClick}
				variant='contained'
				sx={{
					marginTop: '0px'
				}}
				type='submit'
			>
				{t('resend-email')}
			</Button>
			<Box
				mt='10px'
				display='flex'
				alignItems='center'
				justifyContent='center'
			>
				<Typography
					sx={{
						fontFamily: 'Montserrat',
						marginRight: 0,
						paddingRight: 0,
						fontWeight: 400
					}}
				>
					{t('already-verified')}
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
					{t('sign-in')}
				</Link>
			</Box>
		</AuthContainer>
	);
}
