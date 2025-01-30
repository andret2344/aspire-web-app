import React from 'react';

export const mockedUseParams = jest.fn();
export const mockedUseNavigate = jest.fn();
export const mockedJwtDecode = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: mockedUseParams,
	useNavigate: () => mockedUseNavigate,
	Navigate: jest.fn(
		({to}): React.ReactElement => <div data-testid='navigate'>{to}</div>
	)
}));

jest.mock('jwt-decode', () => ({
	...jest.requireActual('jwt-decode'),
	jwtDecode: mockedJwtDecode
}));
