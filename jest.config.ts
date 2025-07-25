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
		'^@components/(.*)$': '<rootDir>/src/main/Components/$1',
		'^@entity/(.*)$': '<rootDir>/src/main/Entity/$1',
		'^@hooks/(.*)$': '<rootDir>/src/main/Hooks/$1',
		'^@layouts/(.*)$': '<rootDir>/src/main/Layouts/$1',
		'^@pages/(.*)$': '<rootDir>/src/main/Pages/$1',
		'^@service/(.*)$': '<rootDir>/src/main/Service/$1',
		'^@type/(.*)$': '<rootDir>/src/main/Types/$1',
		'^@utils/(.*)$': '<rootDir>/src/main/Utils/$1'
	},
	testMatch: ['**/?(*.)+(spec|test).(ts|tsx)'],
	collectCoverage: true,
	collectCoverageFrom: [
		'src/main/**/*.{ts,tsx}',
		'!src/main/App.tsx',
		'!src/main/index.{ts,tsx,html}',
		'!src/main/Utils/**',
		'!src/main/Types/**',
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
