export const mockedUseTokenValidation: jest.Mock = jest.fn();

jest.mock('@hook/useTokenValidation', () => ({
	...jest.requireActual('@hook/useTokenValidation'),
	useTokenValidation: mockedUseTokenValidation
}));
