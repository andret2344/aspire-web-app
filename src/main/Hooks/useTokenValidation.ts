import React from 'react';
import {isTokenValid} from '@services/AuthService';

export interface TokenValidationResult {
	readonly tokenLoading: boolean;
	readonly tokenValid?: boolean;
}

export function useTokenValidation(timeout?: number): TokenValidationResult {
	const [valid, setValid] = React.useState<boolean | undefined>(undefined);
	const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect((): void => {
		if (timeout) {
			setTimeout(run, timeout);
		} else {
			run();
		}
	}, [timeout]);

	function run(): void {
		setValid(isTokenValid());
		setLoading(false);
	}

	return {tokenLoading: loading, tokenValid: valid};
}
