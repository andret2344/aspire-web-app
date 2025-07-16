import React from 'react';
import {Outlet} from 'react-router-dom';

export function AuthLayout(): React.ReactElement {
	return <Outlet />;
}
