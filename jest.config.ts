module.exports = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	resetMocks: true,
	clearMocks: true,
	setupFilesAfterEnv: [
		'@testing-library/jest-dom',
		'<rootDir>/jest.setup.js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
		'^.+\\.css$': '<rootDir>/cssTransform.js'
	},
	coverageThreshold: {
		global: {
			statements: 95,
			branches: 85,
			functions: 95,
			lines: 95
		}
	},
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'^react-i18next$': '<rootDir>/src/tests/__mocks__/MockI18n.ts'
	},
	testMatch: ['**/?(*.)+(spec|test).(ts|tsx)'],
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.{types,stories,constants,test,spec}.{ts,tsx}',
		'!src/App.tsx',
		'!src/index.{ts,tsx,html}',
		'!src/Styles/**',
		'!src/Types/**'
	],
	reporters: [
		'default',
		[
			'jest-junit',
			{
				outputDirectory: 'coverage/reports',
				outputName: 'junit.xml'
			}
		]
	]
};
