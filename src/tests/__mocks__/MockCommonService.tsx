import React from 'react';
import {None} from '../../Types/None';

export const mockedUseParams: jest.Mock = jest.fn();
export const mockedUseNavigate: jest.Mock = jest.fn();
export const mockedJwtDecode: jest.Mock = jest.fn();

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

jest.mock('react-i18next', () => ({
	...jest.requireActual('react-i18next'),
	Trans: (props: React.PropsWithChildren<None>) => props.children
}));
