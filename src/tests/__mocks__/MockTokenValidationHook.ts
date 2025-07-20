export const mockedUseTokenValidation: jest.Mock = jest.fn();

jest.mock('../../main/Hooks/useTokenValidation', () => ({
	...jest.requireActual('../../main/Hooks/useTokenValidation'),
	useTokenValidation: mockedUseTokenValidation
}));
