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
		'\\.css$': '<rootDir>/cssTransform.js'
	},
	transformIgnorePatterns: ['node_modules/(?!@mdxeditor)'],
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
		'^@component/(.*)$': '<rootDir>/src/main/Component/$1',
		'^@entity/(.*)$': '<rootDir>/src/main/Entity/$1',
		'^@hook/(.*)$': '<rootDir>/src/main/Hook/$1',
		'^@layout/(.*)$': '<rootDir>/src/main/Layout/$1',
		'^@page/(.*)$': '<rootDir>/src/main/Page/$1',
		'^@service/(.*)$': '<rootDir>/src/main/Service/$1',
		'^@type/(.*)$': '<rootDir>/src/main/Type/$1',
		'^@util/(.*)$': '<rootDir>/src/main/Util/$1'
	},
	testMatch: ['**/?(*.)+(spec|test).(ts|tsx)'],
	collectCoverage: true,
	collectCoverageFrom: [
		'src/main/**/*.{ts,tsx}',
		'!src/main/App.tsx',
		'!src/main/index.{ts,tsx,html}',
		'!src/main/Util/**',
		'!src/main/Type/**',
		'!src/main/i18n.ts'
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
