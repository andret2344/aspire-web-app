import React from 'react';
import {None} from '../../main/Types/None';

export const mockedUseParams: jest.Mock = jest.fn();
export const mockedNavigate: jest.Mock = jest.fn();
export const mockedJwtDecode: jest.Mock = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: mockedUseParams,
	useNavigate: () => mockedNavigate
}));

jest.mock('jwt-decode', () => ({
	...jest.requireActual('jwt-decode'),
	jwtDecode: mockedJwtDecode
}));

jest.mock('react-i18next', () => ({
	...jest.requireActual('react-i18next'),
	useTranslation: () => ({
		t: (key: string) => key,
		i18n: {language: 'en', changeLanguage: jest.fn()}
	}),
	Trans: (props: React.PropsWithChildren<None>): React.ReactElement => (
		<>{props.children}</>
	)
}));
