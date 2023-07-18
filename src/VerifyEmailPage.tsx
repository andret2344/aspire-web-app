import React from 'react';
import { AuthComponent } from './AuthComponent';
import { Box, Button, Link, Typography } from '@mui/material';
import { theme } from './theme';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { VerifyEmailTypography } from './VerifyEmailTypography';

export const VerifyEmailPage = () => {
	const emailPlaceholder = 'andret@wishlist.com';
	const handleClick = () => console.log('Resend');

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
				<EmailOutlinedIcon sx={{ fontSize: '74px' }} />
				<VerifyEmailTypography>
					Please verify your e-mail.
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					We sent an email to:
				</VerifyEmailTypography>
				<VerifyEmailTypography
					sx={{
						fontWeight: 900,
					}}
				>
					{emailPlaceholder}
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					Just click on the link in that email to complete your
					register. If you don’t see it, you may check your spam
					folder
				</VerifyEmailTypography>
				<VerifyEmailTypography>
					Didn&apos;t receive the email?
				</VerifyEmailTypography>
			</Box>
			<Button
				onClick={handleClick}
				variant="contained"
				sx={{
					marginTop: '0px',
					backgroundColor: theme.palette.otherColor.mainBlue,
				}}
				type={'submit'}
			>
				Resend Verification E-mail
			</Button>
			<Box
				mt={'10px'}
				display={'flex'}
				alignItems={'center'}
				justifyContent={'center'}
			>
				<Typography
					sx={{
						color: 'black',
						fontFamily: 'Montserrat',
						marginRight: 0,
						paddingRight: 0,
						fontWeight: 400,
					}}
				>
					Already verified?
				</Typography>
				<Link
					href="#"
					sx={{
						paddingLeft: '3px',
						fontFamily: 'Montserrat',
						marginLeft: 0,
						color: 'black',
						textDecoration: 'underline',
						fontWeight: 400,
					}}
				>
					Sign in
				</Link>
			</Box>
		</AuthComponent>
	);
};
