export const mockedUseTokenValidation: jest.Mock = jest.fn();

jest.mock('../../main/Hook/useTokenValidation', () => ({
	...jest.requireActual('../../main/Hook/useTokenValidation'),
	useTokenValidation: mockedUseTokenValidation
}));
