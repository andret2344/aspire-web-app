import {mapFromResponse, UserData, UserDataResponse} from '@entity/UserData';

describe('UserData', (): void => {
	describe('mapFromResponse', (): void => {
		it('maps response with valid last_login to UserData', (): void => {
			// arrange
			const response: UserDataResponse = {
				id: 1,
				email: 'test@example.com',
				is_verified: true,
				last_login: '2024-01-15T10:30:00Z'
			};

			// act
			const result: UserData = mapFromResponse(response);

			// assert
			expect(result.id).toBe(1);
			expect(result.email).toBe('test@example.com');
			expect(result.isVerified).toBe(true);
			expect(result.lastLogin).toBeInstanceOf(Date);
			expect(result.lastLogin?.toISOString()).toBe('2024-01-15T10:30:00.000Z');
		});

		it('maps response with null last_login to UserData', (): void => {
			// arrange
			const response: UserDataResponse = {
				id: 2,
				email: 'newuser@example.com',
				is_verified: false,
				last_login: null
			};

			// act
			const result: UserData = mapFromResponse(response);

			// assert
			expect(result.id).toBe(2);
			expect(result.email).toBe('newuser@example.com');
			expect(result.isVerified).toBe(false);
			expect(result.lastLogin).toBeNull();
		});

		it('correctly converts is_verified to isVerified', (): void => {
			// arrange
			const verifiedResponse: UserDataResponse = {
				id: 1,
				email: 'verified@example.com',
				is_verified: true,
				last_login: null
			};
			const unverifiedResponse: UserDataResponse = {
				id: 2,
				email: 'unverified@example.com',
				is_verified: false,
				last_login: null
			};

			// act
			const verifiedResult: UserData = mapFromResponse(verifiedResponse);
			const unverifiedResult: UserData = mapFromResponse(unverifiedResponse);

			// assert
			expect(verifiedResult.isVerified).toBe(true);
			expect(unverifiedResult.isVerified).toBe(false);
		});

		it('correctly parses various date formats', (): void => {
			// arrange
			const response: UserDataResponse = {
				id: 1,
				email: 'test@example.com',
				is_verified: true,
				last_login: '2024-12-25T15:45:30.123Z'
			};

			// act
			const result: UserData = mapFromResponse(response);

			// assert
			expect(result.lastLogin).toBeInstanceOf(Date);
			expect(result.lastLogin?.getFullYear()).toBe(2024);
			expect(result.lastLogin?.getMonth()).toBe(11); // December is month 11 (0-indexed)
			expect(result.lastLogin?.getDate()).toBe(25);
		});
	});
});
