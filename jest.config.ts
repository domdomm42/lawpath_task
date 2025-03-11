import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "<rootDir>/src/__tests__/unit/**/?(*.)+(spec|test).[jt]s?(x)",
    "<rootDir>/src/__tests__/integration/**/?(*.)+(spec|test).[jt]s?(x)",
    "<rootDir>/src/__tests__/e2e/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/__mocks__/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
};

export default createJestConfig(config);
