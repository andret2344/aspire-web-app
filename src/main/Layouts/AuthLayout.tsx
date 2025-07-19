import React from 'react';
import {NavigateFunction, Outlet, useNavigate} from 'react-router-dom';
import {useTokenValidation} from '../Hooks/useTokenValidation';

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
	}, []);

	if (tokenLoading) {
		return <></>;
	}
	return <Outlet />;
}
