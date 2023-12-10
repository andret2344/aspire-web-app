import type {Config} from 'jest';

export default async (): Promise<Config> => {
	return {
		verbose: true,
		preset: 'ts-jest',
		testEnvironment: 'jsdom',
		setupFilesAfterEnv: ['@testing-library/jest-dom'],
		transform: {
			'^.+\\.(ts|tsx)$': 'ts-jest',
			'^.+\\.css$': '<rootDir>/cssTransform.js'
		},
		moduleNameMapper: {
			'\\.(css|less|scss|sass)$': 'identity-obj-proxy'
		},
		testMatch: ['**/?(*.)+(spec|test).(ts|tsx)']
	};
};
