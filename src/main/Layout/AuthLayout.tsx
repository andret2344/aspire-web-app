import React from 'react';
import {NavigateFunction, Outlet, useNavigate} from 'react-router-dom';
import {useTokenValidation} from '../Hook/useTokenValidation';

export function AuthLayout(): React.ReactElement {
	const {tokenLoading, tokenValid} = useTokenValidation();
	const navigate: NavigateFunction = useNavigate();

	React.useEffect((): void => {
		if (tokenLoading) {
			return;
		}
		if (tokenValid) {
			navigate('/wishlists');
		}
	}, [tokenLoading, tokenValid, navigate]);

	if (tokenLoading || tokenValid) {
		return <></>;
	}
	return <Outlet />;
}
