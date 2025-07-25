import {mockedIsTokenValid} from '../__mocks__/MockAuthService';
import {act, renderHook} from '@testing-library/react';
import {
	TokenValidationResult,
	useTokenValidation
} from '../../main/Hook/useTokenValidation';

describe('useTokenValidation', (): void => {
	test('returns loading=true initially', (): void => {
		// arrange
		const {result} = renderHook(
			(): TokenValidationResult => useTokenValidation(50)
		);

		// assert
		expect(result.current.tokenLoading).toBe(true);
		expect(result.current.tokenValid).toBeUndefined();
	});

	test('returns valid=true when the token is valid', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);

		// act
		const {result} = renderHook(
			(): TokenValidationResult => useTokenValidation()
		);
		await act(async (): Promise<void> => undefined); // Wait for useEffect to process

		// assert
		expect(result.current.tokenLoading).toBe(false);
		expect(result.current.tokenValid).toBe(true);
	});

	test('should return valid=false when the token is invalid', async (): Promise<void> => {
		// arrange
		mockedIsTokenValid.mockReturnValue(false);

		// act
		const {result} = renderHook(
			(): TokenValidationResult => useTokenValidation()
		);
		await act(async (): Promise<void> => undefined); // Wait for useEffect to process

		// assert
		expect(result.current.tokenLoading).toBe(false);
		expect(result.current.tokenValid).toBe(false);
	});
});
