export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'apps/**/*.ts',
    'packages/**/*.ts',
    'shared/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: '<rootDir>/../coverage',
  moduleNameMapper: {
    '^@hds/core$': '<rootDir>/../packages/core/src',
    '^@hds/infrastructure$': '<rootDir>/../packages/infrastructure/src',
    '^@hds/shared$': '<rootDir>/../shared/src',
  },
};
