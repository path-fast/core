/**
 * Jest Setup File
 * This file runs before all tests and configures global test settings
 */

// Mock console methods to reduce noise during tests unless specifically needed
global.console = {
  ...console,
  // Uncomment next lines to silence output during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
  // table: jest.fn(),
};

// Global test timeout (30 seconds)
jest.setTimeout(30000);

// Suppress experimental warnings in Node.js
process.env.NODE_NO_WARNINGS = '1';

// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit;
beforeAll(() => {
  process.exit = jest.fn() as never;
});

afterAll(() => {
  process.exit = originalExit;
});