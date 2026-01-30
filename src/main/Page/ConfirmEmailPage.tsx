import React, {RefObject} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {Box, CircularProgress, Typography} from '@mui/material';
import {confirmEmail} from '@service/AuthService';

export function ConfirmEmailPage(): React.ReactElement {
	type Params = {
		readonly token: string;
	};
	const params: Params = useParams<Params>() as Params;
	const {t} = useTranslation();
	const [result, setResult] = React.useState<boolean | undefined>(undefined);
	const requestLockRef: RefObject<string | null> = React.useRef<string | null>(null);

	React.useEffect((): void => {
		const token: string = params.token;
		if (!token) {
			setResult(false);
			return;
		}

		if (requestLockRef.current === token) {
			return;
		}
		requestLockRef.current = token;

		confirmEmail(token)
			.then((): void => setResult(true))
			.catch((): void => setResult(false));
	}, [params.token]);

	function renderContent(): React.ReactElement {
		if (result) {
			return (
				<div>
					<Typography
						variant='h4'
						textAlign='center'
					>
						{t('auth.email-confirmed')}
					</Typography>
					<Typography
						variant='h6'
						textAlign='center'
					>
						{t('auth.email-confirmed-message')}
					</Typography>
				</div>
			);
		}
		return (
			<div>
				<Typography
					variant='h4'
					textAlign='center'
				>
					{t('auth.email-not-confirmed')}
				</Typography>
				<Typography
					variant='h6'
					textAlign='center'
				>
					{t('auth.email-not-confirmed-message')}
				</Typography>
			</div>
		);
	}

	if (result === undefined) {
		return <CircularProgress size={18} />;
	}

	return (
		<Box
			height='100vh'
			flexDirection='column'
			display='flex'
			justifyContent='center'
			alignItems='center'
		>
			{renderContent()}
		</Box>
	);
}
