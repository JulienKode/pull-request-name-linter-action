module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@commitlint/load': '<rootDir>/test/__mocks__/commitlint-load.js',
    '@commitlint/lint': '<rootDir>/test/__mocks__/commitlint-lint.js'
  },
  verbose: true
}
