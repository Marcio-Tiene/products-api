/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: 'v8',
  roots: ['<rootDir>/'],
  testMatch: ['**/__tests__/**/*.[jt]s', '**/?(*.)+(spec|test).[tj]s'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  }
};
