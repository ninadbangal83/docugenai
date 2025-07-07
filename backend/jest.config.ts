import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js)"],
  clearMocks: true,
  collectCoverage: true, // Enables coverage collection
  coverageDirectory: "coverage", // Output directory for coverage reports
  coverageReporters: ["json", "lcov", "text", "clover"], // Types of reports to generate
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"], // Files to include in coverage
};

export default config;
