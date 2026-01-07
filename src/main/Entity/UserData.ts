export interface UserData {
	readonly email: string;
	readonly isVerified: boolean;
	readonly lastLogin: Date | null;
}

export interface UserDataResponse {
	readonly email: string;
	readonly is_verified: boolean;
	readonly last_login: string | null;
}

export function mapFromResponse(response: UserDataResponse): UserData {
	const {email, is_verified, last_login} = response;
	return {
		email,
		isVerified: is_verified,
		lastLogin: last_login === null ? null : new Date(last_login)
	};
}
