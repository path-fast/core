/**
 * Tests for src/utils/write-read-json.ts
 */

import { readJsonFile, writeToJsonFile } from '../../src/utils/write-read-json.js';
import type { PathEntry } from '../../src/@types/index.js';
import { samplePathEntries } from '../fixtures/sample-data.js';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

// Mock the json-path module
jest.mock('../../src/utils/json-path.js', () => ({
  filePath: '/mock/path/to/paths.json',
}));

import { existsSync, readFileSync, writeFileSync } from 'fs';

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockWriteFileSync = writeFileSync as jest.MockedFunction<typeof writeFileSync>;

describe('write-read-json', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readJsonFile', () => {
    it('should return parsed JSON data when file exists', () => {
      const mockData = samplePathEntries;
      const mockJsonString = JSON.stringify(mockData);

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(mockJsonString);

      const result = readJsonFile('path');

      expect(mockExistsSync).toHaveBeenCalledWith('/mock/path/to/paths.json');
      expect(mockReadFileSync).toHaveBeenCalledWith('/mock/path/to/paths.json', 'utf-8');
      expect(result).toEqual(mockData);
    });

    it('should return empty array when file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const result = readJsonFile('path');

      expect(mockExistsSync).toHaveBeenCalledWith('/mock/path/to/paths.json');
      expect(mockReadFileSync).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle empty JSON file', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('[]');

      const result = readJsonFile('path');

      expect(result).toEqual([]);
    });

    it('should handle file with valid JSON but not PathEntry format', () => {
      const invalidData = { invalid: 'data' };
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(invalidData));

      const result = readJsonFile('path');

      expect(result).toEqual(invalidData);
    });

    it('should throw error for invalid JSON', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('invalid json content');

      expect(() => readJsonFile('path')).toThrow();
    });

    it('should handle file read errors', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      expect(() => readJsonFile('path')).toThrow('File read error');
    });
  });

  describe('writeToJsonFile', () => {
    it('should write valid JSON data to file', () => {
      const mockData: PathEntry[] = samplePathEntries;
      const expectedJsonString = JSON.stringify(mockData, null, 2);

      writeToJsonFile('path', mockData);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/mock/path/to/paths.json',
        expectedJsonString,
        'utf-8'
      );
    });

    it('should write empty array to file', () => {
      const mockData: PathEntry[] = [];
      const expectedJsonString = JSON.stringify(mockData, null, 2);

      writeToJsonFile('path',mockData);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/mock/path/to/paths.json',
        expectedJsonString,
        'utf-8'
      );
    });

    it('should handle single entry array', () => {
      const mockData: PathEntry[] = [samplePathEntries[0]];
      const expectedJsonString = JSON.stringify(mockData, null, 2);

      writeToJsonFile('path',mockData);

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        '/mock/path/to/paths.json',
        expectedJsonString,
        'utf-8'
      );
    });

    it('should handle file write errors', () => {
      const mockData: PathEntry[] = samplePathEntries;
      
      mockWriteFileSync.mockImplementation(() => {
        throw new Error('File write error');
      });

      expect(() => writeToJsonFile('path',mockData)).toThrow('File write error');
    });

    it('should format JSON with proper indentation', () => {
      const mockData: PathEntry[] = [
        {
          path: '/test/path',
          command: 'test-cmd',
          additional: ['cmd1', 'cmd2']
        }
      ];

      writeToJsonFile('path',mockData);

      const writtenContent = (mockWriteFileSync as jest.Mock).mock.calls[0][1];
      
      // Check that the JSON is properly formatted with 2-space indentation
      expect(writtenContent).toContain('  "path": "/test/path"');
      expect(writtenContent).toContain('  "command": "test-cmd"');
      expect(writtenContent).toContain('  "additional": [');
    });

    it('should handle data with special characters', () => {
      const mockData: PathEntry[] = [
        {
          path: '/path/with spaces/and-special_chars',
          command: 'cmd-with_special.chars',
          additional: ['echo "hello world"', 'npm run test:watch']
        }
      ];

      writeToJsonFile('path',mockData);

      expect(mockWriteFileSync).toHaveBeenCalled();
      
      const writtenContent = (mockWriteFileSync as jest.Mock).mock.calls[0][1];
      const parsedContent = JSON.parse(writtenContent);
      
      expect(parsedContent).toEqual(mockData);
    });

    it('should maintain data integrity (read after write)', () => {
      const mockData: PathEntry[] = samplePathEntries;
      const expectedJsonString = JSON.stringify(mockData, null, 2);

      // First write
      writeToJsonFile('path',mockData);
      
      // Simulate file system having the written data
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(expectedJsonString);
      
      // Then read
      const readResult = readJsonFile('path');
      
      expect(readResult).toEqual(mockData);
    });
  });
});