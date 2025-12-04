/**
 * Test Helpers and Utilities
 * Common functions and utilities used across multiple test files
 */

import os from 'os';
import path from 'path';
import type { PathEntry } from '../src/@types/index.js';

/**
 * Creates a mock PathEntry for testing
 */
export function createMockPathEntry(overrides: Partial<PathEntry> = {}): PathEntry {
  return {
    path: '/mock/path/to/project',
    command: 'mockCommand',
    additional: [],
    ...overrides,
  };
}

/**
 * Creates multiple mock PathEntry objects
 */
export function createMockPathEntries(count: number): PathEntry[] {
  return Array.from({ length: count }, (_, index) => createMockPathEntry({
    path: `/mock/path/to/project${index}`,
    command: `mockCommand${index}`,
    additional: index % 2 === 0 ? [] : ['npm install', 'npm start'],
  }));
}

/**
 * Creates a mock file system structure
 */
export function createMockFileSystem(): Record<string, string | boolean> {
  const homeDir = os.homedir();
  const configDir = path.join(homeDir, '.path-fast');
  const configFile = path.join(configDir, 'paths.json');

  return {
    [homeDir]: true,
    [configDir]: true,
    [configFile]: true,
    '/mock/path/to/project': true,
    '/mock/path/to/project1': true,
    '/mock/path/to/project2': true,
    '/existing/project/path': true,
    '/nonexistent/path': false,
  };
}

/**
 * Creates mock JSON content for paths.json
 */
export function createMockPathsJson(entries: PathEntry[] = []): string {
  return JSON.stringify(entries, null, 2);
}

/**
 * Mock process methods
 */
export const mockProcess = {
  cwd: jest.fn(() => '/current/working/directory'),
  chdir: jest.fn(),
  env: { ...process.env },
};

/**
 * Resets all mocks to their initial state
 */
export function resetAllMocks(): void {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.resetAllMocks();
}

/**
 * Waits for a specified amount of time
 * Useful for testing async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Captures console output during test execution
 */
export class ConsoleCapture {
  private originalLog: typeof console.log;
  private originalError: typeof console.error;
  private originalTable: typeof console.table;
  
  public logs: string[] = [];
  public errors: string[] = [];
  public tables: any[] = [];

  constructor() {
    this.originalLog = console.log;
    this.originalError = console.error;
    this.originalTable = console.table;
  }

  start(): void {
    console.log = (...args: any[]) => {
      this.logs.push(args.join(' '));
    };

    console.error = (...args: any[]) => {
      this.errors.push(args.join(' '));
    };

    console.table = (data: any) => {
      this.tables.push(data);
    };
  }

  stop(): void {
    console.log = this.originalLog;
    console.error = this.originalError;
    console.table = this.originalTable;
  }

  reset(): void {
    this.logs = [];
    this.errors = [];
    this.tables = [];
  }
}

/**
 * Creates a temporary directory path for testing
 */
export function getTempPath(suffix: string = ''): string {
  return path.join(os.tmpdir(), 'path-fast-test', suffix);
}

/**
 * Normalizes path for cross-platform testing
 */
export function normalizePath(filePath: string): string {
  return path.resolve(filePath.split('/').join(path.sep));
}