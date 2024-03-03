export const mockedUseMediaQuery: jest.Mock = jest.fn();

jest.mock('@mui/material', () => ({
	...jest.requireActual('@mui/material'),
	useMediaQuery: mockedUseMediaQuery
}));
