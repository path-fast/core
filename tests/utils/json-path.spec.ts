/**
 * Tests for src/utils/json-path.ts
 */

// We need to mock the modules before importing them
jest.mock('os', () => ({
  homedir: jest.fn(),
}));

jest.mock('path', () => ({
  resolve: jest.fn(),
  join: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

// Import the mocked modules
import { homedir } from 'os';
import { resolve, join } from 'path';
import fs from 'fs';

const mockHomedir = homedir as jest.MockedFunction<typeof homedir>;
const mockResolve = resolve as jest.MockedFunction<typeof resolve>;
const mockJoin = join as jest.MockedFunction<typeof join>;
const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const mockMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;

describe('json-path', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock returns
    mockHomedir.mockReturnValue('/home/testuser');
    mockJoin.mockImplementation((...args: string[]) => args.join('/'));
    mockResolve.mockImplementation((path: string) => path);
  });

  describe('module initialization', () => {
    it('should create config directory and set file path correctly', () => {
      // Setup mocks
      mockExistsSync.mockReturnValue(false); // Directory doesn't exist
      
      // Re-import the module to trigger initialization
      jest.isolateModules(() => {
        require('../../src/utils/json-path.js');
      });

      expect(mockHomedir).toHaveBeenCalled();
      expect(mockJoin).toHaveBeenCalledWith('/home/testuser', '.path-fast');
      expect(mockExistsSync).toHaveBeenCalled();
      expect(mockMkdirSync).toHaveBeenCalledWith('/home/testuser/.path-fast', { recursive: true });
    });

    it('should not create config directory if it already exists', () => {
      // Setup mocks
      mockExistsSync.mockReturnValue(true); // Directory exists
      
      // Re-import the module to trigger initialization
      jest.isolateModules(() => {
        require('../../src/utils/json-path.js');
      });

      expect(mockHomedir).toHaveBeenCalled();
      expect(mockJoin).toHaveBeenCalledWith('/home/testuser', '.path-fast');
      expect(mockExistsSync).toHaveBeenCalled();
      expect(mockMkdirSync).not.toHaveBeenCalled();
    });

    it('should construct correct file path', () => {
      mockResolve.mockReturnValue('/home/testuser/.path-fast/paths.json');
      
      // Re-import to get fresh filePath
      jest.isolateModules(() => {
        const { filePath } = require('../../src/utils/json-path.js');
        expect(mockResolve).toHaveBeenCalledWith('/home/testuser/.path-fast', 'paths.json');
        expect(filePath).toBe('/home/testuser/.path-fast/paths.json');
      });
    });

    it('should handle different home directories', () => {
      mockHomedir.mockReturnValue('/Users/macuser');
      mockExistsSync.mockReturnValue(false);
      
      jest.isolateModules(() => {
        require('../../src/utils/json-path.js');
      });

      expect(mockJoin).toHaveBeenCalledWith('/Users/macuser', '.path-fast');
      expect(mockMkdirSync).toHaveBeenCalledWith('/Users/macuser/.path-fast', { recursive: true });
    });

    it('should handle Windows-style paths', () => {
      mockHomedir.mockReturnValue('C:\\Users\\windowsuser');
      mockJoin.mockImplementation((...args: string[]) => args.join('\\'));
      mockExistsSync.mockReturnValue(false);
      
      jest.isolateModules(() => {
        require('../../src/utils/json-path.js');
      });

      expect(mockJoin).toHaveBeenCalledWith('C:\\Users\\windowsuser', '.path-fast');
      expect(mockMkdirSync).toHaveBeenCalledWith('C:\\Users\\windowsuser\\.path-fast', { recursive: true });
    });

    it('should handle fs.mkdirSync errors gracefully', () => {
      mockExistsSync.mockReturnValue(false);
      mockMkdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      expect(() => {
        jest.isolateModules(() => {
          require('../../src/utils/json-path.js');
        });
      }).toThrow('Permission denied');
    });

    it('should handle empty home directory', () => {
      mockHomedir.mockReturnValue('');
      mockExistsSync.mockReturnValue(false);
      
      jest.isolateModules(() => {
        require('../../src/utils/json-path.js');
      });

      expect(mockJoin).toHaveBeenCalledWith('', '.path-fast');
    });

    it('should export filePath correctly', () => {
      mockResolve.mockReturnValue('/expected/path/to/paths.json');
      
      jest.isolateModules(() => {
        const { filePath } = require('../../src/utils/json-path.js');
        expect(filePath).toBe('/expected/path/to/paths.json');
      });
    });

    it('should create directory with recursive option', () => {
      mockExistsSync.mockReturnValue(false);
      
      jest.isolateModules(() => {
        require('../../src/utils/json-path.js');
      });

      expect(mockMkdirSync).toHaveBeenCalledWith(
        expect.any(String),
        { recursive: true }
      );
    });

    it('should handle special characters in home directory path', () => {
      mockHomedir.mockReturnValue('/home/user with spaces & special-chars');
      mockExistsSync.mockReturnValue(false);
      
      jest.isolateModules(() => {
        require('../../src/utils/json-path.js');
      });

      expect(mockJoin).toHaveBeenCalledWith('/home/user with spaces & special-chars', '.path-fast');
      expect(mockMkdirSync).toHaveBeenCalledWith('/home/user with spaces & special-chars/.path-fast', { recursive: true });
    });
  });
});