export const mockedUseParams = jest.fn();
export const mockedUseNavigate = jest.fn();
export const mockedJwtDecode = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: mockedUseParams,
	useNavigate: () => mockedUseNavigate
}));

jest.mock('jwt-decode', () => ({
	...jest.requireActual('jwt-decode'),
	jwtDecode: mockedJwtDecode
}));
