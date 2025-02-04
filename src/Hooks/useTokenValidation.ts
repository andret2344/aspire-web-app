import React from 'react';
import {isTokenValid} from '../Services/AuthService';

export interface TokenValidationResult {
	readonly tokenLoading: boolean;
	readonly tokenValid?: boolean;
}

export function useTokenValidation(timeout?: number): TokenValidationResult {
	const [valid, setValid] = React.useState<boolean | undefined>(undefined);
	const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect((): void => {
		timeout ? setTimeout(run, timeout) : run();
	}, [timeout]);

	function run(): void {
		setValid(isTokenValid());
		setLoading(false);
	}

	return {tokenLoading: loading, tokenValid: valid};
}
