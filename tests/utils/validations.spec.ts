/**
 * Tests for src/utils/validations.ts
 */

import { validatePathExists, checkIfExistsInJson } from '../../src/utils/validations.js';
import type { PathEntry } from '../../src/@types/index.js';
import type { PathLike } from 'fs';

// Mock fs and process modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('process', () => ({
  cwd: jest.fn(),
}));

jest.mock('os', () => ({
  homedir: jest.fn(),
}));

import { existsSync } from 'fs';
import { cwd } from 'process';
import { homedir } from 'os';

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockCwd = cwd as jest.MockedFunction<typeof cwd>;
const mockHomedir = homedir as jest.MockedFunction<typeof homedir>;

describe('validations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCwd.mockReturnValue('/current/working/directory');
    mockHomedir.mockReturnValue('/home/testuser');
  });

  describe('validatePathExists', () => {
    it('should return current working directory for "." path', () => {
      const result = validatePathExists('.');
      expect(result).toBe('/current/working/directory');
      expect(mockCwd).toHaveBeenCalled();
    });

    it('should return absolute path when it exists relative to cwd', () => {
      const projectPath = '/relative/path';
      const expectedPath = '/current/working/directory/relative/path';
      
      mockExistsSync.mockImplementation((path: PathLike) => path === expectedPath);

      const result = validatePathExists(projectPath);
      
      expect(result).toBe(expectedPath);
      expect(mockExistsSync).toHaveBeenCalledWith(expectedPath);
    });

    it('should return absolute path when it exists relative to home', () => {
      const projectPath = '/relative/path';
      const cwdPath = '/current/working/directory/relative/path';
      const homePath = '/home/testuser/relative/path';
      
      mockExistsSync.mockImplementation((path: PathLike) => {
        if (path === cwdPath) return false;
        if (path === homePath) return true;
        return false;
      });

      const result = validatePathExists(projectPath);
      
      expect(result).toBe(homePath);
      expect(mockExistsSync).toHaveBeenCalledWith(cwdPath);
      expect(mockExistsSync).toHaveBeenCalledWith(homePath);
    });

    it('should throw error when path does not exist', () => {
      const projectPath = '/nonexistent/path';
      mockExistsSync.mockReturnValue(false);

      expect(() => validatePathExists(projectPath)).toThrow(
        `The path "${projectPath}" does not exist.`
      );
    });

    it('should handle empty path string', () => {
      mockExistsSync.mockReturnValue(false);
      
      expect(() => validatePathExists('')).toThrow(
        'The path "" does not exist.'
      );
    });

    it('should handle paths with special characters', () => {
      const projectPath = '/path with spaces/special-chars_123';
      const expectedPath = '/current/working/directory/path with spaces/special-chars_123';
      
      mockExistsSync.mockImplementation((path: PathLike) => path === expectedPath);

      const result = validatePathExists(projectPath);
      
      expect(result).toBe(expectedPath);
    });
  });

  describe('checkIfExistsInJson', () => {
    const mockData: PathEntry[] = [
      {
        path: '/existing/path1',
        command: 'existing-cmd1',
        additional: [],
        ideCommand: 'code .'
      },
      {
        path: '/existing/path2',
        command: 'existing-cmd2',
        additional: ['npm install'],
        ideCommand: 'code .'
      }
    ];

    it('should return false when path and command do not exist', () => {
      const result = checkIfExistsInJson(mockData, '/new/path', 'new-cmd');
      expect(result).toBe(false);
    });

    it('should throw error when path already exists', () => {
      expect(() => {
        checkIfExistsInJson(mockData, '/existing/path1', 'new-cmd');
      }).toThrow(
        'Error: The command "new-cmd" or the path "/existing/path1" already exists in the registry.'
      );
    });

    it('should throw error when command already exists', () => {
      expect(() => {
        checkIfExistsInJson(mockData, '/new/path', 'existing-cmd1');
      }).toThrow(
        'Error: The command "existing-cmd1" or the path "/new/path" already exists in the registry.'
      );
    });

    it('should throw error when both path and command exist', () => {
      expect(() => {
        checkIfExistsInJson(mockData, '/existing/path1', 'existing-cmd1');
      }).toThrow(
        'Error: The command "existing-cmd1" or the path "/existing/path1" already exists in the registry.'
      );
    });

    it('should handle empty data array', () => {
      const result = checkIfExistsInJson([], '/any/path', 'any-cmd');
      expect(result).toBe(false);
    });

    it('should be case sensitive for paths and commands', () => {
      // Path differs in case and command does not exist
      const result1 = checkIfExistsInJson(mockData, '/EXISTING/PATH1', 'new-cmd');
      // Command differs in case and path does not exist
      const result2 = checkIfExistsInJson(mockData, '/new/path', 'EXISTING-CMD1');
      
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('should handle paths with trailing slashes', () => {
      const dataWithTrailingSlash: PathEntry[] = [
        {
          path: '/existing/path/',
          command: 'existing-cmd',
          additional: [],
          ideCommand: 'code .'
        }
      ];

      expect(() => {
        checkIfExistsInJson(dataWithTrailingSlash, '/existing/path/', 'new-cmd');
      }).toThrow();

      // Different path without trailing slash should not match
      const result = checkIfExistsInJson(dataWithTrailingSlash, '/existing/path', 'new-cmd');
      expect(result).toBe(false);
    });
  });
});