export default {
  // Jest preset for TypeScript support.
  // Uses `ts-jest` to enable TypeScript in Jest.
  preset: 'ts-jest',

  // Defines how Jest should transform files before running tests.
  // Uses Babel to process JavaScript and TypeScript files.
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Specifies the test environment.
  // 'jsdom' simulates a browser-like environment (needed for React tests).
  testEnvironment: 'jsdom',

  // An array of setup files that run after Jest initializes.
  // Useful for configuring global test settings or mocking APIs.
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],

  // Maps module paths to specific mocks.
  // - Mocks CSS and SCSS files using `identity-obj-proxy` to prevent Jest errors.
  // - Ensures styles do not interfere with tests.
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },

  // Enables code coverage collection during test execution.
  // Helps track which parts of the code are covered by tests.
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // Output formats
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'], // Include files

  // Defines the minimum acceptable code coverage percentages.
  // - If coverage is below these thresholds, tests will fail.
  // - Ensures better code quality and test completeness.
  coverageThreshold: {
    // Set min coverage %
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
