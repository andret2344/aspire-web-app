import React from 'react';
import {NavigateFunction, Outlet, useNavigate} from 'react-router-dom';
import {useTokenValidation} from '@hook/useTokenValidation';
import {appPaths} from '../AppRoutes';

export function AuthLayout(): React.ReactElement {
	const {tokenLoading, tokenValid} = useTokenValidation();
	const navigate: NavigateFunction = useNavigate();

	React.useEffect((): void => {
		if (tokenLoading) {
			return;
		}
		if (tokenValid) {
			navigate(appPaths.wishlists, {replace: true});
		}
	}, [tokenLoading, tokenValid, navigate]);

	if (tokenLoading || tokenValid) {
		return <></>;
	}
	return <Outlet />;
}
