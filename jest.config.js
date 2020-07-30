module.exports = {
	preset: 'ts-jest',
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	testEnvironment: 'node',
	setupFilesAfterEnv: ['./test/lib/setup.ts'],
	collectCoverage: false,
	coverageReporters: ['text', 'html'],
	coverageDirectory: '<rootDir>/coverage/',
};
